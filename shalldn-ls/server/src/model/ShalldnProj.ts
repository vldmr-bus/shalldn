import ShalldnRqRef from './ShalldnRqRef';

import * as path from 'path';
import * as fs from 'fs/promises';
import * as rx  from 'rxjs';
import { CharStreams, CommonTokenStream, ParserRuleContext } from 'antlr4ts';
import { shalldnLexer } from '../antlr/shalldnLexer';
import { HeadingContext, ImplmntContext, RequirementContext, SentenceContext, shalldnParser, TitleContext, UlContext, Ul_elementContext } from '../antlr/shalldnParser';
import { shalldnListener } from '../antlr/shalldnListener';
import { Capabilities } from '../server';
import { DefinitionParams, Diagnostic, DiagnosticSeverity, Location, Range, _Connection } from 'vscode-languageserver';
import ShalldnRqDef from './ShalldnRqDef';
import { Util } from '../util';
import LexerErrorListener from '../LexerErrorListener';
import ParseErrorListener from '../ParseErrorListener';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';
import { Diagnostics, ShalldnDiagnostic } from '../Diagnostics';
import { URI } from 'vscode-uri';
import { Interval } from 'antlr4ts/misc/Interval';
class ShalldnProjectRqAnalyzer implements shalldnListener {
	constructor(
		private uri:string,
		private proj: ShalldnProj
	) { }

	public subject = '';
	private lastRq:RequirementContext | null = null;
	private lastHeading:HeadingContext | TitleContext | null=null;
	private headinStack:HeadingContext[]=[];

	getText(ctx: ParserRuleContext|undefined):string {
		if (!ctx)
			return '';
		let a = ctx.start.startIndex;
		let b = ctx.stop?.stopIndex || ctx.start.stopIndex;
		let interval = new Interval(a, b);
		let s = ctx.start.inputStream?.getText(interval)||'';
		return s;
	}

	exitRequirement(ctx:RequirementContext) {
		let id = ctx.bolded_id()?.IDENTIFIER()?.text || '';
		let range = Util.rangeOfContext(ctx);
		let def = {
			id,
			uri: this.uri,
			range,
			idRange: Util.rangeOfContext(ctx.bolded_id())
		};
		try {
			this.proj.addRequirement(def);
			//$$Implements Parser.ERR_NO_SUBJ
			let pre = this.getText(ctx._pre);
			if (this.subject && !pre.trim().endsWith(this.subject))
				this.proj.addDiagnostic(
					this.uri,
					Diagnostics.error(
					`The requirement subject is different from the document subject ${this.subject}.`,
					Util.rangeOfContext(ctx._pre)
				));
		} catch (e: any) {
			this.proj.addDiagnostic(this.uri,Diagnostics.error(e, def.idRange));
		}
		this.lastRq = ctx;
	}

	exitTitle(ctx: TitleContext) {
		this.subject = this.getText(ctx?._subject?.plain_phrase());
		this.lastHeading = ctx;
	}
	
	exitUl(ctx:UlContext) {
		this.lastRq = null;
		this.lastHeading = null;
	}

	enterImplmnt(ctx: ImplmntContext) {
		// $$Implements Parser.ERR_IMPLMNT
		if (this.lastRq == null && this.lastHeading==null)
			this.proj.addDiagnostic(
				this.uri,
				Diagnostics.error(
				"Implementation link in the list that is not immidiately after requirement or heading", 
				Util.rangeOfContext(ctx)
			));
		let ids:string[]=[];
		if (ctx.bolded_phrase())
			ids.push(this.getText(ctx.bolded_phrase()?.plain_phrase()));
		else
			ctx.bolded_id().forEach(id => ids.push(id.IDENTIFIER()?.text||''));
		this.proj.addRefs(this.uri,ctx, ids);
	}

	exitHeading(ctx:HeadingContext) {
		this.lastHeading = ctx;
		let defs: ShalldnRqDef[]=[];
		ctx.phrase().forEach(p=>{
			// $$Implements Parser.INFRML_ID
			let id = p.italiced_phrase()?.plain_phrase();
			if (!id)
				return;
			defs.push({
				id:this.getText(id),
				uri:this.uri,
				range: Util.rangeOfContext(id),
				idRange: Util.rangeOfContext(id)
			});
		});

		// $$Implements Parser.ERR_HDNG_MULT_ITLC
		if (defs.length>1)
			this.proj.addDiagnostic(
				this.uri,
				Diagnostics.error(
				"Heading shall have a single italicized phrase as an informal requirement identifier", 
				Util.rangeOfContext(ctx)
			));
		defs.forEach(d=>this.proj.addRequirement(d));
	}
}

class FileData {
	public RqRefs: ShalldnRqRef[] = [];
	public RqDefs: ShalldnRqDef[] = [];
}

export default class ShalldnProj {
	constructor(
		private connection: _Connection,
		private cpblts:Capabilities
	) {}

	private RqDefs: Map<string,ShalldnRqDef[]> = new Map();
	private RqRefs: Map<string, ShalldnRqRef[]> = new Map();
	private Files:Map<string,FileData> = new Map();
	public diagnostics: Map<string,ShalldnDiagnostic[]> = new Map();
	private showAllAsWarnings = false;

	public getDiagnostics(uri:string) {
		let diags = this.diagnostics.get(uri);
		if (!diags) {
			diags = [];
			this.diagnostics.set(uri,diags);
		}
		return diags;
	}

	public addDiagnostic(uri: string, diag: ShalldnDiagnostic) {
		if (this.showAllAsWarnings)
			diag.demote();
		this.getDiagnostics(uri).push(diag);
	}

	public addRequirement(def: ShalldnRqDef) {
		let fileData = this.Files.get(def.uri);
		if (!def.id)
			throw `Requirement without identifier`;
		fileData?.RqDefs.push(def);
		let defs = this.RqDefs.get(def.id);
		if (!defs) {
			defs=[];
			this.RqDefs.set(def.id,defs)
		}
		// $$Implements Parser.ERR_DUP_RQ_ID, Analyzer.ERR_DUP_RQ_ID
		let multiple = defs.length>0;
		defs.push(def);
		if (multiple) 
			throw `Requirement with id ${def.id} already exists`;
		return def;
	}

	public addRefs(uri: string, ctx: ImplmntContext, ids: string[]) {
		let fileData = this.Files.get(uri);
		ids.forEach(id=>{
			let ref: ShalldnRqRef = {
				uri: uri, id, range: Util.rangeOfContext(ctx)
			}
			fileData?.RqRefs.push(ref);
			let refs = this.RqRefs.get(ref.id);
			if (!refs) {
				refs = [];
				this.RqRefs.set(ref.id,refs);
			}
			refs.push(ref);
		});
	}

	cleanFileData(fileData:FileData|undefined) {
		if (!fileData)
			return;
		fileData.RqDefs.forEach(def => {
			let defs = this.RqDefs.get(def.id);
			if (!defs)
				return;
			let newdefs = defs.filter(d => d.uri != def.uri);
			this.RqDefs.set(def.id, newdefs);
		});
		fileData.RqRefs.forEach(ref => {
			let refs = this.RqRefs.get(ref.id);
			if (!refs)
				return;
			let newrefs = refs.filter(d => d.uri != ref.uri);
			this.RqRefs.set(ref.id, newrefs);
		});
	}

	public remove(uri:string) {
		let fileData = this.Files.get(uri);
		if (!fileData)
			return;
		this.cleanFileData(fileData);
		this.Files.delete(uri);
	}

	// $$Implements Analyzer.ERR_NOIMPL_TGT
	checkRefsTargets(fileData:FileData, diagnostics:Diagnostic[]) {
		fileData.RqRefs.forEach(ref => {
			let defs = this.RqDefs.get(ref.id);
			if (!defs || defs.length==0) {
				diagnostics.push(
					Diagnostics.error(`Implementation of non-exisiting requirement ${ref.id}`, ref.range)
				);
			}
		});
	}

	public getLinked(uri:string): Set<string> {
		let linked = new Set<string>();

		let fileData = this.Files.get(uri);
		if (!fileData)
			return linked;
		
		fileData.RqDefs.forEach(def=>{
			let refs = this.RqRefs.get(def.id);
			if (refs)
				refs.forEach(ref=>linked.add(ref.uri));
		});
		fileData.RqRefs.forEach(ref => {
			let defs = this.RqDefs.get(ref.id);
			if (defs)
				defs.forEach(def => linked.add(def.uri));
		});

		return linked;
	}

	// $$Implements Analyzer.PROJECT
	public analyze(uri: string, text:string) {
		let diagnostics:ShalldnDiagnostic[] = [];
		this.diagnostics.set(uri,diagnostics);
		if (path.extname(uri).toLowerCase() == '.shalldn')
			this.analyzeRqFile(uri,text); 
		else
			this.analyzeNonRqFile(uri,text);

		// $$Implements Editor.ERR_NOIMPL, Editor.ERR_NO_IMPLMNT_TGT, Editor.ERR_NO_IMPLMNT_TGT
		this.connection.sendDiagnostics({ uri, diagnostics });
	}

	analyzeRqFile(uri:string, text:string) {
		let fileData = this.Files.get(uri);
		let firstPass = !fileData;
		this.cleanFileData(fileData);
		fileData = new FileData();
		this.Files.set(uri,fileData);
		let diags = this.getDiagnostics(uri);

		let analyzer = new ShalldnProjectRqAnalyzer(uri, this);
		let inputStream = CharStreams.fromString(text);
		let lexer = new shalldnLexer(inputStream);
		lexer.addErrorListener(new LexerErrorListener(this.cpblts.DiagnRelated ? uri : "", d => diags.push(d)));
		let tokenStream = new CommonTokenStream(lexer);
		let parser = new shalldnParser(tokenStream);
		parser.addErrorListener(new ParseErrorListener(this.cpblts.DiagnRelated ? uri : "", d => diags.push(d)));
		let dctx = parser.document();
		ParseTreeWalker.DEFAULT.walk(analyzer as ParseTreeListener, dctx);

		//$$Implements Parser.ERR_No_DOC_Subject
		if (!analyzer.subject)
			diags.push(
				Diagnostics.error(`No subject defined in the document.`, {line:0,character:0})
					.addRelated('The subject of the document is defined by the only italicized group of words in the first line of the document')
			);

		if (!firstPass) {
			// $$Implements Analyzer.ERR_NOIMPL
			fileData.RqDefs.forEach(def => {
				let refs = this.RqRefs.get(def.id);
				if (!refs || refs.length==0){
					diags.push(
						Diagnostics.error(`Requirement ${def.id} does not have implementation`, def.idRange)
					);
				}
			});
			// $$Implements Analyzer.ERR_NOIMPL_TGT
			this.checkRefsTargets(fileData, diags);
		}
	}
	
	analyzeNonRqFile(uri:string, text:string) {
		let fileData = this.Files.get(uri);
		let firstPass = !fileData;
		this.cleanFileData(fileData);
		fileData = new FileData();
		this.Files.set(uri, fileData);

		let lines = text.split('\n');
		for (let l=0;l<lines.length; l++) {
			let line = lines[l];
			// $$Implements Analyzer.CMNT_IMPLMNT
			let m = line.trim().match(/.*\$\$Implements ([\w\.]+(?:\s*,\s*[\w\.]+\s*)*)/)
			if (!m)
				continue;
			m[1].split(',').forEach(s=>{
				let id = s.trim();
				let sp = line.search(id);
				let ref: ShalldnRqRef = {
					uri: uri, id, range: {start:{line:l,character:sp},end:{line:l,character:sp+id.length}}
				}
				fileData?.RqRefs.push(ref);
				let refs = this.RqRefs.get(ref.id);
				if (!refs) {
					refs = [];
					this.RqRefs.set(ref.id, refs);
				}
				refs.push(ref);
			});
		}

		let diagnostics: Diagnostic[] = [];
		if (!firstPass) // $$Implements Analyzer.ERR_NOIMPL_TGT
			this.checkRefsTargets(fileData,diagnostics);

	}

	// $$Implements Analyzer.RQS
	public findDefinition(id:string): Location[] {
		let defs = this.RqDefs.get(id)||[];
		return defs.map(def => <Location>{
			uri: def.uri,
			range: def.range
		});
	}

	// $$Implements Analyzer.IMPLNT
	public findReferences(id: string): Location[] {
		let defs = this.RqRefs.get(id) || [];
		return defs.map(def => <Location>{
			uri: def.uri,
			range: def.range
		});
	}

	// $$Implements Editor.ERR_DEMOTE
	public toggleErrWarn() {
		this.showAllAsWarnings = !this.showAllAsWarnings;
		for (const uri of this.diagnostics.keys()) {
			let diagnostics = this.diagnostics.get(uri);
			if (!diagnostics)
				continue;
			diagnostics.forEach(diag=>diag.promote());
			this.connection.sendDiagnostics({ uri, diagnostics });
		}
		this.diagnostics.keys
	}

}
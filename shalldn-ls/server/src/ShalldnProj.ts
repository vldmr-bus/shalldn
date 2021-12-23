import ShalldnRqRef from './model/ShalldnRqRef';

import * as path from 'path';
import * as fs from 'fs/promises';
import * as rx  from 'rxjs';
import { CharStreams, CommonTokenStream, ParserRuleContext } from 'antlr4ts';
import { shalldnLexer } from './antlr/shalldnLexer';
import { Def_drctContext, Def_revContext, DocumentContext, HeadingContext, ImplmntContext, Nota_beneContext, RequirementContext, SentenceContext, shalldnParser, TitleContext, UlContext, Ul_elementContext } from './antlr/shalldnParser';
import { shalldnListener } from './antlr/shalldnListener';
import { Capabilities } from './server';
import { DefinitionParams, Diagnostic, DiagnosticSeverity, integer, Location, LocationLink, Position, Range, _Connection } from 'vscode-languageserver';
import ShalldnRqDef from './model/ShalldnRqDef';
import { Util } from './util';
import LexerErrorListener from './LexerErrorListener';
import ParseErrorListener from './ParseErrorListener';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';
import { Diagnostics, ShalldnDiagnostic } from './Diagnostics';
import { Interval } from 'antlr4ts/misc/Interval';
import ShalldnTermDef from './model/ShalldnTermDef';
class ShalldnProjectRqAnalyzer implements shalldnListener {
	constructor(
		private uri:string,
		private proj: ShalldnProj
	) { }

	public subject = '';
	private groupImplmentation:{level:integer,ids:string[]}[]=[];
	private defSectLevel:integer|undefined;
	private currentTermDef: ShalldnTermDef|undefined;

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
		let idRange = Util.rangeOfContext(ctx.bolded_id());
		let def = {
			id,
			uri: this.uri,
			range,
			idRange
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
		for (let _once of [1]) {
			let ul = ctx.ul();
			if (ul && ul.implmnt().length)
				break;
			if (this.groupImplmentation.length)
				break;
			// $$Implements Parser.WARN_RTNL
			if (ul && ul.ul_element().some(e => 
				e.sentence(0).text.startsWith('Rationale:'))) // $$Implements Parser.RTNL
			{
				this.proj.addDiagnostic(this.uri,
					Diagnostics.warning(
						`Requirement ${id} is justified only by its rationale and by none of higher level requirements`,
						idRange
					))
				break;
			}
			// $$Implements Parser.ERR_NO_JSTFCTN
			this.proj.addDiagnostic(this.uri,
				Diagnostics.error(
					`Requirement ${id} does not have any justification`,
					idRange
				));
		}
	}

	exitTitle(ctx: TitleContext) {
		this.subject = this.getText(ctx?._subject?.plain_phrase());
	}
	
	enterImplmnt(ctx: ImplmntContext) {
		// $$Implements Parser.IMPLMNT_INDVDL
		let parentRq = (ctx.parent?.parent?.ruleIndex == shalldnParser.RULE_requirement) ? <RequirementContext>ctx.parent.parent:undefined;
		// $$Implements Parser.IMPLMNT_GRP
		let parentTitle = (ctx.parent?.parent?.ruleIndex == shalldnParser.RULE_title) ? <TitleContext>ctx.parent.parent : undefined;
		let parentHeading = (ctx.parent?.parent?.ruleIndex == shalldnParser.RULE_heading) ? <HeadingContext>ctx.parent.parent : undefined;
		// $$Implements Parser.ERR_IMPLMNT
		if (!(parentRq || parentHeading || parentTitle)) {
			this.proj.addDiagnostic(
				this.uri,
				Diagnostics.error(
				"Implementation clause in the list that is not immidiately after requirement or heading", 
				Util.rangeOfContext(ctx)
			));
			return;
		}
		let ids:string[]=[];
		if (ctx.bolded_phrase())
			ids.push(this.getText(ctx.bolded_phrase()?.plain_phrase()));
		else
			ctx.bolded_id().forEach(id => ids.push(id.IDENTIFIER()?.text||''));
		if (parentRq == null && (parentTitle || parentHeading) ) {
			let level = (parentHeading)?parentHeading.hashes().childCount:1;
			while (this.groupImplmentation.length && this.groupImplmentation[0].level>=level)
				this.groupImplmentation.shift();
			this.groupImplmentation.unshift({level,ids});
		}
		this.proj.addRefs(this.uri,parentRq||parentHeading||parentTitle||ctx, ctx, ids);
	}

	// $$Implements Parsers.INLN_DEF_DRCT
	enterDef_drct(ctx: Def_drctContext) {
		let def: ShalldnTermDef = {
			uri: this.uri,
			subj: this.getText(ctx._subject.plain_phrase()),
			bodyRange: Util.rangeOfContext(ctx._body),
			range: Util.rangeOfContext(ctx._subject)
		};
		this.proj.addTerm(def);
	}

	// $$Implements Parsers.INLN_DEF_REV
	enterDef_rev(ctx: Def_revContext) {
		let body = ctx._body.plain_phrase();
		if (!body) {
			this.proj.addDiagnostic(
				this.uri,
				Diagnostics.error(
					"Reverse inline definition without body",
					Util.rangeOfContext(ctx)
				));
			return;
		}
		let def: ShalldnTermDef = {
			uri: this.uri,
			subj: this.getText(ctx._subject),
			bodyRange: Util.rangeOfContext(body),
			range: Util.rangeOfContext(ctx._subject)
		};
		this.proj.addTerm(def);
	}

	// $$Implements Parsers.INLN_DEF_IMP
	enterNota_bene(ctx: Nota_beneContext) {
		let subj = ctx.italiced_phrase().plain_phrase();
		if (!subj) {
			this.proj.addDiagnostic(
				this.uri,
				Diagnostics.error(
					"Empty subject in implicit inline definition",
					Util.rangeOfContext(ctx)
				));
			return;
		}

		let parent = ctx.parent;
		while (parent && parent?.ruleIndex != shalldnParser.RULE_requirement && parent?.ruleIndex != shalldnParser.RULE_sentence)
			parent = parent?.parent

		if (!parent) {
			this.proj.addDiagnostic(
				this.uri,
				Diagnostics.error(
					"Implicit inline definition is not within a sentence",
					Util.rangeOfContext(ctx)
				));
			return;
		}

		let def: ShalldnTermDef = {
			uri: this.uri,
			subj: this.getText(subj),
			bodyRange: Util.rangeOfContext(parent),
			range: Util.rangeOfContext(subj)
		};

		this.proj.addTerm(def);
	}

	completeTermDef(endPos:Position) {
		if (!this.currentTermDef)
			return;
		this.currentTermDef.bodyRange.end = endPos;
		this.proj.addTerm(this.currentTermDef);
		this.currentTermDef = undefined;
	}

	enterHeading(ctx:HeadingContext) {
		if (this.currentTermDef) {
			let range = Util.rangeOfContext(ctx);
			this.completeTermDef(range.start);
		}
		let level = ctx.hashes().childCount;
		if (this.defSectLevel&&this.defSectLevel >= level)
			this.defSectLevel = undefined;

		while (this.groupImplmentation.length && this.groupImplmentation[0].level >= level)
			this.groupImplmentation.shift();

		if (ctx.phrase().text == 'Definitions') {
			this.defSectLevel = level;
			return;
		}

		// $$Implements Parser.DEF_SECT
		if (level - 1 == this.defSectLevel) {
			let range = Util.rangeOfContext(ctx);
			this.currentTermDef = {
				subj: this.getText(ctx.phrase()),
				range: Util.rangeOfContext(ctx.phrase()),
				bodyRange: Util.nextLine(range),
				uri:this.uri
			}
			return;
		}
		
		let defs: ShalldnRqDef[]=[];
		ctx.phrase().italiced_phrase().forEach(p=>{
			// $$Implements Parser.INFRML_ID
			let id = p.plain_phrase();
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

	exitDocument(ctx: DocumentContext) {
		this.completeTermDef({line:ctx.stop!.line, character:ctx.stop!.charPositionInLine});
	}

}

class FileData {
	public RqRefs: ShalldnRqRef[] = [];
	public RqDefs: ShalldnRqDef[] = [];
	public TermDefs: ShalldnTermDef[]|undefined;
}

export default class ShalldnProj {
	constructor(
		private connection: _Connection,
		private cpblts:Capabilities
	) {}

	private RqDefs: Map<string,ShalldnRqDef[]> = new Map();
	private RqRefs: Map<string, ShalldnRqRef[]> = new Map();
	private TermDefs: Map<string, ShalldnTermDef[]> = new Map();
	private Files:Map<string,FileData> = new Map();
	public diagnostics: Map<string,ShalldnDiagnostic[]> = new Map();
	private showAllAsWarnings = false;

	resetDiagnostics(uri:string) {
		this.diagnostics.set(uri, []);
	}

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
		if (!def.id) {
			this.addDiagnostic(
				def.uri,
				Diagnostics.error(`Requirement without identifier`, def.range)
			);
			return;
		}
		fileData?.RqDefs.push(def);
		let defs = this.RqDefs.get(def.id);
		if (!defs) {
			defs=[];
			this.RqDefs.set(def.id,defs)
		}
		// $$Implements Parser.ERR_DUP_RQ_ID, Analyzer.ERR_DUP_RQ_ID, Editor.ERR_MULT_DEF
		let multiple = defs.length>0;
		defs.push(def);
		if (multiple) {
			this.addDiagnostic(
				def.uri,
				Diagnostics.error(`Requirement with id ${def.id} already exists`, def.range)
			);
		}
		return def;
	}

	public addRefs(uri: string, tgt: ParserRuleContext, clause: ParserRuleContext, ids: string[]) {
		let fileData = this.Files.get(uri);
		let tgtRange = Util.rangeOfContext(tgt);
		let clauseRange = Util.rangeOfContext(clause);
		ids.forEach(id=>{
			let ref: ShalldnRqRef = {uri, id, tgtRange,clauseRange};
			fileData?.RqRefs.push(ref);
			let refs = this.RqRefs.get(ref.id);
			if (!refs) {
				refs = [];
				this.RqRefs.set(ref.id,refs);
			}
			refs.push(ref);
		});
	}

	public addTerm(def: ShalldnTermDef) {
		let fileData = this.Files.get(def.uri);
		if (!def.subj) {
			this.addDiagnostic(
				def.uri,
				Diagnostics.error(`Definition without subject`, def.range)
			);
			return;
		}
		// $$Implements Analyzer.DEFS_CASE
		if (def.subj.search(/[a-z]/) >= 0)
			def.subj = def.subj.toLowerCase();
		if (!fileData!.TermDefs)
			fileData!.TermDefs=[];
		fileData!.TermDefs.push(def);
		let defs = this.TermDefs.get(def.subj);
		if (!defs) {
			defs = [];
			this.TermDefs.set(def.subj, defs)
		}

		let multiple = defs.length > 0;
		defs.push(def);

		// $$Implements Analyzer.ERR_DEFS_DUPS
		if (multiple) {
			this.addDiagnostic(
				def.uri,
				Diagnostics.error(`The term "${def.subj}" has multiple definitions`, def.range)
			);
		}
		return def;
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
		(fileData?.TermDefs || []).forEach(def => {
			let defs = this.TermDefs.get(def.subj);
			if (!defs)
				return;
			let newdefs = defs.filter(d => d.uri != def.uri);
			this.TermDefs.set(def.subj, newdefs);
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
	checkRefsTargets(fileData:FileData, uri:string) {
		fileData.RqRefs.forEach(ref => {
			let defs = this.RqDefs.get(ref.id);
			if (!defs || defs.length==0) {
				this.addDiagnostic(
					uri,
					Diagnostics.error(`Implementation of non-exisiting requirement ${ref.id}`, ref.clauseRange)
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
		this.resetDiagnostics(uri);
		if (path.extname(uri).toLowerCase() == '.shalldn')
			this.analyzeRqFile(uri,text); 
		else
			this.analyzeNonRqFile(uri,text);

		// $$Implements Editor.ERR_NOIMPL, Editor.ERR_NO_IMPLMNT_TGT, Editor.ERR_NO_IMPLMNT_TGT
		this.connection.sendDiagnostics({ uri, diagnostics:this.getDiagnostics(uri) });
	}

	analyzeRqFile(uri:string, text:string) {
		let fileData = this.Files.get(uri);
		let firstPass = !fileData;
		this.cleanFileData(fileData);
		fileData = new FileData();
		this.Files.set(uri,fileData);

		let analyzer = new ShalldnProjectRqAnalyzer(uri, this);
		let inputStream = CharStreams.fromString(text);
		let lexer = new shalldnLexer(inputStream);
		// $$Implements Editor.PRBLM_PARSER
		lexer.addErrorListener(new LexerErrorListener(this.cpblts.DiagnRelated ? uri : "", d => this.addDiagnostic(uri,d)));
		let tokenStream = new CommonTokenStream(lexer);
		let parser = new shalldnParser(tokenStream);
		parser.addErrorListener(new ParseErrorListener(this.cpblts.DiagnRelated ? uri : "", d => this.addDiagnostic(uri,d)));
		let dctx = parser.document();
		ParseTreeWalker.DEFAULT.walk(analyzer as ParseTreeListener, dctx);

		//$$Implements Parser.ERR_No_DOC_Subject
		if (!analyzer.subject)
			this.addDiagnostic(
				uri,
				Diagnostics.error(`No subject defined in the document.`, {line:0,character:0})
					.addRelated('The subject of the document is defined by the only italicized group of words in the first line of the document')
			);

		if (!firstPass) {
			// $$Implements Analyzer.ERR_NOIMPL
			fileData.RqDefs.forEach(def => {
				let refs = this.RqRefs.get(def.id);
				if (!refs || refs.length==0){
					this.addDiagnostic(
						uri,
						Diagnostics.error(`Requirement ${def.id} does not have implementation`, def.idRange)
					);
				}
			});
			// $$Implements Analyzer.ERR_NOIMPL_TGT
			this.checkRefsTargets(fileData, uri);
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
				let tgtRange:Range={start:{line:l,character:sp},end:{line:l,character:sp+id.length}};
				let ref: ShalldnRqRef = {uri, id, tgtRange, clauseRange:tgtRange };
				fileData?.RqRefs.push(ref);
				let refs = this.RqRefs.get(ref.id);
				if (!refs) {
					refs = [];
					this.RqRefs.set(ref.id, refs);
				}
				refs.push(ref);
			});
		}

		if (!firstPass) // $$Implements Analyzer.ERR_NOIMPL_TGT
			this.checkRefsTargets(fileData,uri);

	}

	// $$Implements Analyzer.RQS
	public findDefinition(tr:Util.TextRange): LocationLink[] {
		let defs = this.RqDefs.get(tr.text)||[];
		return defs.map(def => <LocationLink>{
			targetUri: def.uri,
			targetRange: def.range,
			targetSelectionRange: def.range,
			originSelectionRange: tr.range
		});
	}

	// $$Implements Analyzer.IMPLNT
	public findReferences(id: string): Location[] {
		let defs = this.RqRefs.get(id) || [];
		return defs.map(def => <Location>{
			uri: def.uri,
			range: def.tgtRange
		});
	}

	public findTerms(tr: Util.TextRange): LocationLink[] {
		let subj = tr.text;
		// $$Implements Analyzer.DEFS_CASE
		if (subj.search(/[a-z]/)>=0)
			subj=subj.toLowerCase();
		let defs = this.TermDefs.get(tr.text)||[];
		return defs.map(def => <LocationLink>{
			targetUri: def.uri,
			targetRange: def.bodyRange,
			targetSelectionRange: def.range,
			originSelectionRange: tr.range
		});
	}

	public getAllTerms(): ShalldnTermDef[] {
		let res: ShalldnTermDef[]=[];
		for (let defs of this.TermDefs.values()) {
			res = res.concat(defs);
		}
		res.sort((a, b) => a.subj.localeCompare(b.subj));
		return res;
	}

	// $$Implements Editor.ERR_DEMOTE
	public toggleErrWarn() {
		this.showAllAsWarnings = !this.showAllAsWarnings;
		for (const uri of this.diagnostics.keys()) {
			let diagnostics = this.diagnostics.get(uri);
			if (!diagnostics)
				continue;
			if (this.showAllAsWarnings)
				diagnostics.forEach(diag=>diag.demote());
			else
				diagnostics.forEach(diag => diag.promote());
			this.connection.sendDiagnostics({ uri, diagnostics });
		}
	}

}
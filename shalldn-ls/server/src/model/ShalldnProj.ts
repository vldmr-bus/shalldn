import ShalldnRqRef from './ShalldnRqRef';

import * as path from 'path';
import * as fs from 'fs/promises';
import * as rx  from 'rxjs';
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { shalldnLexer } from '../antlr/shalldnLexer';
import { HeadingContext, ImplmntContext, RequirementContext, SentenceContext, shalldnParser, TitleContext, UlContext, Ul_elementContext } from '../antlr/shalldnParser';
import { shalldnListener } from '../antlr/shalldnListener';
import { Capabilities } from '../server';
import { DefinitionParams, Diagnostic, Location, _Connection } from 'vscode-languageserver';
import ShalldnRqDef from './ShalldnRqDef';
import { Util } from '../util';
import LexerErrorListener from '../LexerErrorListener';
import ParseErrorListener from '../ParseErrorListener';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';
import { Diagnostics } from '../Diagnostics';
import { URI } from 'vscode-uri';
class ShalldnProjectRqAnalyzer implements shalldnListener {
	constructor(
		private uri:string,
		private proj: ShalldnProj,
		private parser: shalldnParser
	) { }

	private subject = '';
	private lastRq:RequirementContext | null = null;
	private lastHeading:HeadingContext | null=null;
	private headinStack:HeadingContext[]=[];

	enterRequirement(ctx: RequirementContext) {
		try {
			this.proj.addRequirement(this.uri, ctx);
		} catch (e: any) {
			this.parser.notifyErrorListeners(e, ctx.start, undefined);
		}
	}

	exitRequirement(ctx:RequirementContext) {
		this.lastRq = ctx;
	}

	enterTitle(ctx: TitleContext) {
		let title = ctx._subject.plain_phrase()?.text||'';
		this.subject = title;
	}

	enterSentence(ctx:SentenceContext) {
		this.lastRq = null;
		this.lastHeading = null;
	}

	exitUl(ctx:UlContext) {
		this.lastRq = null;
		this.lastHeading = null;
	}

	enterImplmnt(ctx: ImplmntContext) {
		if (this.lastRq == null && this.lastHeading==null)
			this.parser.notifyErrorListeners("Implementation link in the list that is not immidiately after requirement or heading", ctx.start, undefined);
		let ids:string[]=[];
		if (ctx.bolded_phrase())
			ids.push(ctx.bolded_phrase()?.plain_phrase()?.text||'');
		else
			ctx.bolded_id().forEach(id => ids.push(id.IDENTIFIER()?.text||''));
		this.proj.addRefs(this.uri,ctx, ids);
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

	public analyze(uri:string) {
		if (path.extname(uri).toLowerCase() == '.shalldn')
			return this.analyzeRqFile(uri);
		else
			return this.analyzeNonRqFile(uri);
	}

	public addRequirement(uri: string, ctx: RequirementContext) {
		let fileData= this.Files.get(uri);
		let id = ctx.bolded_id()?.IDENTIFIER()?.text || '';
		if (!id)
			throw `Requirement without identifier`;
		let def: ShalldnRqDef = {
			uri: uri,
			id,
			range: Util.rangeOfContext(ctx)
		}
		fileData?.RqDefs.push(def);
		let defs = this.RqDefs.get(def.id);
		if (!defs) {
			defs=[];
			this.RqDefs.set(def.id,defs)
		}
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

	analyzeRqFile(uri:string) {
		let fileData = this.Files.get(uri);
		if (fileData) {
			fileData.RqDefs.forEach(def => {
				let defs = this.RqDefs.get(def.id);
				if (!defs)
					return;
				let newdefs = defs.filter(d => d.uri!=def.uri);
				this.RqDefs.set(uri,newdefs);
			});
			fileData.RqRefs.forEach(ref => {
				let refs = this.RqDefs.get(ref.id);
				if (!refs)
					return;
				let newrefs = refs.filter(d => d.uri != ref.uri);
				this.RqDefs.set(uri, newrefs);
			});
		}
		let diagnostics: Diagnostic[] = [];
		this.Files.set(uri,new FileData());
		let path = URI.parse(uri).fsPath;

		return fs.readFile(path,'utf8')
		.then(
			text=>{
				let inputStream = CharStreams.fromString(text);
				let lexer = new shalldnLexer(inputStream);
				lexer.addErrorListener(new LexerErrorListener(this.cpblts.DiagnRelated?uri:"", d => diagnostics.push(d)));
				let tokenStream = new CommonTokenStream(lexer);
				let parser = new shalldnParser(tokenStream);
				parser.addErrorListener(new ParseErrorListener(this.cpblts.DiagnRelated ? uri : "", d => diagnostics.push(d)));
				let dctx = parser.document();
				let analyzer = new ShalldnProjectRqAnalyzer(uri,this,parser);
				ParseTreeWalker.DEFAULT.walk(analyzer as ParseTreeListener, dctx);
			},
			reason=> {
				diagnostics.push(Diagnostics.error(reason,{line:0,character:0}));
			}
		)
		.finally(()=>{
			this.connection.sendDiagnostics({ uri: uri, diagnostics });
		});
	}
	
	analyzeNonRqFile(uri:string) {
		let diagnostics: Diagnostic[] = [];
		let path = URI.parse(uri).fsPath;

		return fs.readFile(path, 'utf8')
		.then(
			txt=>{
				let lines = txt.split('\n');
				for (let l=0;l<lines.length; l++) {
					let line = lines[l];
					let m = line.trim().match(/.*\$\$Implements ([\w\.]+(?:\s*,\s*[\w\.]+\s*)*)/)
					if (!m)
						continue;
					m[1].split(',').forEach(s=>{
						let id = s.trim();
						let sp = line.search(id);
						let fileData = this.Files.get(uri);
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
			},
			reason => {
				diagnostics.push(Diagnostics.error(reason, { line: 0, character: 0 }));
			}
		)
		.finally(()=>{
			this.connection.sendDiagnostics({ uri: uri, diagnostics });
		});
	}

	public findDefinition(id:string): Location | Location[] {
		var results: Location[] = [];

		let defs = this.RqDefs.get(id)||[];
		return defs.map(def => <Location>{
			uri: def.uri,
			range: def.range
		});
	}

	public findReferences(id: string): Location[] {
		var results: Location[] = [];

		let defs = this.RqRefs.get(id) || [];
		return defs.map(def => <Location>{
			uri: def.uri,
			range: def.range
		});
	}

}
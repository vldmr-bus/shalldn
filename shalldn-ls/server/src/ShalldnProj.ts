import ShalldnRqRef, { RefKind } from './model/ShalldnRqRef';

import * as path from 'path';
import * as fs from 'fs';
import * as rx from 'rxjs';
import { marked } from "marked";
import { CharStreams, CommonTokenStream, ParserRuleContext } from 'antlr4ts';
import { shalldnLexer } from './antlr/shalldnLexer';
import { Def_drctContext, Def_revContext, DocumentContext, HeadingContext, ImplmntContext, Nota_beneContext, RequirementContext, SentenceContext, shalldnParser, TitleContext, XrefContext } from './antlr/shalldnParser';
import { shalldnListener } from './antlr/shalldnListener';
import { Capabilities } from './capabilities';
import { integer, Location, LocationLink, Position, Range, _Connection } from 'vscode-languageserver';
import ShalldnRqDef from './model/ShalldnRqDef';
import { Util } from './util';
import LexerErrorListener from './LexerErrorListener';
import ParseErrorListener from './ParseErrorListener';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';
import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';
import { Diagnostics, ShalldnDiagnostic } from './Diagnostics';
import { Interval } from 'antlr4ts/misc/Interval';
import ShalldnTermDef from './model/ShalldnTermDef';
import MultIgnore from '../../shared/lib/multignore';
import { URI } from 'vscode-uri';
import { Trees } from '../../shared/lib/trees';
import { FsUtil } from '../../shared/lib/fsutil';

class ShalldnProjectRqAnalyzer implements shalldnListener {
	constructor(
		private uri:string,
		private proj: ShalldnProj
	) { }

	public subject = '';
	public titleRange?:Range;
	private groupImplmentation:{level:integer,ids:string[]}[]=[];
	private defSectLevel:integer|undefined;
	private currentTermDef: ShalldnTermDef|undefined;
	private currentInfrmlRq: ShalldnRqDef|undefined;

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
		let id = ctx.bolded_id()?.IDENTIFIER()?.text || ctx.bolded_id()?.WORD()?.text||'';
		let range = Util.rangeOfContext(ctx);
		let idRange = Util.rangeOfContext(ctx.bolded_id());
		idRange.start.character+=2;
		idRange.end.character-=2;
		let def:ShalldnRqDef = {
			id,
			uri: this.uri,
			range,
			idRange
		};
		let tags = ctx.tag();
		if (tags)
			def.tags = [...new Set<string>(tags.map(t=>t._id.text||'Invalid tag'))];
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
			let list = ctx.list();
			if (list && list.implmnt().length)
				break;
			if (this.groupImplmentation.length)
				break;
			// $$Implements Parser.WARN_RTNL
			if (list && list.ul_element().some(e => 
				e.l_element().childCount&&e.l_element().getChild(0)?.text.startsWith('Rationale:'))) // $$Implements Parser.RTNL
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
		this.titleRange = Util.rangeOfContext(ctx);
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
		let ids:{id:string,range:Range}[]=[];
		if (ctx.bolded_phrase()) 
			ids.push({
				id:this.getText(ctx.bolded_phrase()!.plain_phrase()),
				range: Util.rangeOfContext(ctx.bolded_phrase()!)
			});
		else
			ctx.bolded_id().forEach(x => ids.push({
				id:x.IDENTIFIER()?.text || x.WORD()?.text||'',
				range: Util.rangeOfContext(x,2)
			}));
		if (parentRq == null && (parentTitle || parentHeading) ) {
			let level = (parentHeading)?parentHeading.hashes().childCount:1;
			while (this.groupImplmentation.length && this.groupImplmentation[0].level>=level)
				this.groupImplmentation.shift();
			this.groupImplmentation.unshift({level,ids:ids.map(id=>id.id)});
		}
		this.proj.addRefs(this.uri,parentRq||parentHeading||parentTitle||ctx, ctx, ids);
	}

	// $$Implements Parser.XREF
	enterXref(ctx: XrefContext) {
		let ids: { id: string, range: Range }[] = [];
		ctx.bolded_id().forEach(x=>ids.push({
			id: x.IDENTIFIER()?.text || x.WORD()?.text || '',
			range: Util.rangeOfContext(x,2)
		}));
		this.proj.addXrefs(this.uri, ctx, ids);
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
		this.currentInfrmlRq = defs.length?defs[0]:undefined;
	}

	enterSentence(ctx: SentenceContext) {
		if (!this.currentInfrmlRq)
			return;
		this.currentInfrmlRq.range = Util.rangeOfContext(ctx);
		this.currentInfrmlRq = undefined;
	}

	exitDocument(ctx: DocumentContext) {
		this.completeTermDef({line:ctx.stop!.line, character:ctx.stop!.charPositionInLine});
	}

}

export class AnalyzerPromise<T> implements Thenable<T> {
	private promise = new Promise<T>((resolve, reject) => {
		this.resolve = resolve;
		this.reject = reject;
	});
	public resolve?: (v: T | PromiseLike<T>) => void;
	public reject?: (reason?: any) => void;
	then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null): PromiseLike<TResult1 | TResult2> {
		return this.promise.then(onfulfilled, onrejected)
	}
}

class FileData {
	public RqRefs: ShalldnRqRef[] = [];
	public Xrefs: ShalldnRqRef[] = [];
	public RqDefs: ShalldnRqDef[] = [];
	public TermDefs: ShalldnTermDef[]|undefined;
	public subject?: string;
}

export default class ShalldnProj {
	constructor(
		private wsFolders: string[],
		private cpblts?:Capabilities,
		private connection?: _Connection,
	) {	}

	private RqDefs: Map<string,ShalldnRqDef[]> = new Map();
	private RqRefs: Map<string, ShalldnRqRef[]> = new Map();
	private Xrefs: Map<string, ShalldnRqRef[]> = new Map();
	private TermDefs: Map<string, ShalldnTermDef[]> = new Map();
	private Files:Map<string,FileData> = new Map();
	public diagnostics: Map<string,ShalldnDiagnostic[]> = new Map();
	private showAllAsWarnings = false;
	private ignore?:MultIgnore;
	private FileWithTestWarn = new Set<string>();

	public setIgnores(ignores:[string,string[]][]) {
		this.ignore = new MultIgnore();
		ignores.forEach(ignore => this.ignore!.add(ignore[0],ignore[1]));
	}

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

	public addRefs(uri: string, tgt: ParserRuleContext, clause: ParserRuleContext, ids: {id:string,range:Range}[]) {
		let fileData = this.Files.get(uri);
		let tgtRange = Util.rangeOfContext(tgt);
		let clauseRange = Util.rangeOfContext(clause);
		ids.forEach(id=>{
			if (!id) {
				Diagnostics.error(`Definition without subject`, clauseRange);
				return;
			}
			let ref: ShalldnRqRef = {uri, id:id.id, idRange:  id.range, tgtRange,clauseRange,kind:RefKind.Implementation};
			fileData?.RqRefs.push(ref);
			let refs = this.RqRefs.get(ref.id);
			if (!refs) {
				refs = [];
				this.RqRefs.set(ref.id,refs);
			}
			refs.push(ref);
		});
	}

	public addXrefs(uri: string, clause: ParserRuleContext, ids: { id: string, range: Range }[]) {
		let fileData = this.Files.get(uri);
		let clauseRange = Util.rangeOfContext(clause);
		ids.forEach(id => {
			if (!id) {
				Diagnostics.error(`Empty cross-reference`, clauseRange);
				return;
			}
			let ref: ShalldnRqRef = { uri, id: id.id, idRange: id.range, clauseRange, kind: RefKind.Xref };
			fileData?.Xrefs.push(ref);
			let refs = this.Xrefs.get(ref.id);
			if (!refs) {
				refs = [];
				this.Xrefs.set(ref.id, refs);
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
		fileData.Xrefs.forEach(ref => {
			let refs = this.Xrefs.get(ref.id);
			if (!refs)
				return;
			let newrefs = refs.filter(d => d.uri != ref.uri);
			this.Xrefs.set(ref.id, newrefs);
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

	checkRefsTargets(fileData:FileData, uri:string) {
		// $$Implements Analyzer.ERR_NOIMPL_TGT, Analyzer.TESTS_NO_TGT
		fileData.RqRefs.forEach(ref => {
			let defs = this.RqDefs.get(ref.id);
			if (!defs || defs.length==0) {
				this.addDiagnostic(
					uri,
					Diagnostics.error(`${RefKind[ref.kind]} of non-existing requirement ${ref.id}`, ref.clauseRange)
				);
			}
		});
		// $$Implements Analyzer.ERR_XREF_TGT
		fileData.Xrefs.forEach(ref => {
			let defs = this.RqDefs.get(ref.id);
			if (!defs || defs.length==0) {
				this.addDiagnostic(
					uri,
					Diagnostics.error(`Reference to non-existing requirement ${ref.id}`, ref.idRange)
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

	public ignored(uri:string) {
		if (!this.ignore) // do not analyze opened files at startup until ignores are set
			return true;
		let fspath = URI.parse(uri).fsPath;
		return this.ignore.ignores(fspath);
	}

	// $$Implements Analyzer.PROJECT
	public analyze(uri: string, text:string) {
		if (this.ignored(uri))
			return;
		this.resetDiagnostics(uri);
		if (path.extname(uri).toLowerCase() == '.shalldn')
			this.analyzeRqFile(uri,text); 
		else
			this.analyzeNonRqFile(uri,text);

		// $$Implements Editor.INFO_NOIMPL, Editor.INFO_NOIMPL_DOC, Editor.ERR_NO_IMPLMNT_TGT, Editor.ERR_NO_IMPLMNT_TGT
		this.connection?.sendDiagnostics({ uri, diagnostics:this.getDiagnostics(uri) });
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
		lexer.addErrorListener(new LexerErrorListener(this.cpblts?.DiagnRelated ? uri : "", d => this.addDiagnostic(uri,d)));
		let tokenStream = new CommonTokenStream(lexer);
		let parser = new shalldnParser(tokenStream);
		parser.addErrorListener(new ParseErrorListener(this.cpblts?.DiagnRelated ? uri : "", d => this.addDiagnostic(uri,d)));
		let dctx = parser.document();
		ParseTreeWalker.DEFAULT.walk(analyzer as ParseTreeListener, dctx);

		//$$Implements Parser.ERR_No_DOC_Subject
		if (!analyzer.subject)
			this.addDiagnostic(
				uri,
				Diagnostics.error(`No subject defined in the document.`, {line:0,character:0})
					.addRelated('The subject of the document is defined by the only italicized group of words in the first line of the document')
			);

		fileData.subject = analyzer.subject;

		if (!firstPass) {
			if (fileData.RqDefs.length) {
				let noimp:{id:string,idRange:Range}[] = [];			
				fileData.RqDefs.forEach(def => {
					let refs = this.RqRefs.get(def.id)?.filter(r=>r.kind==RefKind.Implementation);
					if (!refs || refs.length==0)
						noimp.push({ id: def.id, idRange:def.idRange})
				});
				if (noimp.length == fileData.RqDefs.length) // $$Implements Analyzer.INFO_NOIMPL_DOC
					this.addDiagnostic(
						uri,
						Diagnostics.info(`No requirement in the document has implementation`, analyzer.titleRange??Util.lineRangeOfPos({line:0,character:0}))
					);
				else if (noimp.length) // $$Implements Analyzer.INFO_NOIMPL
					noimp.forEach(v => this.addDiagnostic(
						uri,
						Diagnostics.info(`Requirement ${v.id} does not have implementation`, v.idRange)
					));
				if (this.FileWithTestWarn.has(uri)) 
					this.addTestWarnings(uri,fileData);

				// $$Implements Parser.ERR_WORDS
				let regex=/(?<=[^'"])\b(TBD|TODO|FIXME)\b(?=[^'"])/g;
				let match: RegExpExecArray | null;
				let lines = text.replace(/\r/g, '').split('\n');
				for (let i=0;i<lines.length;i++) {
					let line = lines[i];
					let m = line.match(regex);
					if (m) {
						let def = fileData.RqDefs.find(d => d.range.start.line <= i && d.range.end.line >= i);
						if (!def)
							continue;
						for (const w of new Set(m))
							this.addDiagnostic(uri,Diagnostics.error(`Requirement ${def.id} contains ${w}`,def.idRange));
					}
				}
			}

			// $$Implements Analyzer.ERR_NOIMPL_TGT
			this.checkRefsTargets(fileData, uri);
		}
	}
	
	// $$Implements Editor.TESTS
	addTestWarnings(uri:string,fileData:FileData) {
		fileData.RqDefs.forEach(def => {
			let notests = !(this.RqRefs.get(def.id)?.some(r => r.kind == RefKind.Test));
			if (notests)
				this.addDiagnostic(
					uri,
					Diagnostics.warning(`Requirement ${def.id} does not have tests`, def.idRange)
					)
		});
	}

	public addRefNonRqFile(fileData: FileData, ref: ShalldnRqRef) {
		fileData.RqRefs.push(ref);
		let refs = this.RqRefs.get(ref.id);
		if (!refs) {
			refs = [];
			this.RqRefs.set(ref.id, refs);
		}
		refs.push(ref);
	}

	fileHasReferences(uri:string) {
		return this.Files.get(uri)?.RqRefs.length??0;
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
			// $$Implements Analyzer.CMNT_IMPLMNT, Analyzer.TEST_CLAUSE
			let m = line.trim().match(/.*\$\$(?:Implements|Tests)\s+([\w\.]+(?:\s*,\s*[\w\.]+\s*)*)/);
			if (m) {
				let csp = line.search(/\$\$(Implements|Tests)/);
				let clauseRange={start:{line:l,character:csp},end:{line:l,character:line.length}};
				m[1].split(',').forEach(s=>{
					let id = s.trim();
					let sp = line.search(id);
					let idRange:Range={start:{line:l,character:sp},end:{line:l,character:sp+id.length}};
					let kind = line.substring(csp).startsWith('$$Implements')?RefKind.Implementation:RefKind.Test;
					let ref: ShalldnRqRef = {uri, id, idRange, clauseRange, kind };
					this.addRefNonRqFile(fileData!,ref);
				});
			}
			if (path.extname(uri) != ".feature")
				continue;
			// $$Implements Analyzer.TEST_GHERKIN
			m = line.trim().match(/^Scenario:\s*([\w_]+\.[\w_\.]+)\b/);
			if (m) {
				let id = m[1];
				let sp = line.search(id);
				let idRange:Range={start:{line:l,character:sp},end:{line:l,character:sp+id.length}};
				let clauseRange={start:{line:l,character:line.search(/\S/)},end:{line:l,character:line.length}};
				let ref: ShalldnRqRef = { uri, id, idRange, clauseRange, kind:RefKind.Test };
				this.addRefNonRqFile(fileData!, ref);
			}
			
		}

		if (!firstPass) // $$Implements Analyzer.ERR_NOIMPL_TGT, Analyzer.TESTS_NO_TGT
			this.checkRefsTargets(fileData,uri);

	}

private analyzing: AnalyzerPromise<string[]> | undefined;
private pendingAnalysis = new AnalyzerPromise<string[]>();
private pendingFiles = new Set<string>();
private debounce: NodeJS.Timeout | undefined;
private static debounceTime = 400;

// $$Implements Analyzer.PROJECT
public analyzeFiles(files: string[], loader:(uri:string)=>Promise<string>): AnalyzerPromise<string[]> {
	// $$Implements Analyzer.IGNORE_NONPROJ
	var projectfiles = files.filter(f=>this.wsFolders.some(p=>FsUtil.isInside(p,f)));
	if (projectfiles.length == 0) {
		let ap = new AnalyzerPromise<string[]>();
		ap.resolve!(files);
		return ap;
	}
	projectfiles.forEach(f => this.pendingFiles.add(f));
	if (this.analyzing)
		return this.pendingAnalysis;
	if (this.debounce) {
		clearTimeout(this.debounce);
		this.debounce = undefined;
	}

	this.debounce = setTimeout(() => {
		this.debounce = undefined;
		this.analyzing = this.pendingAnalysis;
		this.pendingAnalysis = new AnalyzerPromise<string[]>();
		let files = [...this.pendingFiles];
		this.pendingFiles.clear();
		this.connection?.sendRequest("analyzeStart")
			.catch(r => {
				console.log(r)
			});
		if (!files.length) {
			let done = this.analyzing;
			this.analyzing = undefined;
			done!.resolve!(files);
			return;
		}

		rx.lastValueFrom(
			rx.from(files)
				.pipe(
					rx.mergeMap(
						uri => {
							return loader(uri)
								.then(
									text => this.analyze(uri, text),
									reason => this.connection?.sendDiagnostics({
										uri: uri,
										diagnostics: [Diagnostics.error(reason.message, { line: 0, character: 0 })]
									})
								)
						},
						100
					)
				)
		).then(
			() => {
				let done = this.analyzing;
				this.analyzing = undefined;
				done!.resolve!(files)
			},
			(err) => {
				let done = this.analyzing;
				this.analyzing = undefined;
				done!.reject!(err);
			}
		);
	},
		ShalldnProj.debounceTime
	);
	return this.pendingAnalysis;
}

	public findDefinitions(id:string) {
		return this.RqDefs.get(id) || [];
	}

	// $$Implements Analyzer.RQS
	public findDefinitionLocations(id:string, range?:Range): LocationLink[] {
		let defs = this.RqDefs.get(id)||[];
		return defs.map(def => <LocationLink>{
			targetUri: def.uri,
			targetRange: def.range,
			targetSelectionRange: def.range,
			originSelectionRange: range
		});
	}

	public findReferences(id:string) {
		return this.RqRefs.get(id) || [];
	}

	public findXReferences(id:string) {
		return this.Xrefs.get(id) || [];
	}

	// $$Implements Analyzer.IMPLNT, Analyzer.TESTS
	public findReferenceLocations(id: string): Location[] {
		let defs = this.RqRefs.get(id) || [];
		return defs.map(def => <Location>{
			uri: def.uri,
			range: def.tgtRange||def.idRange
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
			res.push(...defs);
		}
		res.sort((a, b) => a.subj.localeCompare(b.subj));
		return res;
	}

	// $$Implements Editor.ERR_DEMOTE
	public async toggleErrWarn() {
		this.showAllAsWarnings = !this.showAllAsWarnings;
		for (const uri of this.diagnostics.keys()) {
			let diagnostics = this.diagnostics.get(uri);
			if (!diagnostics)
				continue;
			if (this.showAllAsWarnings)
				diagnostics.forEach(diag=>diag.demote());
			else
				diagnostics.forEach(diag => diag.promote());
			await this.connection?.sendDiagnostics({ uri, diagnostics });
		}
	}

	// $$Implements Editor.TESTS
	public async toggleTestWarn(uri:string) {
		if (path.extname(uri).toLowerCase() != '.shalldn')
			return;
		let fileData = this.Files.get(uri);
		if (!fileData)
			return;
		let diagnostics = this.getDiagnostics(uri);
		if (this.FileWithTestWarn.has(uri)) {
			this.FileWithTestWarn.delete(uri);
			diagnostics = diagnostics.filter(d=>!d.message.endsWith("does not have tests"))
			this.diagnostics.set(uri, diagnostics);
		} else {
			this.FileWithTestWarn.add(uri);
			this.addTestWarnings(uri,fileData);
		}
		await this.connection?.sendDiagnostics({ uri, diagnostics });
	}

	public expandMD(apath:string):string{
		let uri = URI.file(apath).toString();
		let text = fs.readFileSync(apath, 'utf8');
		let lines = text.replace(/\r/g, '').split('\n');
		this.TermDefs.forEach(terms=>{
			let term = terms[0];
			let dapath = URI.parse(term.uri).fsPath;
			let rpath = path.relative(path.dirname(apath), dapath).replace(/\\/g, '/');
			if (uri == term.uri) {
				lines[term.range.start.line] = lines[term.range.start.line].replace(/(\s*)$/, `<a name="${term.subj.replace(/ /g, '_')}"></a>$&`);
			} else
				lines.forEach((line,i)=>{
					const regex = new RegExp(`[*_]${term.subj}[*_]`, 'gi');
					if (regex.test(line))
						lines[i] = line.replace(regex, `[$&](${rpath}#${term.subj.replace(/ /g, '_')})`);
				})

		})
		let references:string[]=[];
		let fdata = this.Files.get(uri);
		fdata?.RqDefs.forEach(def=>{
			let i = def.idRange.start.line;
			const defid = def.id.replace(/[- ]/g, '_');
			lines[i] = lines[i].replace(/(\s*)$/,`<a name="${defid}"></a>$&`);
			let refs = this.RqRefs.get(def.id);
			if (!refs)
				return;
			refs = refs.filter(r => path.extname(r.uri).toLowerCase() == ".shalldn");
			if (!refs.length)
				return;
			lines[i] = lines[i].replace(def.id, `$&<a href="#${defid}_REFS">[REFS]</a>`)
			let links:string[] = [];
			let j=1;
			refs.forEach((ref,idx)=>{
				let dapath = URI.parse(ref.uri).fsPath;
				let rpath = path.relative(path.dirname(apath), dapath).replace(/\\/g, '/');
				if (!ref.uri.endsWith('.shalldn'))
					return;
				links.push(`[${j++}](${rpath}#${defid}_${idx})`);
			})
			if (links.length) {
				references.push(`<a name="${defid}_REFS"></a>[${def.id}](#${defid}): ${links.join(', ')}  `);
			}
		});
		fdata?.RqRefs.forEach(ref=>{
			const refs = this.RqRefs.get(ref.id);
			if (!refs)
				return;
			let linked = false;
			refs.forEach((r, idx) => {
				if (r != ref)
					return;
				const defs = this.RqDefs.get(ref.id);
				if (!defs || defs.length == 0)
					return;
				const def = defs[0];
				const defid = def.id.replace(/[- ]/g, '_');
				let dapath = URI.parse(def.uri).fsPath;
				let rpath = path.relative(path.dirname(apath), dapath).replace(/\\/g, '/');
				let i = ref.clauseRange.start.line;
				lines[i] = lines[i].replace(def.id, `[$&](${rpath}#${defid})`);
				lines[(ref.tgtRange||ref.idRange).start.line] = lines[(ref.tgtRange||ref.idRange).start.line].replace(/(\s*)$/,`<a name="${defid}_${idx}"></a>$&`);
			})
		});
		if (references.length) {
			let titleLine = 1+lines.findIndex(l=>l.startsWith('#'));
			references.sort();
			lines.splice(titleLine, 0,'  \n# REFERENCES:  ',...references);
		}
		return lines.join('\n');
	}


	public getTagsTree() {
		let tags: Map<string,string[]>=new Map();
		this.RqDefs.forEach(def=>{
			def.forEach(rq=>{
				if (rq.tags && rq.tags.length)
					rq.tags.forEach(t=>{
						let ids=tags.get(t);
						if (!ids)
							tags.set(t,ids=[]);
						ids.push(rq.id);
					})
			})
		})
		var result:Trees.NamespaceTree = [];
		for (const key of tags) {
			result.push({id:key[0],children:Trees.makeNamespaceTree(key[1],key[0]+".")})
		}
		Trees.sortAndCountNamespaceTree(result);
		return result;
	}

	public getSubject(uri:string) {
		const fileData = this.Files.get(uri);
		return fileData&&fileData.subject;
	}

	public getIdsByPfx(pfx:string, defs?:IterableIterator<string>) {
		defs = defs || this.RqDefs.keys();
		let ids:string[]=[];
		for (const id of defs)
			if (id.startsWith(pfx))
				ids.push(id);
		let ns = Trees.makeNamespaceTree(ids);
		Trees.flattenTo(ids,ns);
		let s =new Set<string>(ids);
		let l = pfx.length;
		return [...s].filter(s=>s.length>l);
	}

	public getIdsByPfxForFile(pfx:string, uri: string) {
		const fileData = this.Files.get(uri);
		if (!fileData || !fileData.RqDefs)
			return [];
		return this.getIdsByPfx(pfx,fileData.RqDefs.map(d=>d.id).values());
	}

	public getDefsByPfx(pfx:string) {
		let terms = [];
		let lpfx = pfx.toLocaleLowerCase()
		for (const t of this.TermDefs.keys())
			if (t.startsWith(lpfx) || t.startsWith(pfx)) {
				terms.push(pfx+t.substring(pfx.length))
			}
			return terms;
	}

	public exportHtml(rootUri: string, workspaceUri:string, progress:(msg:string,pct:number)=>void) {
		let rootp = URI.parse(rootUri).fsPath;
		let wsp = URI.parse(workspaceUri).fsPath;
		let files:string[]=[];
		for (const uri of this.Files.keys()) {
			if (path.extname(uri).toLowerCase() != '.shalldn')
				continue;
			let fp = URI.parse(uri).fsPath;
			if (!FsUtil.isInside(wsp,fp))
				continue;
			files.push(fp);
		}
		if (files.length == 0)
			throw "No exportable files in workspace";
		let rpaths:string[] = [];
		for (let i=0;i<files.length;i++) {
			let fp = files[i];
			let rp = path.dirname(path.relative(wsp, fp));
			let dstDir = path.resolve(rootp,rp);
			fs.mkdirSync(dstDir,{recursive:true});
			if (!fs.existsSync(dstDir))
				throw `Can not create directory ${dstDir}`;
			let md = this.expandMD(fp);
			let html = marked.parse(md);
			html = html.replace(/(<a href="[^#]+).shalldn#/g,"$1.html#");
			let df = path.basename(fp,path.extname(fp))+".html";
			fs.writeFileSync(path.resolve(dstDir,df),html);
			rpaths.push(`${rp}/${df}`);
			progress(`Exported ${rp}`,i/files.length*100);
		}

		let dot = String.fromCharCode(1);
		let dotregx = new RegExp(dot, 'g');
		let sep = String.fromCharCode(2);
		rpaths = rpaths.map(p=> {
			let escaped = p.replace(/\./g,dot);
			return escaped.replace(/[\/\\]/g,'.')+sep+escaped
		});
		let tree = Trees.makeNamespaceTree(rpaths);
		Trees.sortAndCountNamespaceTree(tree);
		let idx = '<html><head/><body><ul>';
		function printn(n:Trees.NamespaceNode) {
			if (typeof n == 'string') {
				let p = n.replace(/\./g,'/').replace(dotregx, '.').split(sep);
				idx += `<li><a href="${p[1]}">${path.basename(p[0], path.extname(p[0]))
}</a></li>`;
				return;
			}
			idx += `<li>${path.basename(n.id.replace(/\./g, '/').replace(dotregx, '.'))}<ul>`;
			n.children.forEach(i =>printn(i));
			idx += '</ul></li>'
		}
		tree.forEach(n=>printn(n));
		idx += '</body></html>'
		fs.writeFileSync(path.resolve(rootp, 'index.html'), idx);
	}
}

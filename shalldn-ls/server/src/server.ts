/* --------------------------------------------------------------------------------------------
 * Copyright (c) Vladimir Avdonin. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	TextDocumentSyncKind,
	InitializeResult,
	RequestType,
	FileChangeType,
	TextDocumentChangeEvent,
	TextDocumentPositionParams,
	CompletionItem,
	CompletionItemKind,
	TextEdit,
	WorkspaceEdit,
	RenameParams,
	Range,
	PrepareRenameParams} from 'vscode-languageserver/node';

import {
	Position,
	TextDocument
} from 'vscode-languageserver-textdocument';

import { Diagnostics } from './Diagnostics';
import { Util } from './util';
import ShalldnProj, { AnalyzerPromise, dialect, dialectKeywords, Dialects, isReqUri, kws } from './ShalldnProj';
import { URI, Utils } from 'vscode-uri';

import {from, lastValueFrom, mergeMap} from 'rxjs';
import * as fs from 'fs/promises';
import { Capabilities } from './capabilities';
import e = require('express');
import path = require('path');
import * as l10n from '@vscode/l10n';

if (process.env['EXTENSION_BUNDLE_PATH']) {
	l10n.config({
		fsPath: process.env['EXTENSION_BUNDLE_PATH']
	});
}

var debug = /--inspect/.test(process.execArgv.join(' '))

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);


let cpblts = new Capabilities();

let project: ShalldnProj;

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	// Does the client support the `workspace/configuration` request?
	// If not, we fall back using global settings.
	cpblts.Config = !!(
		capabilities.workspace && !!capabilities.workspace.configuration
	);
	cpblts.WorkspaceFolder = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);
	cpblts.DiagnRelated = !!(
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			definitionProvider: true,
			referencesProvider: true,
			completionProvider: {
				triggerCharacters: ['.','*'],
			},
			renameProvider: {prepareProvider:true}
		}
	};
	if (cpblts.WorkspaceFolder) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}
	project = new ShalldnProj(
		params.workspaceFolders?.map(f => URI.parse(f.uri).fsPath)||[], 
		cpblts, 
		connection);

	return result;
});

connection.onInitialized(() => {
	if (cpblts.Config) {
		// Register for all configuration changes.
		connection.client.register(DidChangeConfigurationNotification.type, undefined);
	}
	if (cpblts.WorkspaceFolder) {
		connection.workspace.onDidChangeWorkspaceFolders(_event => {
			connection.console.log('Workspace folder change event received.');
		});
	}

	documents.onDidChangeContent(onDidChangeContent);
});

// The example settings
interface ShalldnSettings {
	maxNumberOfProblems: number;
	nonRqFileTypes: string;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: ShalldnSettings = { 
	maxNumberOfProblems: 1000,  
	nonRqFileTypes: '*.{cs,ts}'
};
let globalSettings: ShalldnSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<ShalldnSettings>> = new Map();

connection.onDidChangeConfiguration(change => {
	if (cpblts.Config) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalSettings = <ShalldnSettings>(
			(change.settings.shalldnLanguageServer || defaultSettings)
		);
	}

	// Revalidate all open text documents
	analyzeFiles(documents.all().map(d=>d.uri.toString()))
	.then(tellClient, reportAnalyzingFailure);
});

function getDocumentSettings(resource: string): Thenable<ShalldnSettings> {
	if (!cpblts.Config) {
		return Promise.resolve(globalSettings);
	}
	let result = documentSettings.get(resource);
	if (!result) {
		result = connection.workspace.getConfiguration({
			scopeUri: resource,
			section: 'shalldnLanguageServer'
		});
		documentSettings.set(resource, result);
	}
	return result;
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentSettings.delete(e.document.uri);
});

function reportAnalyzingFailure(err:any) {
	console.log("Analyzing files failed: " + err);
	connection.sendNotification("analyze/error", err);
}

// $$Implements Analyzer.NOTIFY
// $$Реализует СТРУКТАН.ПОСЛЕ
let termsCache: string;
let tagsCache:string;
function tellClient(files:string[]) {
	let terms = JSON.stringify(project.getAllTerms());
	if (terms != termsCache)
		termsCache = terms;
	else
		terms = '';
	let tags = JSON.stringify(project.getTagsTree());
	if (tags != tagsCache)
		tagsCache = tags;
	else
		tags = '';
	connection.sendRequest("analyzeDone", {terms,tags})
		.catch(r => {
			console.log(r)
		});
}

function analyzeFiles(files: string[]): AnalyzerPromise<string[]> {
	return project.analyzeFiles(files, (uri: string)=> {
		let doc = documents.get(uri);
		let path = URI.parse(uri).fsPath;
		return (doc ? Promise.resolve(doc.getText()) : fs.readFile(path, 'utf8'));
	});
}

function docLoader(uri:string) {
	let doc = documents.get(uri);
	let path = URI.parse(uri).fsPath;
	return (doc ? Promise.resolve(doc.getText()) : fs.readFile(path, 'utf8'));
}

// $$Implements Analyzer.MODS
// $$Реализует СТРУКТАН.ИЗМЕНЕНИЯ
async function onDidChangeContent(change: TextDocumentChangeEvent<TextDocument>) {
	let linked = project.getLinked(change.document.uri);
	analyzeFiles([change.document.uri])
	.then(
		()=>{
			for (let l of project.getLinked(change.document.uri))
				linked.add(l);
			analyzeFiles([...linked])
			.then(tellClient,reportAnalyzingFailure);
		},
		reportAnalyzingFailure
	);
}

// $$Implements Analyzer.MODS
// $$Реализует СТРУКТАН.ИЗМЕНЕНИЯ
connection.onDidChangeWatchedFiles(_change => {
	let changed:string[] = [];
	_change.changes.forEach(event=>{
		if (!event.uri.startsWith('file://'))
			return;
		if (project.ignored(event.uri))
			return;
		if (event.type == FileChangeType.Created)
			return;
		if (event.type == FileChangeType.Deleted)
			project.remove(event.uri);
		if (event.type == FileChangeType.Changed) {
			changed.push(event.uri);
		}
	})
	
	if (changed.length == 0)
		return;
	let linked = new Set<string>();
	changed.forEach(uri => { linked = new Set([...linked, ...project.getLinked(uri)]);})
	analyzeFiles(changed)
	.then(
		(files)=> {
			changed.forEach(uri => { linked = new Set([...linked, ...project.getLinked(uri)]); })
			analyzeFiles([...linked])
			.then(tellClient, reportAnalyzingFailure);
		},
		reportAnalyzingFailure
	)
});

function idAt(tr:{text:string,range:Range},p:Position) {
	return Util.lineFragment(tr,p.character,/.*?([\wА-я.]*)$/,/^([\wА-я.]*).*?$/s);
}

// $$Implements Editor.NAV.RQ_DEF
// $$Реализует РЕДАКТОР.НАВ.ТР
connection.onDefinition((params, cancellationToken) => {
	return new Promise((resolve, reject) => {
		const document = documents.get(params.textDocument.uri);
		const p = params.position;
		let range = Util.lineRangeOfPos(p);
		let text = document?.getText(range).trimEnd();
		if (!document || !text) {
			resolve([]);
			return;
		}
		let tr = {text, range}

		let id = idAt(tr,p);
		if (id) {
			let defs = project.findDefinitionLocations(id.text,id.range);
			if (defs.length > 0 || !isReqUri(document.uri)) {
				resolve(defs);
				return;
			}
		}

		const dlct = dialect(document.uri);
		const dkw = dialectKeywords[dlct || 'shaldn']
		const impRE = new RegExp(`^.*${dkw["Implements"]}\\s+\\*\\*([^*]+)$`)
		// informal requirement definition
		id = Util.lineFragment(tr, p.character,impRE,/^([^*]*)\*\*/);
		if (id) {
			let defs = project.findDefinitionLocations(id.text,id.range);
			if (defs.length > 0 || !isReqUri(document.uri)) {
				resolve(defs);
				return;
			}
		}

		// term definitions: $$Implements Analyzer.DEFS, Editor.NAV.TERM_DEF
		// $$Реализует СТРУКТАН.ОПРЕДЕЛЕНИЯ, РЕДАКТОР.НАВ.ОПРЕДЕЛЕНИЕ
		id = Util.lineFragment(tr, p.character,/\*+([^*]*)$/,/^([^*]*)\*+/s);
		if (!id)
			id = Util.lineFragment(tr, p.character,/_+([^*_]*)$/, /^([^*_]*)_+/s);
		if (id)
			resolve(project.findTerms(id));
		else
			resolve(null);
	});
});

// $$Implements Editor.NAV.IMPL, Editor.NAV.TESTS, Editor.NAV.XREF
// $$Реализует РЕДАКТОР.НАВ.РЕАЛ, РЕДАКТОР.НАВ.ТЕСТ, РЕДАКТОР.НАВ.ССЫЛКА
connection.onReferences((params)=>{
	return new Promise((resolve, reject) => {
		const document = documents.get(params.textDocument.uri);
		const p = params.position;
		let range = Util.lineRangeOfPos(p);
		let text = document?.getText(range).trimEnd()||'';
		if (!document || !text) {
			resolve([]);
			return;
		}
		let tr = { text, range }

		let id = Util.lineFragment(tr, p.character,/.*?([\wА-я.]*)$/, /^([\wА-я.]*).*?$/s);
		if (id) {
			let refs = project.findReferenceLocations(id.text);
			if (refs.length > 0 || !isReqUri(document.uri)) {
				resolve(refs);
				return;
			}
		}

		// informal requirement references
		id = Util.lineFragment(tr, p.character,/^#+.*\*([^*]+)$/,/^([^*]*)\*.*$/);
		if (id)
			resolve(project.findReferenceLocations(id.text));
		resolve(null);
	});

})

function partialMatch(text:string, fragment: string, ilen?:number): number {
	ilen = ilen||3;
	if (text.length<ilen || fragment.length<ilen)
		return -1;
	let i =  Util.range(ilen, fragment.length).findIndex(i => text.match(new RegExp(`(?:^|\\s)${Util.escapeRegExp(fragment.substring(0, i))}$`)));
	return (i<0)?-1:i+ilen;
}

function fragmentCompletion(text: string, fragment: string, p:Position, ilen?:number, kind?: CompletionItemKind): CompletionItem|null {
	let res: CompletionItem|null = null;
	let matchLen = fragment && partialMatch(text, fragment, ilen) || -1;
	if (matchLen > 0) {
		res = {
			label: fragment,
			kind: kind || CompletionItemKind.Keyword,
			textEdit: TextEdit.insert(p, fragment.substring(matchLen)+" ")
		};
	}
	return res;
}

connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
		let res: CompletionItem[] = [];
		const document = documents.get(_textDocumentPosition.textDocument.uri);
		const p = _textDocumentPosition.position;
		let range = Util.lineRangeOfPos(p);
		let text = document?.getText(range).trimEnd() || '';

		if (!document || !text)
			return res;

		const pfx = text.substring(0, p.character);
		const dlct = dialect(document.uri);
		const isrq = !!dlct;
		const dkw = dialectKeywords[dlct||'shaldn']

		// $$Implements Editor.CMPL.SUBJ
		// $$Реализует РЕДАКТОР.ВВОД.ПРЕДМЕТ
		const subj = isrq && project.getSubject(_textDocumentPosition.textDocument.uri) || "";
		let c = fragmentCompletion(pfx,subj,p);
		if (c)
			res.push(c);

		// $$Implements Editor.CMPL.KW_NREQ
		// $$Реализует РЕДАКТОР.ВВОД.РЕАЛ
		if (!isrq)
			kws("Implements").forEach((kw)=>{
				c = fragmentCompletion(pfx, "$$" + kw, p, 2) || null;
				if (c)
					res.push(c);
			});

		// $$Implements Editor.CMPL.KW_REQ
		// $$Реализует РЕДАКТОР.ВВОД.ТРЕБОВАНИЕ
		c = isrq && fragmentCompletion(pfx, "* "+dkw["Implements"], p) || null;
		if (c)
			res.push(c);

		c = isrq && fragmentCompletion(pfx, "**shall**", p) || null;
		if (!c && dlct=="фядот") {
			const txt = document.getText();
			let dolg = txt.match(/\*\*долж(?:ен|на|но|ны)\*\*/)?.[0]??"**долж";
			c = fragmentCompletion(pfx, dolg, p)
		}

		if (c)
			res.push(c);

		// $$Implements Editor.CMPL.IMPL_NREQ
		// $$Реализует РЕДАКТОР.ВВОД.РЕАЛ.ИДЕНТ_РЕАЛ
		const re = new RegExp(`\\$\\$(?:${kws("Implements").join("|")}).*[^\wА-я]([\\wА-я][\\wА-я.]*)$`);
		let m = !isrq && pfx.match(re) || null;
		if (m)
			project.getIdsByPfx(m[1]).forEach(id=>{
				res.push({
					label: id,
					kind: CompletionItemKind.Keyword,
					textEdit: TextEdit.insert(p,id.substring(m![1].length)),
					// $$Implements Editor.CMPL.NS_ORD
					// $$Реализует РЕДАКТОР.ВВОД.ПОДМНОЖЕСТВА
					sortText: id.endsWith('.')?'0000000000'.substring(id.replace(/[^.]+/g, '').length)+id:id
				})
			});

		// $$Implements Editor.CMPL.IMPL_REQ
		// $$Реализует РЕДАКТОР.ВВОД.РЕАЛ.ИДЕНТ_ТР
		m = isrq && pfx.match(`^\\s*\\*\\s+${dkw["Implements"]}\\s.*\\*\\*([\\wА-я][\\wА-я._]*)$`) || null;
		if (m)
			project.getIdsByPfx(m[1]).forEach(id => {
				res.push({
					label: id,
					kind: CompletionItemKind.Keyword,
					textEdit: TextEdit.insert(p, id.substring(m![1].length)+'**'),
					// $$Implements Editor.CMPL.NS_ORD
					// $$Реализует РЕДАКТОР.ВВОД.ПОДМНОЖЕСТВА
					sortText: id.endsWith('.') ? '0000000000'.substring(id.replace(/[^.]+/g, '').length) + id : id
				});
			});
		
		// $$Implements Editor.CMPL.ID_REQ
		// $$Реализует РЕДАКТОР.ВВОД.ИДЕНТИФИКАТОР
		m = isrq && pfx.match(/^\s*\*\*([\wА-я][\wА-я.]*)$/) || null;
		if (m)
			project.getIdsByPfxForFile(m[1], document.uri).forEach(id=>{
				res.push({
					label: id,
					kind: CompletionItemKind.Keyword,
					textEdit: TextEdit.insert(p,id.substring(m![1].length)),
					// $$Implements Editor.CMPL.NS_ORD
					// $$Реализует РЕДАКТОР.ВВОД.ПОДМНОЖЕСТВА
					sortText: id.endsWith('.') ? '0000000000'.substring(id.replace(/[^.]+/g, '').length) + id : id
				});
			});

		// $$Implements Editor.CMPL.DEFS
		// $$Реализует РЕДАКТОР.ВВОД.ОПР
		m = isrq && pfx.match(/[^*]\*([\wА-я][^*]*)$/) || null;
		if (m)
			project.getDefsByPfx(m[1]).forEach(t => {
				res.push({
					label: t,
					kind: CompletionItemKind.Keyword,
					textEdit: TextEdit.insert(p, t.substring(m![1].length)+'*')
				});
			});

		return res;
	}
);

// $$Implements Editor.RENAME
// $$Реализует РЕДАКТОР.ПЕРЕИМЕН
connection.onPrepareRename(async (params: PrepareRenameParams) => {
	const document = documents.get(params.textDocument.uri);
	const p = params.position;
	let range = Util.lineRangeOfPos(p);
	let text = document?.getText(range).trimEnd();

	if (!document || !text)
		return null;
	
	let id = idAt({text, range}, p);
	if (id) {
		let defs = project.findDefinitionLocations(id.text,id.range);
		if (defs.length == 1)
			return id.range;
	}
	return null;
})

// $$Implements Editor.RENAME
// $$Реализует РЕДАКТОР.ПЕРЕИМЕН
connection.onRenameRequest((params: RenameParams)=>{
	if (!params.newName.match(/^[a-zA-ZА-я][\wА-я.]+$/)) // $$Implements Editor.RENAME_VALIDATE
		// $$Реализует РЕДАКТОР.ПЕРЕИМЕН.ПРАВ
		return null;
	const document = documents.get(params.textDocument.uri);
	const p = params.position;
	let range = Util.lineRangeOfPos(p);
	let text = document?.getText(range).trimEnd();

	if (!document || !text)
		return null;

	let id = idAt({ text, range }, p);
	if (!id)
		return null;
	let defs = project.findDefinitions(id.text);
	if (defs.length != 1)
		return null;
	let def=defs[0];

	let changes:{[uri: string]: TextEdit[]} = {};
	changes[def.uri] = [{range:def.idRange,newText:params.newName}];
	let refs = [...project.findReferences(id.text),...project.findXReferences(id.text)];
	refs.forEach(r=>{
		if (!changes.hasOwnProperty(r.uri))
			changes[r.uri]=[]
		changes[r.uri].push({range:r.idRange,newText:params.newName})
	});

	return {changes};
})

// $$Implements Analyzer.PROJECT
var analyzeFilesRequest: RequestType<{
	files: string[],
}, any, any> = new RequestType("analyzeFiles");
connection.onRequest(analyzeFilesRequest, (data) => {
	analyzeFiles(data.files).then(
		(files)=>{
			analyzeFiles(data.files.filter(p => isReqUri(p) || project.fileHasReferences(p)))
			.then(tellClient, reportAnalyzingFailure);
		},
		reportAnalyzingFailure
	);
});

var ignoreFiles: RequestType<[string,string[]][], any, any> = new RequestType("ignoreFiles");
connection.onRequest(ignoreFiles, (ignores:[string,string[]][]) => project.setIgnores(ignores));

var getDefinitionRequest: RequestType<string, any, any> = new RequestType("getDefinition");
connection.onRequest(getDefinitionRequest, (id) => {
	let defs = project.findDefinitionLocations(id);
	return defs.length?defs[0]:undefined;
});

// $$Implements Editor.ERR.DEMOTE
var toggleErrWarn: RequestType<boolean, any, any> = new RequestType("toggleErrWarn");
connection.onRequest(toggleErrWarn, async () => {
	await project.toggleErrWarn();
});

// $$Implements Editor.TESTS
// $$Реализует РЕДАКТОР.ТЕСТЫ
var toggleTestWarn: RequestType<string, any, any> = new RequestType("toggleTestWarn");
connection.onRequest(toggleTestWarn, async (uri: string) => {
	await project.toggleTestWarn(uri);
});

var exportHtml: RequestType<{
	folderUri:string,
	workspaceUri:string
}, any, any> = new RequestType("exportHtml");
connection.onRequest(exportHtml, data => {
	try {
		project.exportHtml(data.folderUri, data.workspaceUri, (message,increment)=>{
			connection.sendNotification("exportHtml/progress", {message,increment});
		});
	} catch (ex) {
		connection.sendNotification("exportHtml/progress", { message: ex, increment:-1 });
	}
});

let coverageReport: RequestType<{
	uri: string
}, any, any> = new RequestType("coverageReport");
connection.onRequest(coverageReport, data => {
	try {
		project.coverageReport(data.uri, (message, increment) => {
			connection.sendNotification("coverageReport/progress", { message, increment });
		});
	} catch (ex) {
		connection.sendNotification("coverageReport/progress", { message: ex, increment: -1 });
	}
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();

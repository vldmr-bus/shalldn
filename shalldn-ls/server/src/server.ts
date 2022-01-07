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
	TextDocumentChangeEvent} from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import { Diagnostics } from './Diagnostics';
import { Util } from './util';
import ShalldnProj, { AnalyzerPromise } from './ShalldnProj';
import { URI } from 'vscode-uri';

import {from, lastValueFrom, mergeMap} from 'rxjs';
import * as fs from 'fs/promises';
import { Capabilities } from './capabilities';

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
			referencesProvider: true
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

let termsCache: string;
function tellClient(files:string[]) {
	let terms = JSON.stringify(project.getAllTerms());
	if (terms != termsCache)
		termsCache = terms;
	else
		terms = '';
	connection.sendRequest("analyzeDone", terms)
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
connection.onDidChangeWatchedFiles(_change => {
	let changed:string[] = [];
	_change.changes.forEach(event=>{
		if (!event.uri.startsWith('file://'))
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

function isRqDoc(doc:TextDocument):boolean {
	return doc.languageId == 'shalldn' || doc.languageId == 'markdown' && /\.shalldn$/.test(doc.uri);
}

// $$Implements Editor.NAV_RQ_DEF
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

		let id = Util.lineFragment(tr,p.character,/.*?([\w\.]*)$/,/^([\w\.]*).*?$/s);
		if (id) {
			let defs = project.findDefinition(id);
			if (defs.length > 0 || !isRqDoc(document)) {
				resolve(defs);
				return;
			}
		}

		// informal requirement definition
		id = Util.lineFragment(tr, p.character,/^.*Implements\s+\*\*([^*]+)$/,/^([^*]*)\*\*/);
		if (id) {
			let defs = project.findDefinition(id);
			if (defs.length > 0 || !isRqDoc(document)) {
				resolve(defs);
				return;
			}
		}

		// term definitions
		id = Util.lineFragment(tr, p.character,/\*+([^*]*)$/,/^([^*]*)\*+/s);
		if (!id)
			id = Util.lineFragment(tr, p.character,/_+([^*_]*)$/, /^([^*_]*)_+/s);
		if (id)
			resolve(project.findTerms(id));
		resolve(null);
	});
});

// $$Implements Editor.NAV_IMPL
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

		let id = Util.lineFragment(tr, p.character,/.*?([\w\.]*)$/, /^([\w\.]*).*?$/s);
		if (id) {
			let refs = project.findReferences(id.text);
			if (refs.length > 0 || !isRqDoc(document)) {
				resolve(refs);
				return;
			}
		}

		// informal requirement references
		id = Util.lineFragment(tr, p.character,/^#+.*\*([^*]+)$/,/^([^*]*)\*.*$/);
		if (id)
			resolve(project.findReferences(id.text));
		resolve(null);
	});

})


// $$Implements Analyzer.PROJECT
var analyzeFilesRequest: RequestType<{
	files: string[],
}, any, any> = new RequestType("analyzeFiles");
connection.onRequest(analyzeFilesRequest, (data) => {
	analyzeFiles(data.files).then(
		(files)=>{
			analyzeFiles(data.files.filter(p => /.*\.shalldn$/.test(p)))
			.then(tellClient, reportAnalyzingFailure);
		},
		reportAnalyzingFailure
	);
});

var ignoreFiles: RequestType<string[], any, any> = new RequestType("ignoreFiles");
connection.onRequest(ignoreFiles, (ignores:string[]) => project.setIgnores(ignores));

// $$Implements Editor.ERR_DEMOTE
var toggleErrWarn: RequestType<boolean, any, any> = new RequestType("toggleErrWarn");
connection.onRequest(toggleErrWarn, () => {
	project.toggleErrWarn();
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Vladimir Avdonin. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult,
	RequestType,
	FileChangeType
} from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import { Diagnostics } from './Diagnostics';
import { Util } from './util';
import ShalldnProj from './model/ShalldnProj';
import { URI } from 'vscode-uri';

import {from, mergeMap} from 'rxjs';
import * as fs from 'fs/promises';

var debug = /--inspect/.test(process.execArgv.join(' '))

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

export class Capabilities {
	public Config = false
	public WorkspaceFolder = false
	public DiagnRelated = false
}

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
	project = new ShalldnProj(connection, cpblts);

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
	documents.all().forEach(validateTextDocument);
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

// $$Implements Analyzer.MODS
documents.onDidChangeContent(async change => {
	let linked = project.getLinked(change.document.uri);
	await validateTextDocument(change.document);
	for (let l of project.getLinked(change.document.uri))
		linked.add(l);
	analyzeFiles([...linked]).subscribe();
});


async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// In this simple example we get the settings for every validate run.
	const settings = await getDocumentSettings(textDocument.uri);

	const text = textDocument.getText();
	project.analyze(textDocument.uri,text);
}

// $$Implements Analyzer.MODS
connection.onDidChangeWatchedFiles(_change => {
	let changed:string[] = [];
	_change.changes.forEach(event=>{
		if (event.type == FileChangeType.Created)
			return;
		if (event.type = FileChangeType.Deleted)
			project.remove(event.uri);
		if (event.type = FileChangeType.Changed) {
			changed.push(event.uri);
		}
	})
	
	if (changed.length == 0)
		return;
	let linked = new Set<string>();
	changed.forEach(uri => { linked = new Set([...linked, ...project.getLinked(uri)]);})
	analyzeFiles(changed).subscribe({
		complete() {
			changed.forEach(uri => { linked = new Set([...linked, ...project.getLinked(uri)]); })
			analyzeFiles([...linked]).subscribe();
		}
	})

	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});

function isRqDoc(doc:TextDocument):boolean {
	return doc.languageId == 'shalldn' || doc.languageId == 'markdown' && /\.shalldn$/.test(doc.uri);
}

connection.onDefinition((params, cancellationToken) => {
	return new Promise((resolve, reject) => {
		const document = documents.get(params.textDocument.uri);
		const p = params.position;
		let line = document?.getText(Util.lineRangeOfPos(p)).trim();
		if (!document || !line) {
			resolve([]);
			return;
		}

		let id = line.substring(0,p.character).replace(/.*?([\w\.]*)$/, '$1')+
			line.substring(p.character).replace(/^([\w\.]*).*?$/, '$1');
		let defs = project.findDefinition(id);
		if (defs.length > 0 || !isRqDoc(document)) {
			resolve(defs);
			return;
		}

		// informal requirement definition
		id = line.substring(0, p.character).replace(/^.*Implements\s+\*\*([^*]+)$/, '$1') +
			line.substring(p.character).replace(/^([^*]*)\*\*\s*?$/, '$1');
		resolve(project.findDefinition(id));
	});
});

connection.onReferences((params)=>{
	return new Promise((resolve, reject) => {
		const document = documents.get(params.textDocument.uri);
		const p = params.position;
		let line = document?.getText(Util.lineRangeOfPos(p)).trim()||'';
		if (!document || !line) {
			resolve([]);
			return;
		}

		let id = line.substring(0,p.character).replace(/.*?([\w\.]*)$/, '$1')+
			line.substring(p.character).replace(/^([\w\.]*).*?$/, '$1');
		let refs = project.findReferences(id);
		if (refs.length > 0 || !isRqDoc(document)) {
			resolve(refs);
			return;
		}

		// informal requirement references
		id = line.substring(0, p.character).replace(/^#+.*\*([^*]+)$/, '$1') +
			line.substring(p.character).replace(/^([^*]*)\*.*$/, '$1');
		resolve(project.findReferences(id));
	});

})

// $$Implements Analyzer.PROJECT
function analyzeFiles(files: string[]) {
	return from(files)
	.pipe(
		mergeMap(uri => {
			let path = URI.parse(uri).fsPath;
			return fs.readFile(path, 'utf8')
				.then(
					text => project.analyze(uri, text),
					reason => connection.sendDiagnostics({
						uri: uri,
						diagnostics: [Diagnostics.error(reason.message, { line: 0, character: 0 })]
					})
				)
		},
			100
		)
	);
}

// $$Implements Analyzer.PROJECT
var analyzeFilesRequest: RequestType<{
	files: string[],
}, any, any> = new RequestType("analyzeFiles");
connection.onRequest(analyzeFilesRequest, (data) => {
	analyzeFiles(data.files)
	.subscribe({
		complete() {
			analyzeFiles(data.files.filter(p=>/.*\.shalldn$/.test(p)))
			.subscribe();
		}
	});
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();

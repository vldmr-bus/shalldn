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
	RequestType
} from 'vscode-languageserver/node';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

import { ANTLRErrorListener, CharStreams, CommonTokenStream, RecognitionException, Recognizer, ParserErrorListener, Token, DiagnosticErrorListener } from 'antlr4ts';
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker';

import {from, mergeMap} from 'rxjs';

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

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

import { shalldnLexer } from './antlr/shalldnLexer'
import { shalldnParser } from './antlr/shalldnParser'
import ShalldnDocumentBuilder from './ShalldnDocumentBuilder';
import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener';
import ShalldnDoc from './model/ShalldnDoc';
import { Diagnostics } from './Diagnostics';
import { Util } from './util';
import ShalldnProj from './model/ShalldnProj';
import { Observable } from 'rxjs';
import LexerErrorListener from './LexerErrorListener';
import ParseErrorListener from './ParseErrorListener';

let diagnostics: Diagnostic[] = [];

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
	// In this simple example we get the settings for every validate run.
	const settings = await getDocumentSettings(textDocument.uri);

	const text = textDocument.getText();
	diagnostics = [];

	let inputStream = CharStreams.fromString(text);
	let lexer = new shalldnLexer(inputStream);
	lexer.addErrorListener(new LexerErrorListener(cpblts.DiagnRelated ? textDocument.uri:"", d=>diagnostics.push(d)));
	let tokenStream = new CommonTokenStream(lexer);
	let parser = new shalldnParser(tokenStream);
	// if (debug) {
	// 	parser.removeErrorListeners();
	// 	parser.addErrorListener(new DiagnosticErrorListener());
	// }
	parser.addErrorListener(new ParseErrorListener(cpblts.DiagnRelated ? textDocument.uri:"",d=>diagnostics.push(d)));
	let dctx = parser.document();

	let problems = 0;
	const doc = new ShalldnDoc(textDocument);
	let listener = new ShalldnDocumentBuilder(doc, parser);
	ParseTreeWalker.DEFAULT.walk(listener as ParseTreeListener, dctx);
	//$$Implements Parser.ERR_No_DOC_Subject
	if ((doc.subject||null) == null)
		diagnostics.push(
			Diagnostics.error(`No subject defined in the document.`, textDocument.positionAt(0))
			.addRelated('The subject of the document is defined by the only italicized group of words in the first line of the document')
		);

	
	for (const rq of doc.requirements) { 
		//$$Implements Parser.ERR_NO_SUBJ
		if (doc.subject && !rq.pre.trim().endsWith(doc.subject))
			diagnostics.push(
				Diagnostics.errorAtRange(`The requirement subject is different from the document subject ${doc.subject}.`, rq.preRange)
				.addRelated('The subject of the document is defined by the only italicized group of words in the first line of the document')
			);
	}

	// Send the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	connection.console.log('We received an file change event');
});

connection.onDefinition((params, cancellationToken) => {
	return new Promise((resolve, reject) => {
		const document = documents.get(params.textDocument.uri);
		const p = params.position;
		let line = document?.getText(Util.lineRangeOfPos(p)).trim();
		if (!line) {
			resolve([]);
			return;
		}

		let id = line.substring(0,p.character).replace(/.*?([\w\.]*)$/, '$1')+
			line.substring(p.character).replace(/^([\w\.]*).*?$/, '$1');
		resolve(project.findDefinition(id));
	});
});

connection.onReferences((params)=>{
	return new Promise((resolve, reject) => {
		const document = documents.get(params.textDocument.uri);
		const p = params.position;
		let line = document?.getText(Util.lineRangeOfPos(p)).trim();
		if (!line) {
			resolve([]);
			return;
		}

		let id = line.substring(0,p.character).replace(/.*?([\w\.]*)$/, '$1')+
			line.substring(p.character).replace(/^([\w\.]*).*?$/, '$1');
		resolve(project.findReferences(id));
	});

})

var analyzeFiles: RequestType<{
	files: string[],
}, any, any> = new RequestType("analyzeFiles");
connection.onRequest(analyzeFiles, (data) => {
	from(data.files)
	.pipe(mergeMap(url=>project.analyze(url),100))
	.subscribe();
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();

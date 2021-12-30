import * as path from 'path';
import { existsSync, readFileSync} from 'fs';
import ignore from 'ignore';
import * as vscode from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	RequestType,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';
import { DictTreeDataProvider } from './dictTreeDataProvider';
import ShalldnTermDef from './ShalldnTermDef';

let client: LanguageClient;
let statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
statusBarItem.hide();

function showIndexingStatusBarMessage() {
	statusBarItem.text = "$(zap) Shalldn working...";
	statusBarItem.tooltip = "Shalldn language server is analyzing files in the workspace";
	statusBarItem.show();
}

const dictTreeDataProvider = new DictTreeDataProvider();

export function activate(context: vscode.ExtensionContext) {
	vscode.window.registerTreeDataProvider('shalldnDictionary', dictTreeDataProvider);

	vscode.commands.registerCommand('shalldn.dict.reveal', (def: ShalldnTermDef) => 
	{
		vscode.window.showTextDocument(vscode.Uri.parse(def.uri,),{
			selection:def.range
		})
	});

	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [
			{ scheme: 'file'},
		],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: (vscode.workspace.workspaceFolders || [])
				.map(f => vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(f, '**/*')))
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'shalldnLanguageServer',
		'Shalldn Language Server',
		serverOptions,
		clientOptions
	);

	// $$Implements Editor.ERR_DEMOTE
	context.subscriptions.push(
		vscode.commands.registerCommand('shalldn.toggleErrWarn', () => {
			client.sendRequest("toggleErrWarn",true);
		})
	);

	// Start the client. This will also launch the server
	client.start();

	let files = {
		include: ['*'],//['shalldn','js','ts','cs','g4','c','cpp'],
		exclude: ['png','jpg','gif','dll','jar']
	}

	const ig = ignore();
	const ignores: string[] = [];
	vscode.workspace.findFiles('**/.gitignore').then(uris=>{
		// $$Implements Analyzer.GITIGNORE
		uris.forEach(uri=>{
			if (existsSync(uri.fsPath)) {
				let txt = readFileSync(uri.fsPath).toString()
				let pfx = vscode.workspace.asRelativePath(uri).replace(/\/?.gitignore$/,'');
				if (pfx)
					txt = txt.replace(/\r/g,'').replace(/^([^#].*)$/gm,`${pfx}$1`);
				ignores.push(txt);
			}
		})
		ignores.forEach(txt => ig.add(txt));

		let include = `**/*.{${files.include.join(',') || '*'}}`;
		let exlude = `**/*.{${files.exclude.join(',') || undefined}}`;
		return vscode.workspace.findFiles(include,exlude);
	})
	.then(files => {
		// $$Implements Analyzer.PROJECT
		var uris: string[] = [];
		files.forEach(uri => {
			if (!ig.ignores(vscode.workspace.asRelativePath(uri.fsPath)))
				uris.push(uri.toString());
		});

		client.onReady().then(() => {
			client.onRequest(new RequestType('analyzeStart'), ()=>{
				showIndexingStatusBarMessage();				
			})
			client.onRequest(new RequestType('analyzeDone'), (terms:string) => {
				statusBarItem.hide();
				if (terms)
					dictTreeDataProvider.setItems(JSON.parse(terms));
			})

			client.sendRequest("ignoreFiles", ignores);
			client.sendRequest("analyzeFiles", {
				files: uris,
			});
		});
	});

}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

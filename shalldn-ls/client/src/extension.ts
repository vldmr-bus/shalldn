import * as path from 'path';
import { existsSync, readFileSync} from 'fs';
import * as vscode from 'vscode';
import {FsUtil} from '../../shared/lib/fsutil';
import MultIgnore from '../../shared/lib/multignore';

import {
	LanguageClient,
	LanguageClientOptions,
	RequestType,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';
import { DictTreeDataProvider } from './dictTreeDataProvider';
import ShalldnTermDef from './ShalldnTermDef';
import { TagTreeDataProvider, TagTreeNode } from './tagTreeDataProvider';
import { Trees } from '../../shared/lib/trees';
import { map } from 'rxjs';

let client: LanguageClient;
let statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
statusBarItem.hide();

function showIndexingStatusBarMessage() {
	statusBarItem.text = "$(zap) Shalldn working...";
	statusBarItem.tooltip = "Shalldn language server is analyzing files in the workspace";
	statusBarItem.show();
}

function showAnalyzingError() {
	statusBarItem.text = "$(flame) Shalldn failed...";
	statusBarItem.tooltip = "Shalldn failed analyzing files in the workspace";
	statusBarItem.show();
}

const dictTreeDataProvider = new DictTreeDataProvider();
const tagTreeDataProvider = new TagTreeDataProvider();

export function activate(context: vscode.ExtensionContext) {
	vscode.window.registerTreeDataProvider('shalldnDictionary', dictTreeDataProvider);
	//vscode.window.registerTreeDataProvider('shalldnTags', tagTreeDataProvider);
	const tagsTreeView = vscode.window.createTreeView('shalldnTags', {treeDataProvider:tagTreeDataProvider,showCollapseAll:true});
	vscode.commands.registerCommand('shalldn.dict.reveal', (def: ShalldnTermDef) => 
	{
		vscode.window.showTextDocument(vscode.Uri.parse(def.uri,),{
			selection:def.range
		})
	});

	vscode.commands.registerCommand('shalldn.def.reveal', (id: string) => 
	{
		id = id.replace(/^[^.]+\./, '');
		client.sendRequest("getDefinition", id)
			.then((loc: { targetUri: string, targetSelectionRange:vscode.Range})=>{
				if (!loc)
					return;
			vscode.window.showTextDocument(vscode.Uri.parse(loc.targetUri), {
				selection: loc.targetSelectionRange
			})
		});
	});

	vscode.commands.registerCommand('shalldn.expand.all', async (item: TagTreeNode) => {
		if (typeof item == 'string')
			return;
		await Trees.recurseNodesAsync(item, async i=>{
			await tagsTreeView.reveal(i,{expand:true});
		});
	});
	vscode.commands.registerCommand('shalldnTags.group', () => {
		tagTreeDataProvider.toggleGrouped();
	});
	vscode.commands.registerCommand('shalldnTags.ungroup', () => {
		tagTreeDataProvider.toggleGrouped();
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

	context.subscriptions.push(
		vscode.commands.registerCommand('shalldn.exportHtml', async () => {
			let wsf = (vscode.workspace.workspaceFolders.length>1) ? await vscode.window.showWorkspaceFolderPick(/*{ placeHolder:'Please select workplace'}*/) : vscode.workspace.workspaceFolders[0];
			if (!wsf)
				return;
			const folderUris = await vscode.window.showOpenDialog({ canSelectFolders: true, canSelectFiles: false, canSelectMany: false, openLabel: 'Select destination folder' });
			if (!folderUris) {
				return;
			}

			let progress: vscode.Progress<{ message?: string; increment?: number }>;
			vscode.window.withProgress({
				location: vscode.ProgressLocation.Notification,
				title: "Exporting to Html",
				cancellable: true
			}, (p, token) => {
				token.onCancellationRequested(() => {
					console.log("User canceled the long running operation");
				});

				p.report({ increment: 0, message: "Exporting Shalldn project" });
				progress = p;
				const promise = new Promise<void>(resolve => {
					let ntfDsp = client.onNotification("exportHtml/progress", (data:{message?: string, increment?: number}) => {
						let increment = data.increment;
						let message = data.message;
						if (increment == -1) {
							ntfDsp.dispose();
							resolve();
							vscode.window.showErrorMessage("Shalldn: Export failed --\r\n "+message);
						} 
						if (increment<100)
							p.report({ increment, message});
						else {
							ntfDsp.dispose();
							resolve();
							vscode.window.showInformationMessage("Shalldn: Export completed");
						}
					});
					client.sendRequest("exportHtml", {folderUri:folderUris[0].toString(), workspaceUri:wsf.uri.toString()});
				});
				return promise;
			});
		})
	);

	// Start the client. This will also launch the server
	client.start();

	let files = {
		include: ['*'],//['shalldn','js','ts','cs','g4','c','cpp'],
		exclude: ['png','jpg','gif','dll','jar']
	}

	const ignore = new MultIgnore();
	const ignores: Map<string,string[]> = new Map();
	vscode.workspace.workspaceFolders.forEach(f=>{
		ignores.set(f.uri.fsPath, ['**/.git']);
	})
	vscode.workspace.findFiles('**/.gitignore').then(uris=>{
		// $$Implements Analyzer.GITIGNORE
		uris.forEach(uri=>{
			if (existsSync(uri.fsPath)) {
				let txt = readFileSync(uri.fsPath).toString();
				for (let wsf of ignores.keys()) {
					if (FsUtil.isInside(wsf,uri.fsPath)) {
						let pfx = path.relative(wsf,uri.fsPath).replace(/\/?.gitignore$/, '');
						if (pfx)
							txt = txt
								.replace(/\r/g, '')
								.split('\n')
								.filter(s => !s.startsWith('#') && s.trim().length != 0)
								.map(s=>pfx+s)
								.join('\n');
						ignores.get(wsf).push(txt);
					}
				}
			}
		})
		ignores.forEach((lines,path) => ignore.add(path,lines));

		let include = `**/*.{${files.include.join(',') || '*'}}`;
		let exlude = `**/*.{${files.exclude.join(',') || undefined}}`;
		return vscode.workspace.findFiles(include,exlude);
	})
	.then(files => {
		// $$Implements Analyzer.PROJECT
		var uris: string[] = [];
		files.forEach(uri => {
			if (!ignore.ignores(uri.fsPath))
				uris.push(uri.toString());
		});

		client.onReady().then(() => {
			client.onRequest(new RequestType('analyzeStart'), ()=>{
				showIndexingStatusBarMessage();				
			})
			client.onRequest(new RequestType('analyzeDone'), (data:{terms:string, tags:string}) => {
				statusBarItem.hide();
				if (data.terms)
					dictTreeDataProvider.setItems(JSON.parse(data.terms));
				if (data.tags)
					tagTreeDataProvider.setItems(JSON.parse(data.tags));

			})
			client.onNotification("analyze/error",err=>{
				showAnalyzingError();
				if (err)
					console.log("Shalldn failed analyzing files in workspace: "+err.toString());
			})

			client.sendRequest("ignoreFiles", [...ignores]);
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

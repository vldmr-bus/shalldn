import * as path from 'path';
import { workspace, ExtensionContext, StatusBarItem, StatusBarAlignment, window } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;
let statusBarItem: StatusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);;

function showIndexingStatusBarMessage() {
	statusBarItem.text = "$(zap) Shalldn indexing...";
	statusBarItem.tooltip = "Shalldn language server is analyzing files in the workspace";
	statusBarItem.show();
}

export function activate(context: ExtensionContext) {
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
			fileEvents: workspace.createFileSystemWatcher('**/*')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'shalldnLanguageServer',
		'Shalldn Language Server',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();

	let files = {
		include: ['shalldn','ts','cs'],
		exclude: []
	}
	workspace.findFiles(`**/*.{${files.include.join(',')}}`).then(files => {
		var uris: string[] = [];
		files.forEach(file => {
			uris.push(file.toString());
		});

		client.onReady().then(() => {
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

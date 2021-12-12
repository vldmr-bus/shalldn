/* --------------------------------------------------------------------------------------------
 * Copyright (c) Vladimir Avdonin. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import Test from './test';

export namespace helpers {
	export let doc: vscode.TextDocument;
	export let editor: vscode.TextEditor;
	export let documentEol: string;
	export let platformEol: string;

	/**
	 * Activates the vscode.shalldn extension
	 */
	export async function activate(docUri: vscode.Uri) {
		// The extensionId is `publisher.name` from package.json
		const ext = vscode.extensions.getExtension('vldmr-bus.shalldn')!;
		await ext.activate();
		try {
			doc = await vscode.workspace.openTextDocument(docUri);
			editor = await vscode.window.showTextDocument(doc);
			await sleep(2000); // Wait for server activation
		} catch (e) {
			console.error(e);
		}
	}

	async function sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	export const getDocUri = async (p: string) => {
		let uri:vscode.Uri;
		let uris=await vscode.workspace.findFiles(p);
		return uris.length?uris[0]:undefined;
	};

	export async function enterText(text:string) {
		let pos = doc.positionAt(Math.max(0, doc.getText().length - 1));
		await editor.edit(eb => 
			eb.insert(pos, text)
		);
		return sleep(100); // release control for extension to do its job
	}

	export async function setTestContent(content: string): Promise<boolean> {
		const all = new vscode.Range(
			doc.positionAt(0),
			doc.positionAt(doc.getText().length)
		);
		return editor.edit(eb => eb.replace(all, content));
	}

	let global_id = 1;
	export function expandTextVariables(text:string, test:Test) {
		const unique_id_re = /\{unique_id\}/g;
		if (unique_id_re.test(text)) {
			const uuid = 'Test.'+(global_id++).toString();
			text = text
				.replace(unique_id_re, uuid);
			test.thatId = uuid;
		}
		text = text
			.replace(/\{that_id\}/g,test.thatId);
		
			return text;
	}

	export async function discardChanges() {
		await vscode.window.showTextDocument(doc);
		return vscode.commands.executeCommand('workbench.action.files.revert')
	}

}
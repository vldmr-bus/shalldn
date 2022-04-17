/* --------------------------------------------------------------------------------------------
 * Copyright (c) Vladimir Avdonin. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import Test from './test';
import * as path from "path";
export namespace helpers {
    export let doc: vscode.TextDocument;
    export let editor: vscode.TextEditor;
    export let documentEol: string;
    export let platformEol: string;

    /**
     * Activates the vscode.shalldn extension
     */
    export async function activate() {
        // The extensionId is `publisher.name` from package.json
        const ext = vscode.extensions.getExtension('vldmr-bus.shalldn')!;
        await ext.activate();
    }

    export async function openDoc(docUri: vscode.Uri) {
        try {
            doc = await vscode.workspace.openTextDocument(docUri);
            editor = await vscode.window.showTextDocument(doc);
            await sleep(2000); // Wait for server activation
        } catch (e) {
            console.error(e);
        }
    }

    export async function createDoc(path: string):Promise<vscode.Uri> {
        try {
            let folders = vscode.workspace?.workspaceFolders;
            if (folders)
                path = folders[0].uri.fsPath + '/' + path;
            doc = await vscode.workspace.openTextDocument(vscode.Uri.file(path).with({ scheme: 'untitled' }));
            editor = await vscode.window.showTextDocument(doc);
            await sleep(2000); // Wait for server activation
            return doc.uri;
        } catch (e) {
            console.error(e);
            throw e;
        }
    }


    export async function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    export const getDocUri = async (p: string) => {
        let uris=await vscode.workspace.findFiles(p);
        return uris.length?uris[0]:undefined;
    };

    export async function getDocText(l:vscode.Location|vscode.LocationLink) {
        let doc = await vscode.workspace.openTextDocument(('uri' in l) ? l.uri : l.targetUri);
        return doc.getText(('uri' in l) ? l.range : l.targetRange);
    }

    export async function getDocLine(l:vscode.Location|vscode.LocationLink) {
        let doc = await vscode.workspace.openTextDocument(('uri' in l) ? l.uri : l.targetUri);
        let range = ('uri' in l) ? l.range : l.targetRange;
        let lineRange = new vscode.Range(range.start.line, 0, range.start.line+1,0)
        return doc.getText(lineRange);
    }

    export function getExtName(l: vscode.Location | vscode.LocationLink) {
        let uri = ('uri' in l) ? l.uri : l.targetUri;

        return path.extname(uri.fsPath);
    }

    export function getText(r:vscode.Range) {
        return doc.getText(r);
    }

    export async function enterText(text:string) {
        let pos = doc.positionAt(Math.max(0, doc.getText().length));
        await editor.edit(eb => 
            eb.insert(pos, text)
        );
        let newpos = doc.positionAt(Math.max(0, doc.getText().length));
        vscode.window.activeTextEditor!.selection = new vscode.Selection(newpos,newpos);
        return sleep(200); // release control for extension to do its job
    }

    export async function setTestContent(content: string): Promise<boolean> {
        const all = new vscode.Range(
            doc.positionAt(0),
            doc.positionAt(doc.getText().length)
        );
        return editor.edit(eb => eb.replace(all, content));
    }

    function sanitizeSearch(line: string | RegExp) {
        if (typeof (line) == 'string')
            line = line.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return line;
    }

    export function midRange(range:vscode.Range) {
        let pos:vscode.Position = new vscode.Position(
            range.start.line + Math.floor(Math.abs(range.end.line - range.start.line)/2),
            range.start.character + Math.floor(Math.abs(range.end.character - range.start.character) / 2)
        );
        return pos;
    }

    export function getTextPosition(line:string|RegExp, word:string|RegExp) {
        line = sanitizeSearch(line);
        word = sanitizeSearch(word);
        let text = doc.getText();
        let pos = text.search(line);
        if (pos<0)
            throw 'Text not found in the document';
        if (typeof(line)!='string') {
            line = text.match(line)![0];
        }
        let wpos = line.search(word);
        if (wpos<0)
            throw 'Word not found in line';
        if (typeof (word) != 'string') {
            word = line.match(word)![0];
        }
        return new vscode.Range(
            doc.positionAt(pos+wpos),
            doc.positionAt(pos+wpos+word.length)
        )
    }

    let global_id = 1;
    const unique_id_re = /\{unique_id\}/g;
    const unique_filename_re = /\{unique_filename\}/g;
    export function expandTextVariables(text:string, test:Test) {
        if (unique_id_re.test(text)) {
            const uid = 'Test.'+(global_id++).toString();
            text = text
                .replace(unique_id_re, uid);
            test.thatId = uid;
        }
        if (unique_filename_re.test(text)) {
            const uname = 'TestFile' + (global_id++).toString();
            text = text
                .replace(unique_filename_re, uname);
        }
        text = text
            .replace(/\{that_id\}/g,test.thatId);
        
            return text;
    }

    export async function discardChanges(test:Test) {
        let uri = doc.uri;
        await vscode.window.showTextDocument(doc);
        await vscode.commands.executeCommand('workbench.action.files.revert');
        if (test.newFile) {
            await vscode.commands.executeCommand('workbench.action.closeEditorsInGroup');
            if (uri.scheme == "file")
                await vscode.workspace.fs.delete(uri);
        }
    }
    export function escapeRegExp(s: string) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

}
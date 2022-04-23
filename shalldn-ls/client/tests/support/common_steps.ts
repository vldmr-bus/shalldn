import { Given, When, Then, After, BeforeAll } from "@cucumber/cucumber";
import * as assert from 'assert';
import { runTests } from '@vscode/test-electron';
import { helpers } from './helper';
import * as vscode from 'vscode';
import Test from './test';
import * as path from "path";
import {setDefaultTimeout} from '@cucumber/cucumber';

BeforeAll(
async function activate() {
	
	await helpers.activate();
})

After('@discard_changes',
async function dsicardChanges(this:Test){
	await helpers.discardChanges(this);
})

After('@repeat_that_command_after_test',
	async function (this: Test) {
		if (!this.thatCommand)
			throw 'thatCommand not defined in test with tag repeat_that_command_after_test';
		await vscode.commands.executeCommand(this.thatCommand);
	}
)

Given(/the test file named \"(.*)\" (?:with requirement id \"([\w\.]+)\"|is opened)/,
async function openFile(this:Test,fileName:string,reqId:string) {
	if (!fileName.startsWith('..')) {
		this.docUri = await helpers.getDocUri(fileName);
		if (!this.docUri)
			assert.fail(`File ${fileName} is not found in workspace`);
	} else {
		let wspath = vscode!.workspace!.workspaceFolders![0]!.uri!.fsPath;
		let abspath = path.resolve(wspath, fileName);
		this.docUri = vscode.Uri.parse('file:/'+abspath);
	}
	this.thatId = reqId;
	await helpers.openDoc(this.docUri);
})

Given(/a new file with name "(.*)" is created/,
async function createFile(this:Test,filename:string) {
	filename = helpers.expandTextVariables(filename, this);
	this.docUri = await helpers.createDoc(filename);
	this.newFile = true;
})

When("the text below is appended to the end of the file",
async function enterText(this:Test, text:string){
	text = text.replace(/\\/g,'')
	text = helpers.expandTextVariables(text,this);
	await helpers.enterText(text);
	await helpers.sleep(800);
})


const severities: { [id: string]: vscode.DiagnosticSeverity} = { 
	'error': vscode.DiagnosticSeverity.Error,
	'warning': vscode.DiagnosticSeverity.Warning,
	'info': vscode.DiagnosticSeverity.Information,
}
Then(/editor problems shall include (error|warning|info) (?:for the words "([^"]+)" )?with the text:/, 
async function verifyProblem(this:Test, severity:string, words:string|undefined, text:string){
	text = helpers.expandTextVariables(text, this);
	if (!this.docUri)
		assert.fail('The test step does not have a required document')
	const actualDiagnostics = vscode.languages.getDiagnostics(this.docUri);

	let problem = actualDiagnostics.find(d=>d.message==text);
	assert.notEqual(problem,undefined, `Problem not found with text "${text}"`);
	assert.equal(problem?.severity, severities[severity]??-1, `Expected "${severity}" severity of problem`);
	if (words) {
		let actual = helpers.getText(problem!.range);
		assert.equal(actual,words,"Wrong target text of the problem");
	}
})

When(/list of definitions is obtained for the word "(\w+)" in following text:/,
//{ timeout: -1 },
async function getDefinitions(this:Test,word:string,text:string){
	let range = helpers.getTextPosition(text,word);
	this.locLinks = (await vscode.commands.executeCommand(
		'vscode.executeDefinitionProvider',
		this.docUri,
		helpers.midRange(range)
	)) as Array<vscode.Location|vscode.LocationLink>;
})

Then(/the list shall contains definition in file "(.*)"/,
async function checkLocation(this:Test,file:string,text:string) {
	if (!this.locLinks)
		assert.fail('The test step does not have a list of locations')
	let fileLocations = this.locLinks.filter(l=>
		(('uri'in l)?l.uri:l.targetUri).toString().endsWith(file)
	);
	let locations: (vscode.LocationLink|vscode.Location)[]=[];
	for (let loc of fileLocations) {
		let actual = (await helpers.getDocText(loc)).trim();
		if (text == actual)
			locations.push(loc);
	}
	assert.equal(locations.length,1,`The file ${file} shall have definition "${text}"`);
})

Then("editor problems shall not include a problem with the text:",
function checkNoError(this:Test, text:string){
	text = helpers.expandTextVariables(text, this);
	if (!this.docUri)
		assert.fail('The test step does not have a required document')
	const actualDiagnostics = vscode.languages.getDiagnostics(this.docUri);

	let problem = actualDiagnostics.find(d => d.message.search(text)>=0);
	assert.strictEqual(problem, undefined, `Problem found with text "${text}"`);
})

When(/list of references is obtained for the word "(\w+)" in following text:/,
async function getReferences(this:Test,word:string,text:string){
	let range = helpers.getTextPosition(text,word);
	this.locLinks = (await vscode.commands.executeCommand(
		'vscode.executeReferenceProvider',
		this.docUri,
		helpers.midRange(range)
	)) as Array<vscode.Location|vscode.LocationLink>;
})

Then(/the list shall contain reference from the file "(.*)" with id "(([^"]+))"(?: that follows the text "([^"]+)")?/,
async function checkreference(this:Test,file:string,id:string,text?:string): Promise<void> {
	if (!this.locLinks)
		assert.fail('The test step does not have a list of locations')
	let fileLocations = this.locLinks.filter(l=>
		(('uri'in l)?l.uri:l.targetUri).toString().endsWith(file)
	);
	let locations: (vscode.LocationLink|vscode.Location)[]=[];
	for (let loc of fileLocations) {
		let doctext = await helpers.getDocText(loc);
		if (helpers.getExtName(loc).toLowerCase() == '.shalldn') {
			let actual = doctext.trim().replace(/^(?:.*\n)?\*\*([\w.]+)\*\*.*$/ms, '$1');
			if (id == actual)
				locations.push(loc);
		} else {
			if (doctext == id) {
				let found = true;
				if (text) {
					let line = await helpers.getDocLine(loc);
					let pfx = line.split(id)[0];
					found = pfx.search(helpers.escapeRegExp(text)) >= 0;
				}
				if (found)
					locations.push(loc);
			}
		}
	}
	assert.equal(locations.length,1,`The file ${file} shall have reference with id "${id}"`);
})

Then(/the list shall be empty/,
async function checkreference(this:Test) {
	if (!this.locLinks)
		assert.fail('The test step does not have a list of locations')
	assert.equal(this.locLinks.length,0,'The list of refrences shall be empty');
})

When('the list of completion proposals is requested for current position',
async function requestCompletions(this:Test) {
	if (!vscode.window.activeTextEditor)
		assert.fail('No active editor ');
	if (!vscode.window.activeTextEditor.selection)
		assert.fail('No active selection in editor');
	let position = vscode.window.activeTextEditor.selection.active;
	this.complList = (await vscode.commands.executeCommand(
		'vscode.executeCompletionItemProvider',
		this.docUri,
		position,
	)) as vscode.CompletionList;
})

Then(/the list of proposals shall (not |)include the following entries( in given order|):/,
	function checkCompletions(this: Test, not:string, checkOrder:string, text: string) {
		if (!this.complList)
			assert.fail('The test step does not have a list of completions')
		let items = text.split('\n');
		let lastIdx = -1;
		items.forEach((it,i)=>{
			let entry = this.complList!.items.find(c=>c.label == it);
			if (not)
				assert.equal(entry,undefined,`Item '${it}' was not expected in list of comletions`);
			else {
				assert.notEqual(entry,undefined,`Item '${it}' was not found in list of comletions`);
				if (checkOrder) {
					let idx = this.complList!.items.indexOf(entry!);
					assert.equal(idx > lastIdx, true, `Item '${it}' is before item ${items[lastIdx]}`);
					lastIdx = idx;
				}
			}
		})
	})

Given("command 'Toggle warnings for requirements without tests in this file' was issued",
async function (this: Test) {
	this.thatCommand = 'shalldn.toggleTestWarn';
	await vscode.commands.executeCommand(this.thatCommand);
})

When(/renaming with the word "(.+)" is requested for the word "(\w+)" in following text:/,
async function getReferences(this:Test,repl:string, word:string,text:string){
	let range = helpers.getTextPosition(text,word);
	try {
		this.wsEdit = (await vscode.commands.executeCommand(
			'vscode.executeDocumentRenameProvider',
			this.docUri,
			helpers.midRange(range),
			repl
		)) as vscode.WorkspaceEdit;
	}
	catch (e:any) {
		if (e.message != 'No result.')
			throw e;
	}
})

Then(/the list of edits shall include (\d+) in file "(.*)"/,
function(this:Test, ns:string, file:string) {
	if (!this.wsEdit)
		throw 'The test step does not have a list of edits';
	let n:number = parseInt(ns);
	let fileEdits = this.wsEdit.entries().filter(e=>e[0].toString().endsWith(file));
	assert.equal(fileEdits.length,n,`Unexpected number of edits in file ${file}`);
})

Then(/total number of edits shall be (\d+)/,
function(this:Test, ns:string) {
	let n:number = parseInt(ns);
	if (!this.wsEdit)
		assert.equal(0,n,"No edits received");
	else
		assert.equal(this.wsEdit.entries().length,n,`Unexpected number of edits`);
})

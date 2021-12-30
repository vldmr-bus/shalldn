import { Given, When, Then, After, BeforeAll } from "@cucumber/cucumber";
import * as assert from 'assert';
import { runTests } from '@vscode/test-electron';
import { helpers } from './helper';
import * as vscode from 'vscode';
import Test from './test';

BeforeAll(
async function activate() {
	await helpers.activate();
})

After('@discard_changes',
async function dsicardChanges(this:Test){
	await helpers.discardChanges(this);
})

Given(/the test file named \"(.*)\" (?:with requirement id \"([\w\.]+)\"|is opened)/,
async function openFile(this:Test,fileName:string,reqId:string) {
	this.docUri = await helpers.getDocUri(fileName);
	if (!this.docUri)
		assert.fail(`File ${fileName} is not found in workspace`);
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
	text = helpers.expandTextVariables(text,this);
	await helpers.enterText(text);
})

Then(/editor problems shall include problem (?:for the words "([^"]+)" )?with the text:/, 
async function verifyProblem(this:Test, words:string|undefined, text:string){
	text = helpers.expandTextVariables(text, this);
	if (!this.docUri)
		assert.fail('The test step does not have a required document')
	const actualDiagnostics = vscode.languages.getDiagnostics(this.docUri);

	let problem = actualDiagnostics.find(d=>d.message==text);
	assert.notEqual(problem,undefined, `Problem not found with text "${text}"`);
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

	let problem = actualDiagnostics.find(d => d.message == text);
	assert.strictEqual(problem, undefined, `Problem found with text "${text}"`);
})
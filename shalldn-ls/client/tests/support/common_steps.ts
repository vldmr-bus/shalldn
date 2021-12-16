import { Given, When, Then, After } from "@cucumber/cucumber";
import * as assert from 'assert';
import { runTests } from '@vscode/test-electron';
import { helpers } from './helper';
import * as vscode from 'vscode';
import Test from './test';

After('@discard_changes',
async function dsicardChanges(){
	await helpers.discardChanges();
})

Given(/the test file named \"(.*)\" (?:with requirement id \"([\w\.]+)\"|is opened)/,
async function openFile(this:Test,fileName:string,reqId:string) {
	this.docUri = await helpers.getDocUri(fileName);
	if (!this.docUri)
		assert.fail(`File ${fileName} is not found in workspace`);
	this.thatId = reqId;
	await helpers.activate(this.docUri);
})

When("the text below is appended to the end of the file",
async function enterText(this:Test, text:string){
	text = helpers.expandTextVariables(text,this);
	await helpers.enterText(text);
})

Then("editor problems shall include problem with the text:", 
async function verifyProblem(this:Test, text:string){
	text = helpers.expandTextVariables(text, this);
	if (!this.docUri)
		assert.fail('The test step does not have a required document')
	const actualDiagnostics = vscode.languages.getDiagnostics(this.docUri);

	let problem = actualDiagnostics.find(d=>d.message==text);
	assert.notEqual(problem,undefined, `Problem not found with text "${text}"`);
})

When(/list of definitions is obtained for the word "(\w+)" in following text:/,
async function getDefinitions(this:Test,word:string,text:string){
	let range = helpers.getTextPosition(text,word);
	this.locations = (await vscode.commands.executeCommand(
		'vscode.executeDefinitionProvider',
		this.docUri,
		range.start
	)) as vscode.Location[];
})

Then(/the list shall contains definition in file "(.*)"/,
async function checkLocation(this:Test,file:string,text:string) {
	if (!this.locations)
		assert.fail('The test step does not have a list of locations')
	let locations = this.locations.filter(async l=>
		l.uri.toString().endsWith(file) &&
		text == await helpers.getDocText(l)
	);
	assert.equal(locations.length,1,`The file ${file} shall have definition "${text}"`);
})
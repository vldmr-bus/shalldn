import * as vscode from 'vscode';

export default interface Test {
	docUri: vscode.Uri|undefined;
	thatId: string;
	locLinks: (vscode.Location | vscode.LocationLink)[]|undefined;
}
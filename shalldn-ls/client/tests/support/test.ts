import * as vscode from 'vscode';

export default interface Test {
	docUri: vscode.Uri|undefined;
	thatId: string;
	newFile?: boolean;
	locLinks: (vscode.Location | vscode.LocationLink)[]|undefined;
	complList: vscode.CompletionList|undefined;
}
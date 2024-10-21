import * as vscode from 'vscode';

export default interface Test {
	docUri: vscode.Uri|undefined;
	thatId: string;
	newFile?: boolean;
	locLinks: (vscode.Location | vscode.LocationLink)[]|undefined;
	complList: vscode.CompletionList|undefined;
	thatCommand: string|undefined;
	wsEdit: vscode.WorkspaceEdit|undefined;
	skipped?: boolean;
}
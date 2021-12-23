import * as vscode from 'vscode';
import ShalldnTermDef from "./ShalldnTermDef";

export class DictTreeDataProvider implements vscode.TreeDataProvider<ShalldnTermDef> {
	private items: ShalldnTermDef[];

	private _onDidChangeTreeData: vscode.EventEmitter<ShalldnTermDef | undefined | void> = new vscode.EventEmitter<ShalldnTermDef | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<ShalldnTermDef | undefined | void> = this._onDidChangeTreeData.event;

	public setItems(items:ShalldnTermDef[]): void {
		this.items = items;
		this._onDidChangeTreeData.fire();
	}

	async getTreeItem(def: ShalldnTermDef) {
		let item = new DictItem(def);
		let uri = vscode.Uri.parse(def.uri);
		let doc = await vscode.workspace.openTextDocument(uri);
		// doc.getText checks that its argument is instanceof Range
		// and since it comes from server in json, it is actually not, so makenew one
		let range = new vscode.Range(new vscode.Position(def.bodyRange.start.line, def.bodyRange.start.character), new vscode.Position(def.bodyRange.end.line, def.bodyRange.end.character))
		item.tooltip = doc.getText(range);
		return item;
	}

	getChildren(element?: ShalldnTermDef): vscode.ProviderResult<ShalldnTermDef[]> {
		if (!element)
			return this.items;
		return null;
	}
	
}

export class DictItem extends vscode.TreeItem {
	constructor(
		public readonly term: ShalldnTermDef,
	) {
		super(term.subj[0].toUpperCase() + term.subj.substring(1), vscode.TreeItemCollapsibleState.None);
	}
	public tooltip=undefined;
	contextValue = 'dictItem';
	command = {
		command:'shalldn.dict.reveal',
		title: 'Reveal',
		arguments: [this.term]
	};
}
import * as vscode from 'vscode';
import { TagTreeItem } from './tagTreeItem';

export class TagTreeDataProvider implements vscode.TreeDataProvider<string|TagTreeItem> {
	private items: TagTreeItem[];

	private _onDidChangeTreeData: vscode.EventEmitter<TagTreeItem | undefined | void> = new vscode.EventEmitter<TagTreeItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<TagTreeItem | undefined | void> = this._onDidChangeTreeData.event;

	public setItems(items: TagTreeItem[]): void {
		this.items = items;
		this._onDidChangeTreeData.fire();
	}


	getTreeItem(element: string|TagTreeItem) {
		let item = new tagItem(element);
		return item;
	}

	getChildren(element?: TagTreeItem|string) {
		if (!element)
			return this.items;
		if (typeof element == 'string')
			return null;
		return element.items;
	}

}

export class tagItem extends vscode.TreeItem {
	constructor(
		public readonly item: string|TagTreeItem,
	) {
		super((typeof item == 'string') ? item : item.name, (typeof item == 'object') && item.items.length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
	}
	public tooltip=undefined;
	contextValue = (typeof this.item=='string')?'tagItem':'tagContainerItem';
	iconPath = (typeof this.item=='string')?'$(tag)':undefined;
	command = (typeof this.item != 'object')?{
		command:'shalldn.def.reveal',
		title: 'Reveal',
		arguments: [this.item]
	}:undefined;
}
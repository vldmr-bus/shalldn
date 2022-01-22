import { type } from 'os';
import * as vscode from 'vscode';
import {Trees} from '../../shared/lib/trees';

export type TagTreeNode = Trees.NamespaceNode;

export class ContextKey<V> {
	constructor(readonly name: string) { }
	async set(value: V) {
		await vscode.commands.executeCommand('setContext', this.name, value);
	}
	async reset() {
		await vscode.commands.executeCommand('setContext', this.name, undefined);
	}
}


export class TagTreeDataProvider implements vscode.TreeDataProvider<string|TagTreeNode> {
	private readonly _ctxGrouped = new ContextKey<boolean>('shaldnTags.grouped');
	private grouped = true;
	private items: TagTreeNode[];
	private ungroupedItems: TagTreeNode[];

	private _onDidChangeTreeData: vscode.EventEmitter<TagTreeNode | undefined | void> = new vscode.EventEmitter<TagTreeNode | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<TagTreeNode | undefined | void> = this._onDidChangeTreeData.event;

	public setItems(items: TagTreeNode[]): void {
		this._ctxGrouped.set(this.grouped);
		this.items = items;
		this.ungroupedItems = undefined;
		this._onDidChangeTreeData.fire();
	}


	getTreeItem(element: string|TagTreeNode) {
		let item = new TagTreeItem(element);
		return item;
	}

	getChildren(element?: TagTreeNode|string) {
		if (!element)
			if (this.grouped)
				return this.items;
			else {
				if (!this.ungroupedItems)
					this.ungroupedItems = this.items.map(i=>
						(typeof i == 'string')?
						i:
						{id:i.id,leafCount:i.leafCount,children:Trees.getLeafs(i.children).sort()}
					);
				return this.ungroupedItems;
			}
		if (typeof element == 'string')
			return null;
		return element.children;
	}

	getParent(item: TagTreeNode | string) {
		let name = typeof item == 'string' ? item : item.id;
		return Trees.findParent(this.items,name);
	}
	
	public toggleGrouped() {
		this.grouped = !this.grouped;
		this._ctxGrouped.set(this.grouped);
		this._onDidChangeTreeData.fire();
	}
}

function makeLable(item: string | TagTreeNode) {
	let name = (typeof item == 'string') ? item : item.id;
	let label = name.replace(/^[^.]+\./,'');
	if (typeof item != 'string' && item.leafCount)
		label += ` (${item.leafCount})`;
	return label;
}

export class TagTreeItem extends vscode.TreeItem {
	constructor(
		public readonly item: string|TagTreeNode,
	) {
		super(
			makeLable(item),
			(typeof item == 'object') && item.children.length ? 
				vscode.TreeItemCollapsibleState.Expanded : 
				vscode.TreeItemCollapsibleState.None
		);
	}
	public tooltip=undefined;
	contextValue = 
		(typeof this.item=='string')?
			'tagTreeLeaf':
			'tagTreeNode';
	iconPath = (typeof this.item=='string')?'$(tag)':undefined;
	command = 
		(typeof this.item == 'string')?
			{
				command:'shalldn.def.reveal',
				title: 'Reveal',
				arguments: [this.item]
			}:undefined
		;
}
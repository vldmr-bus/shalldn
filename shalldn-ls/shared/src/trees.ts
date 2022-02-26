export namespace Trees {
	export interface TreeNode<T> {
		id: T;
		children: (T | TreeNode<T>)[];
		leafCount?:number;
	}

	export type Tree<T> = (T|TreeNode<T>)[];
	function isTreeItem<T>(t:T|TreeNode<T>): t is TreeNode<T> {
		return (t as TreeNode<T>).children != undefined;
	}

	export function getLeafs<T>(tree: Tree<T>): T[] {
		let result: T[] = [];
		tree.forEach(n => {
			if (isTreeItem(n))
				result.splice(0, 0, ...getLeafs(n.children))
			else
				result.push(n);
		});
		return result;
	}

	export function recurseNodes<T>(item: TreeNode<T>, f: (a: TreeNode<T>) => void) {
		f(item);
		item.children.forEach(i => {
			if (isTreeItem(i))
				recurseNodes<T>(i, f);
		});
	}

	export async function recurseNodesAsync<T>(item: TreeNode<T>,  f: (a:TreeNode<T>) => void) {
		await f(item);
		item.children.forEach(async i => {
			if (isTreeItem(i))
				await recurseNodesAsync<T>(i, f);
		});
	}

	export type NamespaceTree = Tree<string>;
	export type NamespaceNode = string|TreeNode<string>;

	function namespaceNode(s:string, pfx:string):TreeNode<string>|string {
		let parts = s.split('.');
		if (parts.length<2)
			return pfx+s;
		let name = pfx+parts[0];
		let result: TreeNode<string> = { id: name, children: [namespaceNode(parts.slice(1).join('.'),name+'.')]};
		return result;
	}

	function normalizeNodes(nodes:NamespaceTree):NamespaceTree {
		let map:Map<string,NamespaceTree> = new Map();
		nodes.forEach(n=>{
			let name =  (typeof n == 'string')?n:n.id;
			let ns = map.get(name);
			if (!ns)
				map.set(name,ns=[]);
			if (typeof n == 'string')
				ns.push(n);
			else
				ns.splice(ns.length,0,...n.children);
		});
		for (const key of map.keys()) {
			let ns = map.get(key);
			if (ns!.length<2)
				continue;
			let norm = normalizeNodes(ns!);
			map.set(key,norm);
		}
		let result: NamespaceTree = [];
		for (const name of map.keys()) {
			let items = map.get(name)!;
			if (items.length == 1 && typeof items[0] == 'string')
				result.push(items[0]);
			else
				result.push({id: name,children: items});
		}
		return result;
	}

	function compareNamespaceNodes(a: NamespaceNode, b: NamespaceNode):number {
		if (typeof a == 'string') 
			return (typeof b == 'string') ?
				a.toUpperCase().localeCompare(b.toUpperCase()) : -1;
			else
			return (typeof b == 'string') ? 1 :
				a.id.toUpperCase().localeCompare(b.id.toUpperCase())
	}

	export function makeNamespaceTree(items: string[], pfx?: string) {
		pfx = pfx||'';
		let all = normalizeNodes( items.map(i=>namespaceNode(i,pfx!)));
		return all;
	}

	export function flattenTo(res: string[], tree: NamespaceTree, includeLeafs?:boolean) {
		tree.forEach(n => {
			if (typeof n == 'string') {
				if (includeLeafs)
					res.push(n);
				return;
			}
			res.push(n.id+".");
			if (typeof n.children == 'string') {
				if (includeLeafs)
					res.push(n.children);
				return;
			}
			if (n.children.length)
				flattenTo(res,n.children,includeLeafs);
		});
	}

	export function flatten(tree: NamespaceTree, includeLeafs?: boolean): string[] {
		let res:string[] = [];
		flattenTo(res,tree,includeLeafs);
		return res;
	}

	export function sortAndCountNamespaceTree(tree:NamespaceTree) {
		tree.sort(compareNamespaceNodes);
		tree.forEach(n => {
			if (typeof n == 'string')
				return;
			n.leafCount = getLeafs(n.children).length;
			recurseNodes(n, (n) => {
				n.leafCount = getLeafs(n.children).length;
				n.children.sort(compareNamespaceNodes);
			});
		});

	}
	export function findItem(ns: NamespaceTree, name: string): string| TreeNode<string> | undefined {
		let result: string|TreeNode<string> | undefined;
		ns.some(i=> {
			if (typeof i == 'string')
				return result = (i == name)?i:undefined;
			if (i.id == name)
				return result = i;
			if (!name.startsWith(i.id))
				return false;
			return result = findItem(i.children,name);
		});
		return result;
	}

	export function findParent(ns:NamespaceTree, name:string): TreeNode<string>|undefined {
		let parts = name.split('.');
		if (parts.length == 1)
			return undefined;
		parts.pop();
		let result = findItem(ns,parts.join('.'));
		if (typeof result =='string') // for type narrowing
			result = undefined;
		return result;
	}



}
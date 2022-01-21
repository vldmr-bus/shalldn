import { ParserRuleContext, Token } from 'antlr4ts'
import { type } from 'os';
import * as fs from "fs";
import path = require('path');
import { Position, Range } from 'vscode-languageserver-types'

export namespace Util {
	export function rangeOfContext(ctx: ParserRuleContext):Range {
		let stop = ctx.stop||ctx.start;
		return {
			start: { line: ctx.start.line-1, character: ctx.start.charPositionInLine },
			end: { line: stop.line-1, character: stop.charPositionInLine + (stop.text?.length||0) }
		}
	}
	export function startOfContext(ctx: ParserRuleContext): Position {
		return { line: ctx.start.line-1, character: ctx.start.charPositionInLine };
	}
	export function startOfToken(t: Token): Position {
		return { line: t.line-1, character: t.charPositionInLine };
	}
	export function lineRangeOfPos(p: Position):Range {
		return {
			start:{
				line:p.line,
				character:0
			},
			end: {
				line:p.line,
				character:Number.MAX_SAFE_INTEGER
			}
		}
	}
	export function nextLine(range:Range) {
		return {
			start: {
				line: range.end.line+1,
				character: 0
			},
			end: {
				line: range.end.line+1,
				character: Number.MAX_SAFE_INTEGER
			}
		}
	}

	export interface TextRange { text: string, range: Range }

	export function lineFragment(tr:TextRange, pos:number, leftRE:RegExp,rightRE:RegExp)
		:TextRange|null
	{
		let lm = tr.text.substring(0, pos).match(leftRE);
		if (!lm)
			return null;
		let left = lm[1];
		let rm = tr.text.substring(pos).match(rightRE);
		if (!rm)
			return null;
		let text = left + rm[1];
		let range = {...tr.range};
		range.start.character = pos - left.length;
		range.end.character = range.start.character+text.length;
		return {text,range};
	}

	export interface TreeItem<T> {
		name: T;
		items: (T | TreeItem<T>)[];
	}

	export type NamespaceTree = (string | TreeItem<string>)[];

	function namespaceNode(s:string, pfx:string):TreeItem<string>|string {
		let parts = s.split('.');
		if (parts.length<2)
			return pfx+s;
		let name = pfx+parts[0];
		let result: TreeItem<string> = { name, items: [namespaceNode(parts.slice(1).join('.'),name+'.')]};
		return result;
	}

	function normalizeNodes(nodes:NamespaceTree):NamespaceTree {
		let map:Map<string,NamespaceTree> = new Map();
		nodes.forEach(n=>{
			let name =  (typeof n == 'string')?n:n.name;
			let ns = map.get(name);
			if (!ns)
				map.set(name,ns=[]);
			if (typeof n == 'string')
				ns.push(n);
			else
				ns.splice(ns.length,0,...n.items);
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
				result.push({name,items});
		}
		return result;
	}

	export function makeNamespaceTree(items:string[]) {
		let all = normalizeNodes( items.map(i=>namespaceNode(i,'')));
		return all;
	}

	export function findFiles(dir:string, filter:RegExp, cb:(f:string)=>void) {
	var files = fs.readdirSync(dir);
	for (var i = 0; i < files.length; i++) {
		var fpath = path.join(dir, files[i]);
		var stat = fs.lstatSync(fpath);
		if (stat.isDirectory()) {
			findFiles(fpath,filter,cb);
		}
		else if (filter.test(fpath))
			cb(fpath);
	};
}


}
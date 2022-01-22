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
import { ParserRuleContext, Token } from 'antlr4ts'
import { Position, Range } from 'vscode-languageserver-types'

export namespace Util {
	export function rangeOfContext(ctx: ParserRuleContext):Range {
		let stop = ctx.stop||ctx.start;
		return {
			start: { line: ctx.start.line, character: ctx.start.charPositionInLine },
			end: { line: stop.line, character: stop.charPositionInLine + (stop.text?.length||0) }
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
}
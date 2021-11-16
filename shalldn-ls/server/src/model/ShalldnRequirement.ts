import { Position, Range } from 'vscode-languageserver-types';
import { RequirementContext } from '../antlr/shalldnParser';
import { Util } from '../util';
import ShalldnDoc from './ShalldnDoc';

export default class ShalldnRequirement {
	public id:string;
	public range: Range;
	public preRange: Range;
	constructor (
		private doc: ShalldnDoc,
		private ctx: RequirementContext
	){
		this.id=ctx.BOLDED_ID().text.replace(/^\*+|\*+$/gm,'');
		this.range = Util.rangeOfContext(ctx);
		this.preRange = {
			start:Util.startOfContext(ctx._pre),
			end:Util.startOfToken(ctx.SHALL()._symbol)
		}
	}
	public get pre():string {
		return this.doc.textat(this.preRange);
	}
}
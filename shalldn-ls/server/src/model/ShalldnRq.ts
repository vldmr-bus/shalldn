import { Position, Range } from 'vscode-languageserver-types';
import { RequirementContext } from '../antlr/shalldnParser';
import { Util } from '../util';
import ShalldnDoc from './ShalldnDoc';

export default class ShalldnRq {
	public id:string;
	public range: Range;
	public preRange: Range;
	constructor (
		private doc: ShalldnDoc,
		private ctx: RequirementContext
	){
		this.id=ctx.bolded_id().IDENTIFIER()?.text||"";
		this.range = Util.rangeOfContext(ctx);
		this.preRange = {
			start:Util.startOfContext(ctx._pre),
			end:Util.startOfToken(ctx.SHALL()._symbol)
		}
		if (!this.id)
			throw `Requirement without identifier`;
	}
	public get pre():string {
		return this.doc.textat(this.preRange);
	}
}
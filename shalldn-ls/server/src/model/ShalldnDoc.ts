import { RecognitionException } from 'antlr4ts';
import {  Range } from 'vscode-languageserver-types';
import {
	TextDocument
} from 'vscode-languageserver-textdocument';
import { RequirementContext, TitleContext } from '../antlr/shalldnParser';
import ShalldnRequirement from './ShalldnRequirement';

export default class ShalldnDoc {
	private title: TitleContext = null as any;
	//private requirements:{[key:string]:ShalldnRequirement}={};
	private rqmap = new Map<string, ShalldnRequirement>();
	constructor (
		private textDocument: TextDocument
	) {}

	public get requirements(): IterableIterator<ShalldnRequirement> {
		return this.rqmap.values();
	}

	public addRequirement(ctx: RequirementContext) {
		let rq = new ShalldnRequirement(this, ctx)
		// $$Implements Parser.ERR_DUP_RQ_ID
		if (this.rqmap.has(rq.id))
			throw `Requirement with id ${rq.id} already exists`;
		this.rqmap.set(rq.id,rq);
	}

	public setTitle(ctx: TitleContext) {
		this.title = ctx;
	}

	public get subject() {
		let title = this.title && this.title?._subject?.text;
		return title && title.replace(/^\*+|\*+$/gm, '') || null;
	}

	public textat(r: Range):string {
		return this.textDocument.getText(r);
	}
	
}
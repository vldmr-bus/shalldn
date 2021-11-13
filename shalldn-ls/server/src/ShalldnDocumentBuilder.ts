import { RecognitionException } from 'antlr4ts';
import { shalldnListener } from './antlr/shalldnListener';
import { RequirementContext, shalldnParser, TitleContext } from './antlr/shalldnParser';
import ShalldnDoc from './model/ShalldnDoc';

export default class ShalldnDocumentBuilder implements shalldnListener {
	constructor(
		private document:ShalldnDoc,
		private parser: shalldnParser
	) {}

	enterRequirement(ctx: RequirementContext) {
		try {
			this.document.addRequirement(ctx);
		} catch (e: any) {
			this.parser.notifyErrorListeners(e,ctx.start,undefined);
		}
	}

	enterTitle(ctx:TitleContext) {
		this.document.setTitle(ctx);
	}
}
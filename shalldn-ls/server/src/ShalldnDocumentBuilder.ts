import { Diagnostic } from 'vscode-languageserver-types';
import { shalldnListener } from './antlr/shalldnListener';
import { RequirementContext, TitleContext } from './antlr/shalldnParser';
import ShalldnDoc from './model/ShalldnDoc';

export default class ShalldnDocumentBuilder implements shalldnListener {
	constructor(
		private document:ShalldnDoc
	) {}

	enterRequirement(ctx: RequirementContext) {
		this.document.addRequirement(ctx);
	}

	enterTitle(ctx:TitleContext) {
		this.document.setTitle(ctx);
	}
}
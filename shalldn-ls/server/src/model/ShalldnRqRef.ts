import { Range } from 'vscode-languageserver-types';

export enum RefKind {
	Implementation,
	Test
}

export default interface ShalldnRqRef {
	id:string;
	tgtRange: Range;
	clauseRange: Range;
	uri: string;
	kind: RefKind;
}
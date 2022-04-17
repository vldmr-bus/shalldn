import { Range } from 'vscode-languageserver-types';

export enum RefKind {
	Implementation,
	Test
}

export default interface ShalldnRqRef {
	id:string;
	idRange: Range;
	tgtRange?: Range;
	clauseRange: Range;
	uri: string;
	kind: RefKind;
}
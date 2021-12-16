import { Range } from 'vscode-languageserver-types';

export default interface ShalldnRqRef {
	id:string;
	tgtRange: Range;
	clauseRange: Range;
	uri: string;
}
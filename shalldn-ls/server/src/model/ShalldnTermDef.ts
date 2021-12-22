import { Range } from 'vscode-languageserver-types';

export default interface ShalldnTermDef {
	subj: string;
	range: Range;
	bodyRange: Range;
	uri: string;
}
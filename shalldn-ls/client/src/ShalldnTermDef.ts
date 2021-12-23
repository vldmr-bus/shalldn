import { Range } from 'vscode';

export default interface ShalldnTermDef {
	subj: string;
	range: Range;
	bodyRange: Range;
	uri: string;
}
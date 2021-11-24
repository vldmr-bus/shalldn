import { Range } from 'vscode-languageserver-types';

export default interface ShalldnRqDef {
	id:string;
	range: Range;
	uri: string;
}
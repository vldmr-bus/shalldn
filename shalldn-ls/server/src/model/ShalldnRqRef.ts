import { Range } from 'vscode-languageserver-types';

export default interface ShalldnRqRef {
	id:string;
	range: Range;
	uri: string;
}
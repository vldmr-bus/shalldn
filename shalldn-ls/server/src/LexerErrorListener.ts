import { ANTLRErrorListener, RecognitionException, Recognizer } from 'antlr4ts';
import { Diagnostics, ShalldnDiagnostic } from './Diagnostics';

export default class LexerErrorListener implements ANTLRErrorListener<number> {
	constructor(
		private uri:string,
		private sink: (diag:ShalldnDiagnostic)=>void
	){}

	syntaxError<T>(recognizer: Recognizer<T, any>, offendingSymbol: T | undefined, line: number, charPositionInLine: number, msg: string, e: RecognitionException | undefined): void {
		const diagnostic = Diagnostics.error(msg,
			{ line, character: charPositionInLine },
			{ line, character: charPositionInLine }
		);
		if (this.uri && e !== undefined)
			diagnostic.addRelated(e.message,this.uri);
		this.sink(diagnostic);
	}
}


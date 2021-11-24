import { ParserErrorListener, RecognitionException, Recognizer, Token } from 'antlr4ts';
import { Diagnostics } from './Diagnostics';

export default class ParseErrorListener implements ParserErrorListener {
	constructor(
		private uri:string,
		private sink: (diag:Diagnostics.ShalldnDiagnostic)=>void
	){}

	syntaxError<T extends Token>(recognizer: Recognizer<T, any>, offendingSymbol: T | undefined, line: number, charPositionInLine: number, msg: string, e: RecognitionException | undefined): void {
		line = line - 1;
		const diagnostic = Diagnostics.error(msg,
			{ line, character: charPositionInLine },
			{ line, character: charPositionInLine + (offendingSymbol?.text?.length || 0) }
		);
		if (this.uri && e !== undefined)
			diagnostic.addRelated(e.message, this.uri);
		this.sink(diagnostic);
	}
}

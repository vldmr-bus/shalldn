import { ANTLRErrorListener, ATNConfigSet, ATNSimulator, BitSet, DFA, Parser, RecognitionException, Recognizer, Token } from 'antlr4ng';
import { Diagnostics, ShalldnDiagnostic } from './Diagnostics';

export default class LexerErrorListener implements ANTLRErrorListener {
	constructor(
		private uri:string,
		private sink: (diag:ShalldnDiagnostic)=>void
	){}
	reportAmbiguity(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number, exact: boolean, ambigAlts: BitSet | undefined, configs: ATNConfigSet): void {
	}
	reportAttemptingFullContext(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number, conflictingAlts: BitSet | undefined, configs: ATNConfigSet): void {
	}
	reportContextSensitivity(recognizer: Parser, dfa: DFA, startIndex: number, stopIndex: number, prediction: number, configs: ATNConfigSet): void {
	}

	syntaxError<S extends Token, T extends ATNSimulator>(recognizer: Recognizer<T>, offendingSymbol: S | null, line: number, charPositionInLine: number, msg: string, e: RecognitionException | null): void {
		const diagnostic = Diagnostics.error(msg,
			{ line, character: charPositionInLine },
			{ line, character: charPositionInLine }
		);
		if (this.uri && e !== undefined)
			diagnostic.addRelated(e?.message??"No message reported",this.uri);
		this.sink(diagnostic);
	}
}


import { ATNConfigSet, ATNSimulator, BaseErrorListener, BitSet, DFA, Parser, RecognitionException, Recognizer, Token } from 'antlr4ng';
import { Diagnostics, ShalldnDiagnostic } from './Diagnostics';
import * as l10n from "@vscode/l10n";

export default class ParseErrorListener implements BaseErrorListener {
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
		line = line - 1;
		const diagnostic = Diagnostics.error(l10n.t("Syntax error"),
			{ line, character: charPositionInLine },
			{ line, character: charPositionInLine + (offendingSymbol?.text?.length || 0) }
		);
		if (this.uri && e !== undefined)
			diagnostic.addRelated(e?.message??"No message reported", this.uri);
		this.sink(diagnostic);
	}
}

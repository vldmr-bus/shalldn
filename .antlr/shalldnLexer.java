// Generated from c:\dev\shalldn\shalldn.g4 by ANTLR 4.8
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class shalldnLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.8", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, WHITESPACE=7, STAR=8, 
		MINUS=9, UL=10, HASH=11, CAP_WORD=12, QUOTED_FRAGMENT=13, WORD=14, IDENTIFIER=15, 
		SENTENCE_STOP=16, PUNCTUATION=17, SHALL=18, NB=19, BOLDED_ID=20;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE"
	};

	private static String[] makeRuleNames() {
		return new String[] {
			"T__0", "T__1", "T__2", "T__3", "T__4", "T__5", "WHITESPACE", "WORD_CHAR", 
			"CAPITAL_CHAR", "STAR", "MINUS", "UL", "HASH", "CAP_WORD", "QUOTED_FRAGMENT", 
			"WORD", "IDENTIFIER", "SENTENCE_STOP", "PUNCTUATION", "SHALL", "NB", 
			"BOLDED_ID"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'*(i.e.'", "')*'", "'*('", "'\n'", "'Implements'", "'.\n'", null, 
			"'*'", "'-'", "'_'", "'#'", null, null, null, null, null, null, null, 
			"'*(n.b.)*'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, null, null, null, null, null, null, "WHITESPACE", "STAR", "MINUS", 
			"UL", "HASH", "CAP_WORD", "QUOTED_FRAGMENT", "WORD", "IDENTIFIER", "SENTENCE_STOP", 
			"PUNCTUATION", "SHALL", "NB", "BOLDED_ID"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}


	public shalldnLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "shalldn.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\26\u00b5\b\1\4\2"+
		"\t\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4"+
		"\13\t\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22"+
		"\t\22\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\3\2\3\2\3\2\3"+
		"\2\3\2\3\2\3\2\3\3\3\3\3\3\3\4\3\4\3\4\3\5\3\5\3\6\3\6\3\6\3\6\3\6\3\6"+
		"\3\6\3\6\3\6\3\6\3\6\3\7\3\7\3\7\3\b\6\bN\n\b\r\b\16\bO\3\b\3\b\3\t\3"+
		"\t\3\n\3\n\3\13\3\13\3\f\3\f\3\r\3\r\3\16\3\16\3\17\3\17\7\17b\n\17\f"+
		"\17\16\17e\13\17\3\20\3\20\6\20i\n\20\r\20\16\20j\3\20\3\20\3\20\6\20"+
		"p\n\20\r\20\16\20q\3\20\5\20u\n\20\3\21\6\21x\n\21\r\21\16\21y\3\22\3"+
		"\22\3\22\6\22\177\n\22\r\22\16\22\u0080\3\23\3\23\3\24\3\24\3\25\3\25"+
		"\3\25\3\25\3\25\3\25\3\25\3\25\3\25\3\25\3\25\3\25\3\25\3\25\3\25\3\25"+
		"\3\25\3\25\3\25\3\25\3\25\3\25\5\25\u009d\n\25\3\26\3\26\3\26\3\26\3\26"+
		"\3\26\3\26\3\26\3\26\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27"+
		"\3\27\3\27\5\27\u00b4\n\27\3O\2\30\3\3\5\4\7\5\t\6\13\7\r\b\17\t\21\2"+
		"\23\2\25\n\27\13\31\f\33\r\35\16\37\17!\20#\21%\22\'\23)\24+\25-\26\3"+
		"\2\7\5\2\13\13\17\17\"\"\6\2\62;C\\aac|\3\2C\\\5\2##\60\60==\5\2*+./a"+
		"a\2\u00bb\2\3\3\2\2\2\2\5\3\2\2\2\2\7\3\2\2\2\2\t\3\2\2\2\2\13\3\2\2\2"+
		"\2\r\3\2\2\2\2\17\3\2\2\2\2\25\3\2\2\2\2\27\3\2\2\2\2\31\3\2\2\2\2\33"+
		"\3\2\2\2\2\35\3\2\2\2\2\37\3\2\2\2\2!\3\2\2\2\2#\3\2\2\2\2%\3\2\2\2\2"+
		"\'\3\2\2\2\2)\3\2\2\2\2+\3\2\2\2\2-\3\2\2\2\3/\3\2\2\2\5\66\3\2\2\2\7"+
		"9\3\2\2\2\t<\3\2\2\2\13>\3\2\2\2\rI\3\2\2\2\17M\3\2\2\2\21S\3\2\2\2\23"+
		"U\3\2\2\2\25W\3\2\2\2\27Y\3\2\2\2\31[\3\2\2\2\33]\3\2\2\2\35_\3\2\2\2"+
		"\37t\3\2\2\2!w\3\2\2\2#{\3\2\2\2%\u0082\3\2\2\2\'\u0084\3\2\2\2)\u009c"+
		"\3\2\2\2+\u009e\3\2\2\2-\u00b3\3\2\2\2/\60\7,\2\2\60\61\7*\2\2\61\62\7"+
		"k\2\2\62\63\7\60\2\2\63\64\7g\2\2\64\65\7\60\2\2\65\4\3\2\2\2\66\67\7"+
		"+\2\2\678\7,\2\28\6\3\2\2\29:\7,\2\2:;\7*\2\2;\b\3\2\2\2<=\7\f\2\2=\n"+
		"\3\2\2\2>?\7K\2\2?@\7o\2\2@A\7r\2\2AB\7n\2\2BC\7g\2\2CD\7o\2\2DE\7g\2"+
		"\2EF\7p\2\2FG\7v\2\2GH\7u\2\2H\f\3\2\2\2IJ\7\60\2\2JK\7\f\2\2K\16\3\2"+
		"\2\2LN\t\2\2\2ML\3\2\2\2NO\3\2\2\2OP\3\2\2\2OM\3\2\2\2PQ\3\2\2\2QR\b\b"+
		"\2\2R\20\3\2\2\2ST\t\3\2\2T\22\3\2\2\2UV\t\4\2\2V\24\3\2\2\2WX\7,\2\2"+
		"X\26\3\2\2\2YZ\7/\2\2Z\30\3\2\2\2[\\\7a\2\2\\\32\3\2\2\2]^\7%\2\2^\34"+
		"\3\2\2\2_c\5\23\n\2`b\5\21\t\2a`\3\2\2\2be\3\2\2\2ca\3\2\2\2cd\3\2\2\2"+
		"d\36\3\2\2\2ec\3\2\2\2fh\7$\2\2gi\13\2\2\2hg\3\2\2\2ij\3\2\2\2jh\3\2\2"+
		"\2jk\3\2\2\2kl\3\2\2\2lu\7$\2\2mo\7)\2\2np\13\2\2\2on\3\2\2\2pq\3\2\2"+
		"\2qo\3\2\2\2qr\3\2\2\2rs\3\2\2\2su\7)\2\2tf\3\2\2\2tm\3\2\2\2u \3\2\2"+
		"\2vx\5\21\t\2wv\3\2\2\2xy\3\2\2\2yw\3\2\2\2yz\3\2\2\2z\"\3\2\2\2{~\5!"+
		"\21\2|}\7\60\2\2}\177\5!\21\2~|\3\2\2\2\177\u0080\3\2\2\2\u0080~\3\2\2"+
		"\2\u0080\u0081\3\2\2\2\u0081$\3\2\2\2\u0082\u0083\t\5\2\2\u0083&\3\2\2"+
		"\2\u0084\u0085\t\6\2\2\u0085(\3\2\2\2\u0086\u0087\5\25\13\2\u0087\u0088"+
		"\5\25\13\2\u0088\u0089\7u\2\2\u0089\u008a\7j\2\2\u008a\u008b\7c\2\2\u008b"+
		"\u008c\7n\2\2\u008c\u008d\7n\2\2\u008d\u008e\3\2\2\2\u008e\u008f\5\25"+
		"\13\2\u008f\u0090\5\25\13\2\u0090\u009d\3\2\2\2\u0091\u0092\5\31\r\2\u0092"+
		"\u0093\5\31\r\2\u0093\u0094\7u\2\2\u0094\u0095\7j\2\2\u0095\u0096\7c\2"+
		"\2\u0096\u0097\7n\2\2\u0097\u0098\7n\2\2\u0098\u0099\3\2\2\2\u0099\u009a"+
		"\5\31\r\2\u009a\u009b\5\31\r\2\u009b\u009d\3\2\2\2\u009c\u0086\3\2\2\2"+
		"\u009c\u0091\3\2\2\2\u009d*\3\2\2\2\u009e\u009f\7,\2\2\u009f\u00a0\7*"+
		"\2\2\u00a0\u00a1\7p\2\2\u00a1\u00a2\7\60\2\2\u00a2\u00a3\7d\2\2\u00a3"+
		"\u00a4\7\60\2\2\u00a4\u00a5\7+\2\2\u00a5\u00a6\7,\2\2\u00a6,\3\2\2\2\u00a7"+
		"\u00a8\5\25\13\2\u00a8\u00a9\5\25\13\2\u00a9\u00aa\5#\22\2\u00aa\u00ab"+
		"\5\25\13\2\u00ab\u00ac\5\25\13\2\u00ac\u00b4\3\2\2\2\u00ad\u00ae\5\31"+
		"\r\2\u00ae\u00af\5\31\r\2\u00af\u00b0\5#\22\2\u00b0\u00b1\5\31\r\2\u00b1"+
		"\u00b2\5\31\r\2\u00b2\u00b4\3\2\2\2\u00b3\u00a7\3\2\2\2\u00b3\u00ad\3"+
		"\2\2\2\u00b4.\3\2\2\2\f\2Ocjqty\u0080\u009c\u00b3\3\b\2\2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}
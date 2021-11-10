// Generated from c:\dev\shalldn\shalldn.g4 by ANTLR 4.8
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class shalldnParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.8", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, WHITESPACE=7, STAR=8, 
		MINUS=9, UL=10, HASH=11, CAP_WORD=12, QUOTED_FRAGMENT=13, WORD=14, IDENTIFIER=15, 
		SENTENCE_STOP=16, PUNCTUATION=17, SHALL=18, NB=19, BOLDED_ID=20;
	public static final int
		RULE_word = 0, RULE_plain_phrase = 1, RULE_italiced_phrase = 2, RULE_nota_bene = 3, 
		RULE_bolded_phrase = 4, RULE_def_drct = 5, RULE_def_rev = 6, RULE_phrase = 7, 
		RULE_title = 8, RULE_heading = 9, RULE_implmnt_ind = 10, RULE_ul_element = 11, 
		RULE_ul = 12, RULE_sentence = 13, RULE_requirement = 14, RULE_document = 15;
	private static String[] makeRuleNames() {
		return new String[] {
			"word", "plain_phrase", "italiced_phrase", "nota_bene", "bolded_phrase", 
			"def_drct", "def_rev", "phrase", "title", "heading", "implmnt_ind", "ul_element", 
			"ul", "sentence", "requirement", "document"
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

	@Override
	public String getGrammarFileName() { return "shalldn.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public shalldnParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	public static class WordContext extends ParserRuleContext {
		public TerminalNode WORD() { return getToken(shalldnParser.WORD, 0); }
		public TerminalNode CAP_WORD() { return getToken(shalldnParser.CAP_WORD, 0); }
		public WordContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_word; }
	}

	public final WordContext word() throws RecognitionException {
		WordContext _localctx = new WordContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_word);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(32);
			_la = _input.LA(1);
			if ( !(_la==CAP_WORD || _la==WORD) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Plain_phraseContext extends ParserRuleContext {
		public List<WordContext> word() {
			return getRuleContexts(WordContext.class);
		}
		public WordContext word(int i) {
			return getRuleContext(WordContext.class,i);
		}
		public List<TerminalNode> QUOTED_FRAGMENT() { return getTokens(shalldnParser.QUOTED_FRAGMENT); }
		public TerminalNode QUOTED_FRAGMENT(int i) {
			return getToken(shalldnParser.QUOTED_FRAGMENT, i);
		}
		public List<TerminalNode> PUNCTUATION() { return getTokens(shalldnParser.PUNCTUATION); }
		public TerminalNode PUNCTUATION(int i) {
			return getToken(shalldnParser.PUNCTUATION, i);
		}
		public Plain_phraseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_plain_phrase; }
	}

	public final Plain_phraseContext plain_phrase() throws RecognitionException {
		Plain_phraseContext _localctx = new Plain_phraseContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_plain_phrase);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(34);
			word();
			setState(40);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,1,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					setState(38);
					_errHandler.sync(this);
					switch (_input.LA(1)) {
					case CAP_WORD:
					case WORD:
						{
						setState(35);
						word();
						}
						break;
					case QUOTED_FRAGMENT:
						{
						setState(36);
						match(QUOTED_FRAGMENT);
						}
						break;
					case PUNCTUATION:
						{
						setState(37);
						match(PUNCTUATION);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					} 
				}
				setState(42);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,1,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Italiced_phraseContext extends ParserRuleContext {
		public List<TerminalNode> STAR() { return getTokens(shalldnParser.STAR); }
		public TerminalNode STAR(int i) {
			return getToken(shalldnParser.STAR, i);
		}
		public Plain_phraseContext plain_phrase() {
			return getRuleContext(Plain_phraseContext.class,0);
		}
		public List<TerminalNode> HASH() { return getTokens(shalldnParser.HASH); }
		public TerminalNode HASH(int i) {
			return getToken(shalldnParser.HASH, i);
		}
		public Italiced_phraseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_italiced_phrase; }
	}

	public final Italiced_phraseContext italiced_phrase() throws RecognitionException {
		Italiced_phraseContext _localctx = new Italiced_phraseContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_italiced_phrase);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(51);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case STAR:
				{
				setState(43);
				match(STAR);
				setState(44);
				plain_phrase();
				setState(45);
				match(STAR);
				}
				break;
			case HASH:
				{
				setState(47);
				match(HASH);
				setState(48);
				plain_phrase();
				setState(49);
				match(HASH);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Nota_beneContext extends ParserRuleContext {
		public Italiced_phraseContext italiced_phrase() {
			return getRuleContext(Italiced_phraseContext.class,0);
		}
		public TerminalNode NB() { return getToken(shalldnParser.NB, 0); }
		public Nota_beneContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_nota_bene; }
	}

	public final Nota_beneContext nota_bene() throws RecognitionException {
		Nota_beneContext _localctx = new Nota_beneContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_nota_bene);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(53);
			italiced_phrase();
			setState(54);
			match(NB);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Bolded_phraseContext extends ParserRuleContext {
		public List<TerminalNode> STAR() { return getTokens(shalldnParser.STAR); }
		public TerminalNode STAR(int i) {
			return getToken(shalldnParser.STAR, i);
		}
		public Plain_phraseContext plain_phrase() {
			return getRuleContext(Plain_phraseContext.class,0);
		}
		public List<TerminalNode> HASH() { return getTokens(shalldnParser.HASH); }
		public TerminalNode HASH(int i) {
			return getToken(shalldnParser.HASH, i);
		}
		public Bolded_phraseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_bolded_phrase; }
	}

	public final Bolded_phraseContext bolded_phrase() throws RecognitionException {
		Bolded_phraseContext _localctx = new Bolded_phraseContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_bolded_phrase);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(68);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case STAR:
				{
				setState(56);
				match(STAR);
				setState(57);
				match(STAR);
				setState(58);
				plain_phrase();
				setState(59);
				match(STAR);
				setState(60);
				match(STAR);
				}
				break;
			case HASH:
				{
				setState(62);
				match(HASH);
				setState(63);
				match(HASH);
				setState(64);
				plain_phrase();
				setState(65);
				match(HASH);
				setState(66);
				match(HASH);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Def_drctContext extends ParserRuleContext {
		public Italiced_phraseContext subject;
		public PhraseContext body;
		public Italiced_phraseContext italiced_phrase() {
			return getRuleContext(Italiced_phraseContext.class,0);
		}
		public PhraseContext phrase() {
			return getRuleContext(PhraseContext.class,0);
		}
		public Def_drctContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_def_drct; }
	}

	public final Def_drctContext def_drct() throws RecognitionException {
		Def_drctContext _localctx = new Def_drctContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_def_drct);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(70);
			((Def_drctContext)_localctx).subject = italiced_phrase();
			setState(71);
			match(T__0);
			setState(72);
			((Def_drctContext)_localctx).body = phrase();
			setState(73);
			match(T__1);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Def_revContext extends ParserRuleContext {
		public Italiced_phraseContext body;
		public PhraseContext subject;
		public Italiced_phraseContext italiced_phrase() {
			return getRuleContext(Italiced_phraseContext.class,0);
		}
		public PhraseContext phrase() {
			return getRuleContext(PhraseContext.class,0);
		}
		public Def_revContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_def_rev; }
	}

	public final Def_revContext def_rev() throws RecognitionException {
		Def_revContext _localctx = new Def_revContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_def_rev);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(75);
			((Def_revContext)_localctx).body = italiced_phrase();
			setState(76);
			match(T__2);
			setState(77);
			((Def_revContext)_localctx).subject = phrase();
			setState(78);
			match(T__1);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PhraseContext extends ParserRuleContext {
		public List<Plain_phraseContext> plain_phrase() {
			return getRuleContexts(Plain_phraseContext.class);
		}
		public Plain_phraseContext plain_phrase(int i) {
			return getRuleContext(Plain_phraseContext.class,i);
		}
		public List<Italiced_phraseContext> italiced_phrase() {
			return getRuleContexts(Italiced_phraseContext.class);
		}
		public Italiced_phraseContext italiced_phrase(int i) {
			return getRuleContext(Italiced_phraseContext.class,i);
		}
		public List<Bolded_phraseContext> bolded_phrase() {
			return getRuleContexts(Bolded_phraseContext.class);
		}
		public Bolded_phraseContext bolded_phrase(int i) {
			return getRuleContext(Bolded_phraseContext.class,i);
		}
		public List<Nota_beneContext> nota_bene() {
			return getRuleContexts(Nota_beneContext.class);
		}
		public Nota_beneContext nota_bene(int i) {
			return getRuleContext(Nota_beneContext.class,i);
		}
		public List<Def_drctContext> def_drct() {
			return getRuleContexts(Def_drctContext.class);
		}
		public Def_drctContext def_drct(int i) {
			return getRuleContext(Def_drctContext.class,i);
		}
		public List<Def_revContext> def_rev() {
			return getRuleContexts(Def_revContext.class);
		}
		public Def_revContext def_rev(int i) {
			return getRuleContext(Def_revContext.class,i);
		}
		public PhraseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_phrase; }
	}

	public final PhraseContext phrase() throws RecognitionException {
		PhraseContext _localctx = new PhraseContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_phrase);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(86); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					setState(86);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,4,_ctx) ) {
					case 1:
						{
						setState(80);
						plain_phrase();
						}
						break;
					case 2:
						{
						setState(81);
						italiced_phrase();
						}
						break;
					case 3:
						{
						setState(82);
						bolded_phrase();
						}
						break;
					case 4:
						{
						setState(83);
						nota_bene();
						}
						break;
					case 5:
						{
						setState(84);
						def_drct();
						}
						break;
					case 6:
						{
						setState(85);
						def_rev();
						}
						break;
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(88); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,5,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class TitleContext extends ParserRuleContext {
		public Italiced_phraseContext subject;
		public TerminalNode HASH() { return getToken(shalldnParser.HASH, 0); }
		public TerminalNode CAP_WORD() { return getToken(shalldnParser.CAP_WORD, 0); }
		public Italiced_phraseContext italiced_phrase() {
			return getRuleContext(Italiced_phraseContext.class,0);
		}
		public List<WordContext> word() {
			return getRuleContexts(WordContext.class);
		}
		public WordContext word(int i) {
			return getRuleContext(WordContext.class,i);
		}
		public TitleContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_title; }
	}

	public final TitleContext title() throws RecognitionException {
		TitleContext _localctx = new TitleContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_title);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(90);
			match(HASH);
			setState(91);
			match(CAP_WORD);
			setState(95);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==CAP_WORD || _la==WORD) {
				{
				{
				setState(92);
				word();
				}
				}
				setState(97);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(98);
			((TitleContext)_localctx).subject = italiced_phrase();
			setState(102);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,7,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(99);
					word();
					}
					} 
				}
				setState(104);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,7,_ctx);
			}
			setState(106);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,8,_ctx) ) {
			case 1:
				{
				setState(105);
				_la = _input.LA(1);
				if ( _la <= 0 || (_la==T__3) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class HeadingContext extends ParserRuleContext {
		public PhraseContext phrase() {
			return getRuleContext(PhraseContext.class,0);
		}
		public List<TerminalNode> HASH() { return getTokens(shalldnParser.HASH); }
		public TerminalNode HASH(int i) {
			return getToken(shalldnParser.HASH, i);
		}
		public HeadingContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_heading; }
	}

	public final HeadingContext heading() throws RecognitionException {
		HeadingContext _localctx = new HeadingContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_heading);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(111);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__3) {
				{
				{
				setState(108);
				match(T__3);
				}
				}
				setState(113);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			{
			setState(115); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(114);
					match(HASH);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(117); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,10,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			}
			setState(119);
			phrase();
			setState(120);
			match(T__3);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Implmnt_indContext extends ParserRuleContext {
		public Bolded_phraseContext id;
		public Bolded_phraseContext bolded_phrase() {
			return getRuleContext(Bolded_phraseContext.class,0);
		}
		public List<TerminalNode> STAR() { return getTokens(shalldnParser.STAR); }
		public TerminalNode STAR(int i) {
			return getToken(shalldnParser.STAR, i);
		}
		public List<Plain_phraseContext> plain_phrase() {
			return getRuleContexts(Plain_phraseContext.class);
		}
		public Plain_phraseContext plain_phrase(int i) {
			return getRuleContext(Plain_phraseContext.class,i);
		}
		public TerminalNode SENTENCE_STOP() { return getToken(shalldnParser.SENTENCE_STOP, 0); }
		public Implmnt_indContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_implmnt_ind; }
	}

	public final Implmnt_indContext implmnt_ind() throws RecognitionException {
		Implmnt_indContext _localctx = new Implmnt_indContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_implmnt_ind);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(123); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(122);
				match(T__3);
				}
				}
				setState(125); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==T__3 );
			setState(128); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(127);
				match(STAR);
				}
				}
				setState(130); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==STAR );
			setState(132);
			match(T__4);
			setState(134);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==CAP_WORD || _la==WORD) {
				{
				setState(133);
				plain_phrase();
				}
			}

			setState(136);
			((Implmnt_indContext)_localctx).id = bolded_phrase();
			setState(138);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,14,_ctx) ) {
			case 1:
				{
				setState(137);
				plain_phrase();
				}
				break;
			}
			setState(141);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==SENTENCE_STOP) {
				{
				setState(140);
				match(SENTENCE_STOP);
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Ul_elementContext extends ParserRuleContext {
		public PhraseContext phrase() {
			return getRuleContext(PhraseContext.class,0);
		}
		public List<TerminalNode> STAR() { return getTokens(shalldnParser.STAR); }
		public TerminalNode STAR(int i) {
			return getToken(shalldnParser.STAR, i);
		}
		public TerminalNode SENTENCE_STOP() { return getToken(shalldnParser.SENTENCE_STOP, 0); }
		public Ul_elementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_ul_element; }
	}

	public final Ul_elementContext ul_element() throws RecognitionException {
		Ul_elementContext _localctx = new Ul_elementContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_ul_element);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(144); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(143);
				match(T__3);
				}
				}
				setState(146); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==T__3 );
			setState(149); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(148);
					match(STAR);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(151); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,17,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			setState(153);
			phrase();
			setState(155);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==SENTENCE_STOP) {
				{
				setState(154);
				match(SENTENCE_STOP);
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class UlContext extends ParserRuleContext {
		public List<Ul_elementContext> ul_element() {
			return getRuleContexts(Ul_elementContext.class);
		}
		public Ul_elementContext ul_element(int i) {
			return getRuleContext(Ul_elementContext.class,i);
		}
		public List<Implmnt_indContext> implmnt_ind() {
			return getRuleContexts(Implmnt_indContext.class);
		}
		public Implmnt_indContext implmnt_ind(int i) {
			return getRuleContext(Implmnt_indContext.class,i);
		}
		public UlContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_ul; }
	}

	public final UlContext ul() throws RecognitionException {
		UlContext _localctx = new UlContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_ul);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(159); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					setState(159);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,19,_ctx) ) {
					case 1:
						{
						setState(157);
						ul_element();
						}
						break;
					case 2:
						{
						setState(158);
						implmnt_ind();
						}
						break;
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(161); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,20,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SentenceContext extends ParserRuleContext {
		public TerminalNode CAP_WORD() { return getToken(shalldnParser.CAP_WORD, 0); }
		public TerminalNode SENTENCE_STOP() { return getToken(shalldnParser.SENTENCE_STOP, 0); }
		public List<PhraseContext> phrase() {
			return getRuleContexts(PhraseContext.class);
		}
		public PhraseContext phrase(int i) {
			return getRuleContext(PhraseContext.class,i);
		}
		public SentenceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sentence; }
	}

	public final SentenceContext sentence() throws RecognitionException {
		SentenceContext _localctx = new SentenceContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_sentence);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(163);
			match(CAP_WORD);
			setState(167);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << STAR) | (1L << HASH) | (1L << CAP_WORD) | (1L << WORD))) != 0)) {
				{
				{
				setState(164);
				phrase();
				}
				}
				setState(169);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(170);
			match(SENTENCE_STOP);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class RequirementContext extends ParserRuleContext {
		public TerminalNode BOLDED_ID() { return getToken(shalldnParser.BOLDED_ID, 0); }
		public TerminalNode CAP_WORD() { return getToken(shalldnParser.CAP_WORD, 0); }
		public List<PhraseContext> phrase() {
			return getRuleContexts(PhraseContext.class);
		}
		public PhraseContext phrase(int i) {
			return getRuleContext(PhraseContext.class,i);
		}
		public TerminalNode SHALL() { return getToken(shalldnParser.SHALL, 0); }
		public Plain_phraseContext plain_phrase() {
			return getRuleContext(Plain_phraseContext.class,0);
		}
		public RequirementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_requirement; }
	}

	public final RequirementContext requirement() throws RecognitionException {
		RequirementContext _localctx = new RequirementContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_requirement);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(172);
			match(BOLDED_ID);
			setState(176);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__3) {
				{
				{
				setState(173);
				match(T__3);
				}
				}
				setState(178);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(179);
			match(CAP_WORD);
			setState(183);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,23,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(180);
					phrase();
					}
					} 
				}
				setState(185);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,23,_ctx);
			}
			setState(186);
			phrase();
			setState(187);
			match(SHALL);
			setState(188);
			plain_phrase();
			setState(190); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(189);
				phrase();
				}
				}
				setState(192); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << STAR) | (1L << HASH) | (1L << CAP_WORD) | (1L << WORD))) != 0) );
			setState(194);
			match(T__5);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DocumentContext extends ParserRuleContext {
		public TitleContext title() {
			return getRuleContext(TitleContext.class,0);
		}
		public TerminalNode EOF() { return getToken(shalldnParser.EOF, 0); }
		public List<HeadingContext> heading() {
			return getRuleContexts(HeadingContext.class);
		}
		public HeadingContext heading(int i) {
			return getRuleContext(HeadingContext.class,i);
		}
		public List<RequirementContext> requirement() {
			return getRuleContexts(RequirementContext.class);
		}
		public RequirementContext requirement(int i) {
			return getRuleContext(RequirementContext.class,i);
		}
		public List<SentenceContext> sentence() {
			return getRuleContexts(SentenceContext.class);
		}
		public SentenceContext sentence(int i) {
			return getRuleContext(SentenceContext.class,i);
		}
		public List<UlContext> ul() {
			return getRuleContexts(UlContext.class);
		}
		public UlContext ul(int i) {
			return getRuleContext(UlContext.class,i);
		}
		public DocumentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_document; }
	}

	public final DocumentContext document() throws RecognitionException {
		DocumentContext _localctx = new DocumentContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_document);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(196);
			title();
			setState(206); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				setState(206);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,26,_ctx) ) {
				case 1:
					{
					setState(197);
					heading();
					}
					break;
				case 2:
					{
					setState(198);
					requirement();
					}
					break;
				case 3:
					{
					setState(199);
					sentence();
					}
					break;
				case 4:
					{
					setState(200);
					ul();
					}
					break;
				case 5:
					{
					setState(202); 
					_errHandler.sync(this);
					_alt = 1;
					do {
						switch (_alt) {
						case 1:
							{
							{
							setState(201);
							match(T__3);
							}
							}
							break;
						default:
							throw new NoViableAltException(this);
						}
						setState(204); 
						_errHandler.sync(this);
						_alt = getInterpreter().adaptivePredict(_input,25,_ctx);
					} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
					}
					break;
				}
				}
				setState(208); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << T__3) | (1L << HASH) | (1L << CAP_WORD) | (1L << BOLDED_ID))) != 0) );
			setState(210);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\26\u00d7\4\2\t\2"+
		"\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13"+
		"\t\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\3\2\3\2"+
		"\3\3\3\3\3\3\3\3\7\3)\n\3\f\3\16\3,\13\3\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3"+
		"\4\5\4\66\n\4\3\5\3\5\3\5\3\6\3\6\3\6\3\6\3\6\3\6\3\6\3\6\3\6\3\6\3\6"+
		"\3\6\5\6G\n\6\3\7\3\7\3\7\3\7\3\7\3\b\3\b\3\b\3\b\3\b\3\t\3\t\3\t\3\t"+
		"\3\t\3\t\6\tY\n\t\r\t\16\tZ\3\n\3\n\3\n\7\n`\n\n\f\n\16\nc\13\n\3\n\3"+
		"\n\7\ng\n\n\f\n\16\nj\13\n\3\n\5\nm\n\n\3\13\7\13p\n\13\f\13\16\13s\13"+
		"\13\3\13\6\13v\n\13\r\13\16\13w\3\13\3\13\3\13\3\f\6\f~\n\f\r\f\16\f\177"+
		"\3\f\6\f\u0083\n\f\r\f\16\f\u0084\3\f\3\f\5\f\u0089\n\f\3\f\3\f\5\f\u008d"+
		"\n\f\3\f\5\f\u0090\n\f\3\r\6\r\u0093\n\r\r\r\16\r\u0094\3\r\6\r\u0098"+
		"\n\r\r\r\16\r\u0099\3\r\3\r\5\r\u009e\n\r\3\16\3\16\6\16\u00a2\n\16\r"+
		"\16\16\16\u00a3\3\17\3\17\7\17\u00a8\n\17\f\17\16\17\u00ab\13\17\3\17"+
		"\3\17\3\20\3\20\7\20\u00b1\n\20\f\20\16\20\u00b4\13\20\3\20\3\20\7\20"+
		"\u00b8\n\20\f\20\16\20\u00bb\13\20\3\20\3\20\3\20\3\20\6\20\u00c1\n\20"+
		"\r\20\16\20\u00c2\3\20\3\20\3\21\3\21\3\21\3\21\3\21\3\21\6\21\u00cd\n"+
		"\21\r\21\16\21\u00ce\6\21\u00d1\n\21\r\21\16\21\u00d2\3\21\3\21\3\21\2"+
		"\2\22\2\4\6\b\n\f\16\20\22\24\26\30\32\34\36 \2\4\4\2\16\16\20\20\3\2"+
		"\6\6\2\u00ea\2\"\3\2\2\2\4$\3\2\2\2\6\65\3\2\2\2\b\67\3\2\2\2\nF\3\2\2"+
		"\2\fH\3\2\2\2\16M\3\2\2\2\20X\3\2\2\2\22\\\3\2\2\2\24q\3\2\2\2\26}\3\2"+
		"\2\2\30\u0092\3\2\2\2\32\u00a1\3\2\2\2\34\u00a5\3\2\2\2\36\u00ae\3\2\2"+
		"\2 \u00c6\3\2\2\2\"#\t\2\2\2#\3\3\2\2\2$*\5\2\2\2%)\5\2\2\2&)\7\17\2\2"+
		"\')\7\23\2\2(%\3\2\2\2(&\3\2\2\2(\'\3\2\2\2),\3\2\2\2*(\3\2\2\2*+\3\2"+
		"\2\2+\5\3\2\2\2,*\3\2\2\2-.\7\n\2\2./\5\4\3\2/\60\7\n\2\2\60\66\3\2\2"+
		"\2\61\62\7\r\2\2\62\63\5\4\3\2\63\64\7\r\2\2\64\66\3\2\2\2\65-\3\2\2\2"+
		"\65\61\3\2\2\2\66\7\3\2\2\2\678\5\6\4\289\7\25\2\29\t\3\2\2\2:;\7\n\2"+
		"\2;<\7\n\2\2<=\5\4\3\2=>\7\n\2\2>?\7\n\2\2?G\3\2\2\2@A\7\r\2\2AB\7\r\2"+
		"\2BC\5\4\3\2CD\7\r\2\2DE\7\r\2\2EG\3\2\2\2F:\3\2\2\2F@\3\2\2\2G\13\3\2"+
		"\2\2HI\5\6\4\2IJ\7\3\2\2JK\5\20\t\2KL\7\4\2\2L\r\3\2\2\2MN\5\6\4\2NO\7"+
		"\5\2\2OP\5\20\t\2PQ\7\4\2\2Q\17\3\2\2\2RY\5\4\3\2SY\5\6\4\2TY\5\n\6\2"+
		"UY\5\b\5\2VY\5\f\7\2WY\5\16\b\2XR\3\2\2\2XS\3\2\2\2XT\3\2\2\2XU\3\2\2"+
		"\2XV\3\2\2\2XW\3\2\2\2YZ\3\2\2\2ZX\3\2\2\2Z[\3\2\2\2[\21\3\2\2\2\\]\7"+
		"\r\2\2]a\7\16\2\2^`\5\2\2\2_^\3\2\2\2`c\3\2\2\2a_\3\2\2\2ab\3\2\2\2bd"+
		"\3\2\2\2ca\3\2\2\2dh\5\6\4\2eg\5\2\2\2fe\3\2\2\2gj\3\2\2\2hf\3\2\2\2h"+
		"i\3\2\2\2il\3\2\2\2jh\3\2\2\2km\n\3\2\2lk\3\2\2\2lm\3\2\2\2m\23\3\2\2"+
		"\2np\7\6\2\2on\3\2\2\2ps\3\2\2\2qo\3\2\2\2qr\3\2\2\2ru\3\2\2\2sq\3\2\2"+
		"\2tv\7\r\2\2ut\3\2\2\2vw\3\2\2\2wu\3\2\2\2wx\3\2\2\2xy\3\2\2\2yz\5\20"+
		"\t\2z{\7\6\2\2{\25\3\2\2\2|~\7\6\2\2}|\3\2\2\2~\177\3\2\2\2\177}\3\2\2"+
		"\2\177\u0080\3\2\2\2\u0080\u0082\3\2\2\2\u0081\u0083\7\n\2\2\u0082\u0081"+
		"\3\2\2\2\u0083\u0084\3\2\2\2\u0084\u0082\3\2\2\2\u0084\u0085\3\2\2\2\u0085"+
		"\u0086\3\2\2\2\u0086\u0088\7\7\2\2\u0087\u0089\5\4\3\2\u0088\u0087\3\2"+
		"\2\2\u0088\u0089\3\2\2\2\u0089\u008a\3\2\2\2\u008a\u008c\5\n\6\2\u008b"+
		"\u008d\5\4\3\2\u008c\u008b\3\2\2\2\u008c\u008d\3\2\2\2\u008d\u008f\3\2"+
		"\2\2\u008e\u0090\7\22\2\2\u008f\u008e\3\2\2\2\u008f\u0090\3\2\2\2\u0090"+
		"\27\3\2\2\2\u0091\u0093\7\6\2\2\u0092\u0091\3\2\2\2\u0093\u0094\3\2\2"+
		"\2\u0094\u0092\3\2\2\2\u0094\u0095\3\2\2\2\u0095\u0097\3\2\2\2\u0096\u0098"+
		"\7\n\2\2\u0097\u0096\3\2\2\2\u0098\u0099\3\2\2\2\u0099\u0097\3\2\2\2\u0099"+
		"\u009a\3\2\2\2\u009a\u009b\3\2\2\2\u009b\u009d\5\20\t\2\u009c\u009e\7"+
		"\22\2\2\u009d\u009c\3\2\2\2\u009d\u009e\3\2\2\2\u009e\31\3\2\2\2\u009f"+
		"\u00a2\5\30\r\2\u00a0\u00a2\5\26\f\2\u00a1\u009f\3\2\2\2\u00a1\u00a0\3"+
		"\2\2\2\u00a2\u00a3\3\2\2\2\u00a3\u00a1\3\2\2\2\u00a3\u00a4\3\2\2\2\u00a4"+
		"\33\3\2\2\2\u00a5\u00a9\7\16\2\2\u00a6\u00a8\5\20\t\2\u00a7\u00a6\3\2"+
		"\2\2\u00a8\u00ab\3\2\2\2\u00a9\u00a7\3\2\2\2\u00a9\u00aa\3\2\2\2\u00aa"+
		"\u00ac\3\2\2\2\u00ab\u00a9\3\2\2\2\u00ac\u00ad\7\22\2\2\u00ad\35\3\2\2"+
		"\2\u00ae\u00b2\7\26\2\2\u00af\u00b1\7\6\2\2\u00b0\u00af\3\2\2\2\u00b1"+
		"\u00b4\3\2\2\2\u00b2\u00b0\3\2\2\2\u00b2\u00b3\3\2\2\2\u00b3\u00b5\3\2"+
		"\2\2\u00b4\u00b2\3\2\2\2\u00b5\u00b9\7\16\2\2\u00b6\u00b8\5\20\t\2\u00b7"+
		"\u00b6\3\2\2\2\u00b8\u00bb\3\2\2\2\u00b9\u00b7\3\2\2\2\u00b9\u00ba\3\2"+
		"\2\2\u00ba\u00bc\3\2\2\2\u00bb\u00b9\3\2\2\2\u00bc\u00bd\5\20\t\2\u00bd"+
		"\u00be\7\24\2\2\u00be\u00c0\5\4\3\2\u00bf\u00c1\5\20\t\2\u00c0\u00bf\3"+
		"\2\2\2\u00c1\u00c2\3\2\2\2\u00c2\u00c0\3\2\2\2\u00c2\u00c3\3\2\2\2\u00c3"+
		"\u00c4\3\2\2\2\u00c4\u00c5\7\b\2\2\u00c5\37\3\2\2\2\u00c6\u00d0\5\22\n"+
		"\2\u00c7\u00d1\5\24\13\2\u00c8\u00d1\5\36\20\2\u00c9\u00d1\5\34\17\2\u00ca"+
		"\u00d1\5\32\16\2\u00cb\u00cd\7\6\2\2\u00cc\u00cb\3\2\2\2\u00cd\u00ce\3"+
		"\2\2\2\u00ce\u00cc\3\2\2\2\u00ce\u00cf\3\2\2\2\u00cf\u00d1\3\2\2\2\u00d0"+
		"\u00c7\3\2\2\2\u00d0\u00c8\3\2\2\2\u00d0\u00c9\3\2\2\2\u00d0\u00ca\3\2"+
		"\2\2\u00d0\u00cc\3\2\2\2\u00d1\u00d2\3\2\2\2\u00d2\u00d0\3\2\2\2\u00d2"+
		"\u00d3\3\2\2\2\u00d3\u00d4\3\2\2\2\u00d4\u00d5\7\2\2\3\u00d5!\3\2\2\2"+
		"\36(*\65FXZahlqw\177\u0084\u0088\u008c\u008f\u0094\u0099\u009d\u00a1\u00a3"+
		"\u00a9\u00b2\u00b9\u00c2\u00ce\u00d0\u00d2";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}
// Generated from ../../shalldn.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { shalldnListener } from "./shalldnListener";
import { shalldnVisitor } from "./shalldnVisitor";


export class shalldnParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly WHITESPACE = 7;
	public static readonly STAR = 8;
	public static readonly MINUS = 9;
	public static readonly UL = 10;
	public static readonly HASH = 11;
	public static readonly CAP_WORD = 12;
	public static readonly QUOTED_FRAGMENT = 13;
	public static readonly WORD = 14;
	public static readonly IDENTIFIER = 15;
	public static readonly SENTENCE_STOP = 16;
	public static readonly PUNCTUATION = 17;
	public static readonly SHALL = 18;
	public static readonly NB = 19;
	public static readonly BOLDED_ID = 20;
	public static readonly RULE_word = 0;
	public static readonly RULE_plain_phrase = 1;
	public static readonly RULE_italiced_phrase = 2;
	public static readonly RULE_nota_bene = 3;
	public static readonly RULE_bolded_phrase = 4;
	public static readonly RULE_def_drct = 5;
	public static readonly RULE_def_rev = 6;
	public static readonly RULE_phrase = 7;
	public static readonly RULE_title = 8;
	public static readonly RULE_heading = 9;
	public static readonly RULE_implmnt_ind = 10;
	public static readonly RULE_ul_element = 11;
	public static readonly RULE_ul = 12;
	public static readonly RULE_sentence = 13;
	public static readonly RULE_requirement = 14;
	public static readonly RULE_document = 15;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"word", "plain_phrase", "italiced_phrase", "nota_bene", "bolded_phrase", 
		"def_drct", "def_rev", "phrase", "title", "heading", "implmnt_ind", "ul_element", 
		"ul", "sentence", "requirement", "document",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'*(i.e.'", "')*'", "'*('", "'\n'", "'Implements'", "'.\n'", 
		undefined, "'*'", "'-'", "'_'", "'#'", undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, "'*(n.b.)*'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		"WHITESPACE", "STAR", "MINUS", "UL", "HASH", "CAP_WORD", "QUOTED_FRAGMENT", 
		"WORD", "IDENTIFIER", "SENTENCE_STOP", "PUNCTUATION", "SHALL", "NB", "BOLDED_ID",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(shalldnParser._LITERAL_NAMES, shalldnParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return shalldnParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "shalldn.g4"; }

	// @Override
	public get ruleNames(): string[] { return shalldnParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return shalldnParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(shalldnParser._ATN, this);
	}
	// @RuleVersion(0)
	public word(): WordContext {
		let _localctx: WordContext = new WordContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, shalldnParser.RULE_word);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 32;
			_la = this._input.LA(1);
			if (!(_la === shalldnParser.CAP_WORD || _la === shalldnParser.WORD)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public plain_phrase(): Plain_phraseContext {
		let _localctx: Plain_phraseContext = new Plain_phraseContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, shalldnParser.RULE_plain_phrase);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 34;
			this.word();
			this.state = 40;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 1, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					this.state = 38;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case shalldnParser.CAP_WORD:
					case shalldnParser.WORD:
						{
						this.state = 35;
						this.word();
						}
						break;
					case shalldnParser.QUOTED_FRAGMENT:
						{
						this.state = 36;
						this.match(shalldnParser.QUOTED_FRAGMENT);
						}
						break;
					case shalldnParser.PUNCTUATION:
						{
						this.state = 37;
						this.match(shalldnParser.PUNCTUATION);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
				}
				this.state = 42;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 1, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public italiced_phrase(): Italiced_phraseContext {
		let _localctx: Italiced_phraseContext = new Italiced_phraseContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, shalldnParser.RULE_italiced_phrase);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 51;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case shalldnParser.STAR:
				{
				this.state = 43;
				this.match(shalldnParser.STAR);
				this.state = 44;
				this.plain_phrase();
				this.state = 45;
				this.match(shalldnParser.STAR);
				}
				break;
			case shalldnParser.HASH:
				{
				this.state = 47;
				this.match(shalldnParser.HASH);
				this.state = 48;
				this.plain_phrase();
				this.state = 49;
				this.match(shalldnParser.HASH);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public nota_bene(): Nota_beneContext {
		let _localctx: Nota_beneContext = new Nota_beneContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, shalldnParser.RULE_nota_bene);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 53;
			this.italiced_phrase();
			this.state = 54;
			this.match(shalldnParser.NB);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public bolded_phrase(): Bolded_phraseContext {
		let _localctx: Bolded_phraseContext = new Bolded_phraseContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, shalldnParser.RULE_bolded_phrase);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 68;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case shalldnParser.STAR:
				{
				this.state = 56;
				this.match(shalldnParser.STAR);
				this.state = 57;
				this.match(shalldnParser.STAR);
				this.state = 58;
				this.plain_phrase();
				this.state = 59;
				this.match(shalldnParser.STAR);
				this.state = 60;
				this.match(shalldnParser.STAR);
				}
				break;
			case shalldnParser.HASH:
				{
				this.state = 62;
				this.match(shalldnParser.HASH);
				this.state = 63;
				this.match(shalldnParser.HASH);
				this.state = 64;
				this.plain_phrase();
				this.state = 65;
				this.match(shalldnParser.HASH);
				this.state = 66;
				this.match(shalldnParser.HASH);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public def_drct(): Def_drctContext {
		let _localctx: Def_drctContext = new Def_drctContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, shalldnParser.RULE_def_drct);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 70;
			_localctx._subject = this.italiced_phrase();
			this.state = 71;
			this.match(shalldnParser.T__0);
			this.state = 72;
			_localctx._body = this.phrase();
			this.state = 73;
			this.match(shalldnParser.T__1);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public def_rev(): Def_revContext {
		let _localctx: Def_revContext = new Def_revContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, shalldnParser.RULE_def_rev);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 75;
			_localctx._body = this.italiced_phrase();
			this.state = 76;
			this.match(shalldnParser.T__2);
			this.state = 77;
			_localctx._subject = this.phrase();
			this.state = 78;
			this.match(shalldnParser.T__1);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public phrase(): PhraseContext {
		let _localctx: PhraseContext = new PhraseContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, shalldnParser.RULE_phrase);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 86;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					this.state = 86;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 4, this._ctx) ) {
					case 1:
						{
						this.state = 80;
						this.plain_phrase();
						}
						break;

					case 2:
						{
						this.state = 81;
						this.italiced_phrase();
						}
						break;

					case 3:
						{
						this.state = 82;
						this.bolded_phrase();
						}
						break;

					case 4:
						{
						this.state = 83;
						this.nota_bene();
						}
						break;

					case 5:
						{
						this.state = 84;
						this.def_drct();
						}
						break;

					case 6:
						{
						this.state = 85;
						this.def_rev();
						}
						break;
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 88;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 5, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public title(): TitleContext {
		let _localctx: TitleContext = new TitleContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, shalldnParser.RULE_title);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 90;
			this.match(shalldnParser.HASH);
			this.state = 91;
			this.match(shalldnParser.CAP_WORD);
			this.state = 95;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === shalldnParser.CAP_WORD || _la === shalldnParser.WORD) {
				{
				{
				this.state = 92;
				this.word();
				}
				}
				this.state = 97;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 98;
			_localctx._subject = this.italiced_phrase();
			this.state = 102;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 7, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 99;
					this.word();
					}
					}
				}
				this.state = 104;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 7, this._ctx);
			}
			this.state = 106;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 8, this._ctx) ) {
			case 1:
				{
				this.state = 105;
				_la = this._input.LA(1);
				if (_la <= 0 || (_la === shalldnParser.T__3)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public heading(): HeadingContext {
		let _localctx: HeadingContext = new HeadingContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, shalldnParser.RULE_heading);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 111;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === shalldnParser.T__3) {
				{
				{
				this.state = 108;
				this.match(shalldnParser.T__3);
				}
				}
				this.state = 113;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			{
			this.state = 115;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 114;
					this.match(shalldnParser.HASH);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 117;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 10, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
			this.state = 119;
			this.phrase();
			this.state = 120;
			this.match(shalldnParser.T__3);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public implmnt_ind(): Implmnt_indContext {
		let _localctx: Implmnt_indContext = new Implmnt_indContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, shalldnParser.RULE_implmnt_ind);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 123;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 122;
				this.match(shalldnParser.T__3);
				}
				}
				this.state = 125;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === shalldnParser.T__3);
			this.state = 128;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 127;
				this.match(shalldnParser.STAR);
				}
				}
				this.state = 130;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === shalldnParser.STAR);
			this.state = 132;
			this.match(shalldnParser.T__4);
			this.state = 134;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === shalldnParser.CAP_WORD || _la === shalldnParser.WORD) {
				{
				this.state = 133;
				this.plain_phrase();
				}
			}

			this.state = 136;
			_localctx._id = this.bolded_phrase();
			this.state = 138;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 14, this._ctx) ) {
			case 1:
				{
				this.state = 137;
				this.plain_phrase();
				}
				break;
			}
			this.state = 141;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === shalldnParser.SENTENCE_STOP) {
				{
				this.state = 140;
				this.match(shalldnParser.SENTENCE_STOP);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public ul_element(): Ul_elementContext {
		let _localctx: Ul_elementContext = new Ul_elementContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, shalldnParser.RULE_ul_element);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 144;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 143;
				this.match(shalldnParser.T__3);
				}
				}
				this.state = 146;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === shalldnParser.T__3);
			this.state = 149;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 148;
					this.match(shalldnParser.STAR);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 151;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 17, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			this.state = 153;
			this.phrase();
			this.state = 155;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === shalldnParser.SENTENCE_STOP) {
				{
				this.state = 154;
				this.match(shalldnParser.SENTENCE_STOP);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public ul(): UlContext {
		let _localctx: UlContext = new UlContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, shalldnParser.RULE_ul);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 159;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					this.state = 159;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 19, this._ctx) ) {
					case 1:
						{
						this.state = 157;
						this.ul_element();
						}
						break;

					case 2:
						{
						this.state = 158;
						this.implmnt_ind();
						}
						break;
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 161;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 20, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public sentence(): SentenceContext {
		let _localctx: SentenceContext = new SentenceContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, shalldnParser.RULE_sentence);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 163;
			this.match(shalldnParser.CAP_WORD);
			this.state = 167;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << shalldnParser.STAR) | (1 << shalldnParser.HASH) | (1 << shalldnParser.CAP_WORD) | (1 << shalldnParser.WORD))) !== 0)) {
				{
				{
				this.state = 164;
				this.phrase();
				}
				}
				this.state = 169;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 170;
			this.match(shalldnParser.SENTENCE_STOP);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public requirement(): RequirementContext {
		let _localctx: RequirementContext = new RequirementContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, shalldnParser.RULE_requirement);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 172;
			this.match(shalldnParser.BOLDED_ID);
			this.state = 176;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === shalldnParser.T__3) {
				{
				{
				this.state = 173;
				this.match(shalldnParser.T__3);
				}
				}
				this.state = 178;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 179;
			this.match(shalldnParser.CAP_WORD);
			this.state = 183;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 23, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 180;
					this.phrase();
					}
					}
				}
				this.state = 185;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 23, this._ctx);
			}
			this.state = 186;
			this.phrase();
			this.state = 187;
			this.match(shalldnParser.SHALL);
			this.state = 188;
			this.plain_phrase();
			this.state = 190;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 189;
				this.phrase();
				}
				}
				this.state = 192;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << shalldnParser.STAR) | (1 << shalldnParser.HASH) | (1 << shalldnParser.CAP_WORD) | (1 << shalldnParser.WORD))) !== 0));
			this.state = 194;
			this.match(shalldnParser.T__5);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public document(): DocumentContext {
		let _localctx: DocumentContext = new DocumentContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, shalldnParser.RULE_document);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 196;
			this.title();
			this.state = 206;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				this.state = 206;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 26, this._ctx) ) {
				case 1:
					{
					this.state = 197;
					this.heading();
					}
					break;

				case 2:
					{
					this.state = 198;
					this.requirement();
					}
					break;

				case 3:
					{
					this.state = 199;
					this.sentence();
					}
					break;

				case 4:
					{
					this.state = 200;
					this.ul();
					}
					break;

				case 5:
					{
					this.state = 202;
					this._errHandler.sync(this);
					_alt = 1;
					do {
						switch (_alt) {
						case 1:
							{
							{
							this.state = 201;
							this.match(shalldnParser.T__3);
							}
							}
							break;
						default:
							throw new NoViableAltException(this);
						}
						this.state = 204;
						this._errHandler.sync(this);
						_alt = this.interpreter.adaptivePredict(this._input, 25, this._ctx);
					} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
					}
					break;
				}
				}
				this.state = 208;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << shalldnParser.T__3) | (1 << shalldnParser.HASH) | (1 << shalldnParser.CAP_WORD) | (1 << shalldnParser.BOLDED_ID))) !== 0));
			this.state = 210;
			this.match(shalldnParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x16\xD7\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x03\x02\x03\x02\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x07\x03)\n\x03\f\x03\x0E\x03,\v\x03\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x05\x046\n\x04" +
		"\x03\x05\x03\x05\x03\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06" +
		"\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x05\x06G\n\x06\x03\x07" +
		"\x03\x07\x03\x07\x03\x07\x03\x07\x03\b\x03\b\x03\b\x03\b\x03\b\x03\t\x03" +
		"\t\x03\t\x03\t\x03\t\x03\t\x06\tY\n\t\r\t\x0E\tZ\x03\n\x03\n\x03\n\x07" +
		"\n`\n\n\f\n\x0E\nc\v\n\x03\n\x03\n\x07\ng\n\n\f\n\x0E\nj\v\n\x03\n\x05" +
		"\nm\n\n\x03\v\x07\vp\n\v\f\v\x0E\vs\v\v\x03\v\x06\vv\n\v\r\v\x0E\vw\x03" +
		"\v\x03\v\x03\v\x03\f\x06\f~\n\f\r\f\x0E\f\x7F\x03\f\x06\f\x83\n\f\r\f" +
		"\x0E\f\x84\x03\f\x03\f\x05\f\x89\n\f\x03\f\x03\f\x05\f\x8D\n\f\x03\f\x05" +
		"\f\x90\n\f\x03\r\x06\r\x93\n\r\r\r\x0E\r\x94\x03\r\x06\r\x98\n\r\r\r\x0E" +
		"\r\x99\x03\r\x03\r\x05\r\x9E\n\r\x03\x0E\x03\x0E\x06\x0E\xA2\n\x0E\r\x0E" +
		"\x0E\x0E\xA3\x03\x0F\x03\x0F\x07\x0F\xA8\n\x0F\f\x0F\x0E\x0F\xAB\v\x0F" +
		"\x03\x0F\x03\x0F\x03\x10\x03\x10\x07\x10\xB1\n\x10\f\x10\x0E\x10\xB4\v" +
		"\x10\x03\x10\x03\x10\x07\x10\xB8\n\x10\f\x10\x0E\x10\xBB\v\x10\x03\x10" +
		"\x03\x10\x03\x10\x03\x10\x06\x10\xC1\n\x10\r\x10\x0E\x10\xC2\x03\x10\x03" +
		"\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x06\x11\xCD\n\x11" +
		"\r\x11\x0E\x11\xCE\x06\x11\xD1\n\x11\r\x11\x0E\x11\xD2\x03\x11\x03\x11" +
		"\x03\x11\x02\x02\x02\x12\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E" +
		"\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 " +
		"\x02\x02\x04\x04\x02\x0E\x0E\x10\x10\x03\x02\x06\x06\x02\xEA\x02\"\x03" +
		"\x02\x02\x02\x04$\x03\x02\x02\x02\x065\x03\x02\x02\x02\b7\x03\x02\x02" +
		"\x02\nF\x03\x02\x02\x02\fH\x03\x02\x02\x02\x0EM\x03\x02\x02\x02\x10X\x03" +
		"\x02\x02\x02\x12\\\x03\x02\x02\x02\x14q\x03\x02\x02\x02\x16}\x03\x02\x02" +
		"\x02\x18\x92\x03\x02\x02\x02\x1A\xA1\x03\x02\x02\x02\x1C\xA5\x03\x02\x02" +
		"\x02\x1E\xAE\x03\x02\x02\x02 \xC6\x03\x02\x02\x02\"#\t\x02\x02\x02#\x03" +
		"\x03\x02\x02\x02$*\x05\x02\x02\x02%)\x05\x02\x02\x02&)\x07\x0F\x02\x02" +
		"\')\x07\x13\x02\x02(%\x03\x02\x02\x02(&\x03\x02\x02\x02(\'\x03\x02\x02" +
		"\x02),\x03\x02\x02\x02*(\x03\x02\x02\x02*+\x03\x02\x02\x02+\x05\x03\x02" +
		"\x02\x02,*\x03\x02\x02\x02-.\x07\n\x02\x02./\x05\x04\x03\x02/0\x07\n\x02" +
		"\x0206\x03\x02\x02\x0212\x07\r\x02\x0223\x05\x04\x03\x0234\x07\r\x02\x02" +
		"46\x03\x02\x02\x025-\x03\x02\x02\x0251\x03\x02\x02\x026\x07\x03\x02\x02" +
		"\x0278\x05\x06\x04\x0289\x07\x15\x02\x029\t\x03\x02\x02\x02:;\x07\n\x02" +
		"\x02;<\x07\n\x02\x02<=\x05\x04\x03\x02=>\x07\n\x02\x02>?\x07\n\x02\x02" +
		"?G\x03\x02\x02\x02@A\x07\r\x02\x02AB\x07\r\x02\x02BC\x05\x04\x03\x02C" +
		"D\x07\r\x02\x02DE\x07\r\x02\x02EG\x03\x02\x02\x02F:\x03\x02\x02\x02F@" +
		"\x03\x02\x02\x02G\v\x03\x02\x02\x02HI\x05\x06\x04\x02IJ\x07\x03\x02\x02" +
		"JK\x05\x10\t\x02KL\x07\x04\x02\x02L\r\x03\x02\x02\x02MN\x05\x06\x04\x02" +
		"NO\x07\x05\x02\x02OP\x05\x10\t\x02PQ\x07\x04\x02\x02Q\x0F\x03\x02\x02" +
		"\x02RY\x05\x04\x03\x02SY\x05\x06\x04\x02TY\x05\n\x06\x02UY\x05\b\x05\x02" +
		"VY\x05\f\x07\x02WY\x05\x0E\b\x02XR\x03\x02\x02\x02XS\x03\x02\x02\x02X" +
		"T\x03\x02\x02\x02XU\x03\x02\x02\x02XV\x03\x02\x02\x02XW\x03\x02\x02\x02" +
		"YZ\x03\x02\x02\x02ZX\x03\x02\x02\x02Z[\x03\x02\x02\x02[\x11\x03\x02\x02" +
		"\x02\\]\x07\r\x02\x02]a\x07\x0E\x02\x02^`\x05\x02\x02\x02_^\x03\x02\x02" +
		"\x02`c\x03\x02\x02\x02a_\x03\x02\x02\x02ab\x03\x02\x02\x02bd\x03\x02\x02" +
		"\x02ca\x03\x02\x02\x02dh\x05\x06\x04\x02eg\x05\x02\x02\x02fe\x03\x02\x02" +
		"\x02gj\x03\x02\x02\x02hf\x03\x02\x02\x02hi\x03\x02\x02\x02il\x03\x02\x02" +
		"\x02jh\x03\x02\x02\x02km\n\x03\x02\x02lk\x03\x02\x02\x02lm\x03\x02\x02" +
		"\x02m\x13\x03\x02\x02\x02np\x07\x06\x02\x02on\x03\x02\x02\x02ps\x03\x02" +
		"\x02\x02qo\x03\x02\x02\x02qr\x03\x02\x02\x02ru\x03\x02\x02\x02sq\x03\x02" +
		"\x02\x02tv\x07\r\x02\x02ut\x03\x02\x02\x02vw\x03\x02\x02\x02wu\x03\x02" +
		"\x02\x02wx\x03\x02\x02\x02xy\x03\x02\x02\x02yz\x05\x10\t\x02z{\x07\x06" +
		"\x02\x02{\x15\x03\x02\x02\x02|~\x07\x06\x02\x02}|\x03\x02\x02\x02~\x7F" +
		"\x03\x02\x02\x02\x7F}\x03\x02\x02\x02\x7F\x80\x03\x02\x02\x02\x80\x82" +
		"\x03\x02\x02\x02\x81\x83\x07\n\x02\x02\x82\x81\x03\x02\x02\x02\x83\x84" +
		"\x03\x02\x02\x02\x84\x82\x03\x02\x02\x02\x84\x85\x03\x02\x02\x02\x85\x86" +
		"\x03\x02\x02\x02\x86\x88\x07\x07\x02\x02\x87\x89\x05\x04\x03\x02\x88\x87" +
		"\x03\x02\x02\x02\x88\x89\x03\x02\x02\x02\x89\x8A\x03\x02\x02\x02\x8A\x8C" +
		"\x05\n\x06\x02\x8B\x8D\x05\x04\x03\x02\x8C\x8B\x03\x02\x02\x02\x8C\x8D" +
		"\x03\x02\x02\x02\x8D\x8F\x03\x02\x02\x02\x8E\x90\x07\x12\x02\x02\x8F\x8E" +
		"\x03\x02\x02\x02\x8F\x90\x03\x02\x02\x02\x90\x17\x03\x02\x02\x02\x91\x93" +
		"\x07\x06\x02\x02\x92\x91\x03\x02\x02\x02\x93\x94\x03\x02\x02\x02\x94\x92" +
		"\x03\x02\x02\x02\x94\x95\x03\x02\x02\x02\x95\x97\x03\x02\x02\x02\x96\x98" +
		"\x07\n\x02\x02\x97\x96\x03\x02\x02\x02\x98\x99\x03\x02\x02\x02\x99\x97" +
		"\x03\x02\x02\x02\x99\x9A\x03\x02\x02\x02\x9A\x9B\x03\x02\x02\x02\x9B\x9D" +
		"\x05\x10\t\x02\x9C\x9E\x07\x12\x02\x02\x9D\x9C\x03\x02\x02\x02\x9D\x9E" +
		"\x03\x02\x02\x02\x9E\x19\x03\x02\x02\x02\x9F\xA2\x05\x18\r\x02\xA0\xA2" +
		"\x05\x16\f\x02\xA1\x9F\x03\x02\x02\x02\xA1\xA0\x03\x02\x02\x02\xA2\xA3" +
		"\x03\x02\x02\x02\xA3\xA1\x03\x02\x02\x02\xA3\xA4\x03\x02\x02\x02\xA4\x1B" +
		"\x03\x02\x02\x02\xA5\xA9\x07\x0E\x02\x02\xA6\xA8\x05\x10\t\x02\xA7\xA6" +
		"\x03\x02\x02\x02\xA8\xAB\x03\x02\x02\x02\xA9\xA7\x03\x02\x02\x02\xA9\xAA" +
		"\x03\x02\x02\x02\xAA\xAC\x03\x02\x02\x02\xAB\xA9\x03\x02\x02\x02\xAC\xAD" +
		"\x07\x12\x02\x02\xAD\x1D\x03\x02\x02\x02\xAE\xB2\x07\x16\x02\x02\xAF\xB1" +
		"\x07\x06\x02\x02\xB0\xAF\x03\x02\x02\x02\xB1\xB4\x03\x02\x02\x02\xB2\xB0" +
		"\x03\x02\x02\x02\xB2\xB3\x03\x02\x02\x02\xB3\xB5\x03\x02\x02\x02\xB4\xB2" +
		"\x03\x02\x02\x02\xB5\xB9\x07\x0E\x02\x02\xB6\xB8\x05\x10\t\x02\xB7\xB6" +
		"\x03\x02\x02\x02\xB8\xBB\x03\x02\x02\x02\xB9\xB7\x03\x02\x02\x02\xB9\xBA" +
		"\x03\x02\x02\x02\xBA\xBC\x03\x02\x02\x02\xBB\xB9\x03\x02\x02\x02\xBC\xBD" +
		"\x05\x10\t\x02\xBD\xBE\x07\x14\x02\x02\xBE\xC0\x05\x04\x03\x02\xBF\xC1" +
		"\x05\x10\t\x02\xC0\xBF\x03\x02\x02\x02\xC1\xC2\x03\x02\x02\x02\xC2\xC0" +
		"\x03\x02\x02\x02\xC2\xC3\x03\x02\x02\x02\xC3\xC4\x03\x02\x02\x02\xC4\xC5" +
		"\x07\b\x02\x02\xC5\x1F\x03\x02\x02\x02\xC6\xD0\x05\x12\n\x02\xC7\xD1\x05" +
		"\x14\v\x02\xC8\xD1\x05\x1E\x10\x02\xC9\xD1\x05\x1C\x0F\x02\xCA\xD1\x05" +
		"\x1A\x0E\x02\xCB\xCD\x07\x06\x02\x02\xCC\xCB\x03\x02\x02\x02\xCD\xCE\x03" +
		"\x02\x02\x02\xCE\xCC\x03\x02\x02\x02\xCE\xCF\x03\x02\x02\x02\xCF\xD1\x03" +
		"\x02\x02\x02\xD0\xC7\x03\x02\x02\x02\xD0\xC8\x03\x02\x02\x02\xD0\xC9\x03" +
		"\x02\x02\x02\xD0\xCA\x03\x02\x02\x02\xD0\xCC\x03\x02\x02\x02\xD1\xD2\x03" +
		"\x02\x02\x02\xD2\xD0\x03\x02\x02\x02\xD2\xD3\x03\x02\x02\x02\xD3\xD4\x03" +
		"\x02\x02\x02\xD4\xD5\x07\x02\x02\x03\xD5!\x03\x02\x02\x02\x1E(*5FXZah" +
		"lqw\x7F\x84\x88\x8C\x8F\x94\x99\x9D\xA1\xA3\xA9\xB2\xB9\xC2\xCE\xD0\xD2";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!shalldnParser.__ATN) {
			shalldnParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(shalldnParser._serializedATN));
		}

		return shalldnParser.__ATN;
	}

}

export class WordContext extends ParserRuleContext {
	public WORD(): TerminalNode | undefined { return this.tryGetToken(shalldnParser.WORD, 0); }
	public CAP_WORD(): TerminalNode | undefined { return this.tryGetToken(shalldnParser.CAP_WORD, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_word; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterWord) {
			listener.enterWord(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitWord) {
			listener.exitWord(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitWord) {
			return visitor.visitWord(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Plain_phraseContext extends ParserRuleContext {
	public word(): WordContext[];
	public word(i: number): WordContext;
	public word(i?: number): WordContext | WordContext[] {
		if (i === undefined) {
			return this.getRuleContexts(WordContext);
		} else {
			return this.getRuleContext(i, WordContext);
		}
	}
	public QUOTED_FRAGMENT(): TerminalNode[];
	public QUOTED_FRAGMENT(i: number): TerminalNode;
	public QUOTED_FRAGMENT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(shalldnParser.QUOTED_FRAGMENT);
		} else {
			return this.getToken(shalldnParser.QUOTED_FRAGMENT, i);
		}
	}
	public PUNCTUATION(): TerminalNode[];
	public PUNCTUATION(i: number): TerminalNode;
	public PUNCTUATION(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(shalldnParser.PUNCTUATION);
		} else {
			return this.getToken(shalldnParser.PUNCTUATION, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_plain_phrase; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterPlain_phrase) {
			listener.enterPlain_phrase(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitPlain_phrase) {
			listener.exitPlain_phrase(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitPlain_phrase) {
			return visitor.visitPlain_phrase(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Italiced_phraseContext extends ParserRuleContext {
	public STAR(): TerminalNode[];
	public STAR(i: number): TerminalNode;
	public STAR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(shalldnParser.STAR);
		} else {
			return this.getToken(shalldnParser.STAR, i);
		}
	}
	public plain_phrase(): Plain_phraseContext | undefined {
		return this.tryGetRuleContext(0, Plain_phraseContext);
	}
	public HASH(): TerminalNode[];
	public HASH(i: number): TerminalNode;
	public HASH(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(shalldnParser.HASH);
		} else {
			return this.getToken(shalldnParser.HASH, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_italiced_phrase; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterItaliced_phrase) {
			listener.enterItaliced_phrase(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitItaliced_phrase) {
			listener.exitItaliced_phrase(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitItaliced_phrase) {
			return visitor.visitItaliced_phrase(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Nota_beneContext extends ParserRuleContext {
	public italiced_phrase(): Italiced_phraseContext {
		return this.getRuleContext(0, Italiced_phraseContext);
	}
	public NB(): TerminalNode { return this.getToken(shalldnParser.NB, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_nota_bene; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterNota_bene) {
			listener.enterNota_bene(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitNota_bene) {
			listener.exitNota_bene(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitNota_bene) {
			return visitor.visitNota_bene(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Bolded_phraseContext extends ParserRuleContext {
	public STAR(): TerminalNode[];
	public STAR(i: number): TerminalNode;
	public STAR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(shalldnParser.STAR);
		} else {
			return this.getToken(shalldnParser.STAR, i);
		}
	}
	public plain_phrase(): Plain_phraseContext | undefined {
		return this.tryGetRuleContext(0, Plain_phraseContext);
	}
	public HASH(): TerminalNode[];
	public HASH(i: number): TerminalNode;
	public HASH(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(shalldnParser.HASH);
		} else {
			return this.getToken(shalldnParser.HASH, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_bolded_phrase; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterBolded_phrase) {
			listener.enterBolded_phrase(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitBolded_phrase) {
			listener.exitBolded_phrase(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitBolded_phrase) {
			return visitor.visitBolded_phrase(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Def_drctContext extends ParserRuleContext {
	public _subject!: Italiced_phraseContext;
	public _body!: PhraseContext;
	public italiced_phrase(): Italiced_phraseContext {
		return this.getRuleContext(0, Italiced_phraseContext);
	}
	public phrase(): PhraseContext {
		return this.getRuleContext(0, PhraseContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_def_drct; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterDef_drct) {
			listener.enterDef_drct(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitDef_drct) {
			listener.exitDef_drct(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitDef_drct) {
			return visitor.visitDef_drct(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Def_revContext extends ParserRuleContext {
	public _body!: Italiced_phraseContext;
	public _subject!: PhraseContext;
	public italiced_phrase(): Italiced_phraseContext {
		return this.getRuleContext(0, Italiced_phraseContext);
	}
	public phrase(): PhraseContext {
		return this.getRuleContext(0, PhraseContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_def_rev; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterDef_rev) {
			listener.enterDef_rev(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitDef_rev) {
			listener.exitDef_rev(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitDef_rev) {
			return visitor.visitDef_rev(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PhraseContext extends ParserRuleContext {
	public plain_phrase(): Plain_phraseContext[];
	public plain_phrase(i: number): Plain_phraseContext;
	public plain_phrase(i?: number): Plain_phraseContext | Plain_phraseContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Plain_phraseContext);
		} else {
			return this.getRuleContext(i, Plain_phraseContext);
		}
	}
	public italiced_phrase(): Italiced_phraseContext[];
	public italiced_phrase(i: number): Italiced_phraseContext;
	public italiced_phrase(i?: number): Italiced_phraseContext | Italiced_phraseContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Italiced_phraseContext);
		} else {
			return this.getRuleContext(i, Italiced_phraseContext);
		}
	}
	public bolded_phrase(): Bolded_phraseContext[];
	public bolded_phrase(i: number): Bolded_phraseContext;
	public bolded_phrase(i?: number): Bolded_phraseContext | Bolded_phraseContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Bolded_phraseContext);
		} else {
			return this.getRuleContext(i, Bolded_phraseContext);
		}
	}
	public nota_bene(): Nota_beneContext[];
	public nota_bene(i: number): Nota_beneContext;
	public nota_bene(i?: number): Nota_beneContext | Nota_beneContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Nota_beneContext);
		} else {
			return this.getRuleContext(i, Nota_beneContext);
		}
	}
	public def_drct(): Def_drctContext[];
	public def_drct(i: number): Def_drctContext;
	public def_drct(i?: number): Def_drctContext | Def_drctContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Def_drctContext);
		} else {
			return this.getRuleContext(i, Def_drctContext);
		}
	}
	public def_rev(): Def_revContext[];
	public def_rev(i: number): Def_revContext;
	public def_rev(i?: number): Def_revContext | Def_revContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Def_revContext);
		} else {
			return this.getRuleContext(i, Def_revContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_phrase; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterPhrase) {
			listener.enterPhrase(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitPhrase) {
			listener.exitPhrase(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitPhrase) {
			return visitor.visitPhrase(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TitleContext extends ParserRuleContext {
	public _subject!: Italiced_phraseContext;
	public HASH(): TerminalNode { return this.getToken(shalldnParser.HASH, 0); }
	public CAP_WORD(): TerminalNode { return this.getToken(shalldnParser.CAP_WORD, 0); }
	public italiced_phrase(): Italiced_phraseContext {
		return this.getRuleContext(0, Italiced_phraseContext);
	}
	public word(): WordContext[];
	public word(i: number): WordContext;
	public word(i?: number): WordContext | WordContext[] {
		if (i === undefined) {
			return this.getRuleContexts(WordContext);
		} else {
			return this.getRuleContext(i, WordContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_title; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterTitle) {
			listener.enterTitle(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitTitle) {
			listener.exitTitle(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitTitle) {
			return visitor.visitTitle(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class HeadingContext extends ParserRuleContext {
	public phrase(): PhraseContext {
		return this.getRuleContext(0, PhraseContext);
	}
	public HASH(): TerminalNode[];
	public HASH(i: number): TerminalNode;
	public HASH(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(shalldnParser.HASH);
		} else {
			return this.getToken(shalldnParser.HASH, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_heading; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterHeading) {
			listener.enterHeading(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitHeading) {
			listener.exitHeading(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitHeading) {
			return visitor.visitHeading(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Implmnt_indContext extends ParserRuleContext {
	public _id!: Bolded_phraseContext;
	public bolded_phrase(): Bolded_phraseContext {
		return this.getRuleContext(0, Bolded_phraseContext);
	}
	public STAR(): TerminalNode[];
	public STAR(i: number): TerminalNode;
	public STAR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(shalldnParser.STAR);
		} else {
			return this.getToken(shalldnParser.STAR, i);
		}
	}
	public plain_phrase(): Plain_phraseContext[];
	public plain_phrase(i: number): Plain_phraseContext;
	public plain_phrase(i?: number): Plain_phraseContext | Plain_phraseContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Plain_phraseContext);
		} else {
			return this.getRuleContext(i, Plain_phraseContext);
		}
	}
	public SENTENCE_STOP(): TerminalNode | undefined { return this.tryGetToken(shalldnParser.SENTENCE_STOP, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_implmnt_ind; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterImplmnt_ind) {
			listener.enterImplmnt_ind(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitImplmnt_ind) {
			listener.exitImplmnt_ind(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitImplmnt_ind) {
			return visitor.visitImplmnt_ind(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Ul_elementContext extends ParserRuleContext {
	public phrase(): PhraseContext {
		return this.getRuleContext(0, PhraseContext);
	}
	public STAR(): TerminalNode[];
	public STAR(i: number): TerminalNode;
	public STAR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(shalldnParser.STAR);
		} else {
			return this.getToken(shalldnParser.STAR, i);
		}
	}
	public SENTENCE_STOP(): TerminalNode | undefined { return this.tryGetToken(shalldnParser.SENTENCE_STOP, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_ul_element; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterUl_element) {
			listener.enterUl_element(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitUl_element) {
			listener.exitUl_element(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitUl_element) {
			return visitor.visitUl_element(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UlContext extends ParserRuleContext {
	public ul_element(): Ul_elementContext[];
	public ul_element(i: number): Ul_elementContext;
	public ul_element(i?: number): Ul_elementContext | Ul_elementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Ul_elementContext);
		} else {
			return this.getRuleContext(i, Ul_elementContext);
		}
	}
	public implmnt_ind(): Implmnt_indContext[];
	public implmnt_ind(i: number): Implmnt_indContext;
	public implmnt_ind(i?: number): Implmnt_indContext | Implmnt_indContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Implmnt_indContext);
		} else {
			return this.getRuleContext(i, Implmnt_indContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_ul; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterUl) {
			listener.enterUl(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitUl) {
			listener.exitUl(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitUl) {
			return visitor.visitUl(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SentenceContext extends ParserRuleContext {
	public CAP_WORD(): TerminalNode { return this.getToken(shalldnParser.CAP_WORD, 0); }
	public SENTENCE_STOP(): TerminalNode { return this.getToken(shalldnParser.SENTENCE_STOP, 0); }
	public phrase(): PhraseContext[];
	public phrase(i: number): PhraseContext;
	public phrase(i?: number): PhraseContext | PhraseContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PhraseContext);
		} else {
			return this.getRuleContext(i, PhraseContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_sentence; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterSentence) {
			listener.enterSentence(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitSentence) {
			listener.exitSentence(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitSentence) {
			return visitor.visitSentence(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RequirementContext extends ParserRuleContext {
	public BOLDED_ID(): TerminalNode { return this.getToken(shalldnParser.BOLDED_ID, 0); }
	public CAP_WORD(): TerminalNode { return this.getToken(shalldnParser.CAP_WORD, 0); }
	public phrase(): PhraseContext[];
	public phrase(i: number): PhraseContext;
	public phrase(i?: number): PhraseContext | PhraseContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PhraseContext);
		} else {
			return this.getRuleContext(i, PhraseContext);
		}
	}
	public SHALL(): TerminalNode { return this.getToken(shalldnParser.SHALL, 0); }
	public plain_phrase(): Plain_phraseContext {
		return this.getRuleContext(0, Plain_phraseContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_requirement; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterRequirement) {
			listener.enterRequirement(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitRequirement) {
			listener.exitRequirement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitRequirement) {
			return visitor.visitRequirement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DocumentContext extends ParserRuleContext {
	public title(): TitleContext {
		return this.getRuleContext(0, TitleContext);
	}
	public EOF(): TerminalNode { return this.getToken(shalldnParser.EOF, 0); }
	public heading(): HeadingContext[];
	public heading(i: number): HeadingContext;
	public heading(i?: number): HeadingContext | HeadingContext[] {
		if (i === undefined) {
			return this.getRuleContexts(HeadingContext);
		} else {
			return this.getRuleContext(i, HeadingContext);
		}
	}
	public requirement(): RequirementContext[];
	public requirement(i: number): RequirementContext;
	public requirement(i?: number): RequirementContext | RequirementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RequirementContext);
		} else {
			return this.getRuleContext(i, RequirementContext);
		}
	}
	public sentence(): SentenceContext[];
	public sentence(i: number): SentenceContext;
	public sentence(i?: number): SentenceContext | SentenceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SentenceContext);
		} else {
			return this.getRuleContext(i, SentenceContext);
		}
	}
	public ul(): UlContext[];
	public ul(i: number): UlContext;
	public ul(i?: number): UlContext | UlContext[] {
		if (i === undefined) {
			return this.getRuleContexts(UlContext);
		} else {
			return this.getRuleContext(i, UlContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return shalldnParser.RULE_document; }
	// @Override
	public enterRule(listener: shalldnListener): void {
		if (listener.enterDocument) {
			listener.enterDocument(this);
		}
	}
	// @Override
	public exitRule(listener: shalldnListener): void {
		if (listener.exitDocument) {
			listener.exitDocument(this);
		}
	}
	// @Override
	public accept<Result>(visitor: shalldnVisitor<Result>): Result {
		if (visitor.visitDocument) {
			return visitor.visitDocument(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}



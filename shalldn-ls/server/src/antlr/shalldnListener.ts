// Generated from ../../shalldn.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { WordContext } from "./shalldnParser";
import { Plain_phraseContext } from "./shalldnParser";
import { Italiced_phraseContext } from "./shalldnParser";
import { Nota_beneContext } from "./shalldnParser";
import { Bolded_phraseContext } from "./shalldnParser";
import { Def_drctContext } from "./shalldnParser";
import { Def_revContext } from "./shalldnParser";
import { PhraseContext } from "./shalldnParser";
import { TitleContext } from "./shalldnParser";
import { HeadingContext } from "./shalldnParser";
import { Implmnt_indContext } from "./shalldnParser";
import { Ul_elementContext } from "./shalldnParser";
import { UlContext } from "./shalldnParser";
import { SentenceContext } from "./shalldnParser";
import { RequirementContext } from "./shalldnParser";
import { DocumentContext } from "./shalldnParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `shalldnParser`.
 */
export interface shalldnListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `shalldnParser.word`.
	 * @param ctx the parse tree
	 */
	enterWord?: (ctx: WordContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.word`.
	 * @param ctx the parse tree
	 */
	exitWord?: (ctx: WordContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.plain_phrase`.
	 * @param ctx the parse tree
	 */
	enterPlain_phrase?: (ctx: Plain_phraseContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.plain_phrase`.
	 * @param ctx the parse tree
	 */
	exitPlain_phrase?: (ctx: Plain_phraseContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.italiced_phrase`.
	 * @param ctx the parse tree
	 */
	enterItaliced_phrase?: (ctx: Italiced_phraseContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.italiced_phrase`.
	 * @param ctx the parse tree
	 */
	exitItaliced_phrase?: (ctx: Italiced_phraseContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.nota_bene`.
	 * @param ctx the parse tree
	 */
	enterNota_bene?: (ctx: Nota_beneContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.nota_bene`.
	 * @param ctx the parse tree
	 */
	exitNota_bene?: (ctx: Nota_beneContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.bolded_phrase`.
	 * @param ctx the parse tree
	 */
	enterBolded_phrase?: (ctx: Bolded_phraseContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.bolded_phrase`.
	 * @param ctx the parse tree
	 */
	exitBolded_phrase?: (ctx: Bolded_phraseContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.def_drct`.
	 * @param ctx the parse tree
	 */
	enterDef_drct?: (ctx: Def_drctContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.def_drct`.
	 * @param ctx the parse tree
	 */
	exitDef_drct?: (ctx: Def_drctContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.def_rev`.
	 * @param ctx the parse tree
	 */
	enterDef_rev?: (ctx: Def_revContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.def_rev`.
	 * @param ctx the parse tree
	 */
	exitDef_rev?: (ctx: Def_revContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.phrase`.
	 * @param ctx the parse tree
	 */
	enterPhrase?: (ctx: PhraseContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.phrase`.
	 * @param ctx the parse tree
	 */
	exitPhrase?: (ctx: PhraseContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.title`.
	 * @param ctx the parse tree
	 */
	enterTitle?: (ctx: TitleContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.title`.
	 * @param ctx the parse tree
	 */
	exitTitle?: (ctx: TitleContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.heading`.
	 * @param ctx the parse tree
	 */
	enterHeading?: (ctx: HeadingContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.heading`.
	 * @param ctx the parse tree
	 */
	exitHeading?: (ctx: HeadingContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.implmnt_ind`.
	 * @param ctx the parse tree
	 */
	enterImplmnt_ind?: (ctx: Implmnt_indContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.implmnt_ind`.
	 * @param ctx the parse tree
	 */
	exitImplmnt_ind?: (ctx: Implmnt_indContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.ul_element`.
	 * @param ctx the parse tree
	 */
	enterUl_element?: (ctx: Ul_elementContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.ul_element`.
	 * @param ctx the parse tree
	 */
	exitUl_element?: (ctx: Ul_elementContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.ul`.
	 * @param ctx the parse tree
	 */
	enterUl?: (ctx: UlContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.ul`.
	 * @param ctx the parse tree
	 */
	exitUl?: (ctx: UlContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.sentence`.
	 * @param ctx the parse tree
	 */
	enterSentence?: (ctx: SentenceContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.sentence`.
	 * @param ctx the parse tree
	 */
	exitSentence?: (ctx: SentenceContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.requirement`.
	 * @param ctx the parse tree
	 */
	enterRequirement?: (ctx: RequirementContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.requirement`.
	 * @param ctx the parse tree
	 */
	exitRequirement?: (ctx: RequirementContext) => void;

	/**
	 * Enter a parse tree produced by `shalldnParser.document`.
	 * @param ctx the parse tree
	 */
	enterDocument?: (ctx: DocumentContext) => void;
	/**
	 * Exit a parse tree produced by `shalldnParser.document`.
	 * @param ctx the parse tree
	 */
	exitDocument?: (ctx: DocumentContext) => void;
}


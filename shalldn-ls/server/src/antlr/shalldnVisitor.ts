// Generated from ../../shalldn.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `shalldnParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface shalldnVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `shalldnParser.word`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWord?: (ctx: WordContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.plain_phrase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPlain_phrase?: (ctx: Plain_phraseContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.italiced_phrase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitItaliced_phrase?: (ctx: Italiced_phraseContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.nota_bene`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNota_bene?: (ctx: Nota_beneContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.bolded_phrase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBolded_phrase?: (ctx: Bolded_phraseContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.def_drct`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDef_drct?: (ctx: Def_drctContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.def_rev`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDef_rev?: (ctx: Def_revContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.phrase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPhrase?: (ctx: PhraseContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.title`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTitle?: (ctx: TitleContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.heading`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHeading?: (ctx: HeadingContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.implmnt_ind`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImplmnt_ind?: (ctx: Implmnt_indContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.ul_element`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUl_element?: (ctx: Ul_elementContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.ul`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUl?: (ctx: UlContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.sentence`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSentence?: (ctx: SentenceContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.requirement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRequirement?: (ctx: RequirementContext) => Result;

	/**
	 * Visit a parse tree produced by `shalldnParser.document`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDocument?: (ctx: DocumentContext) => Result;
}


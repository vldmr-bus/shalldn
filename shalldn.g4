grammar shalldn;

WHITESPACE : (' ' |'\t'|'\r')+? -> skip;
fragment WORD_CHAR: [a-zA-Z_0-9];
fragment CAPITAL_CHAR: [A-Z];


STAR: '*';
MINUS: '-';
UL: '_';
COMMA: ',';
HASH: '#';
SEMI:';';
QUOTED_FRAGMENT: '"' .+? '"'|'\'' .+? '\'';
IDENTIFIER : WORD ('.' WORD)+ ; // *(see identifier)*
WORD: WORD_CHAR+;
SHALL: (STAR STAR 'shall' STAR STAR| UL UL 'shall' UL UL) ;
NB: '*(n.b.)*';
URL: [hH][tT][tT][pP][sS]? '://' [a-zA-Z0-9._\-]+ ;

bolded_id: (STAR STAR IDENTIFIER STAR STAR | UL UL IDENTIFIER UL UL) ;
sentence_stop: '.'|';'|'!';
punctuation: ','|'_'|'-'|':'|'('|')'|'['|']'|'/';
plain_phrase:( WORD|IDENTIFIER | QUOTED_FRAGMENT | punctuation | URL)+;
italiced_phrase: (STAR plain_phrase STAR|HASH plain_phrase HASH);
nota_bene: italiced_phrase NB;
bolded_phrase: (STAR STAR plain_phrase STAR STAR|HASH HASH plain_phrase HASH HASH);
def_drct: subject = italiced_phrase '*(i.e.' body = phrase ')*';
def_rev: body = italiced_phrase '*(' subject = phrase ')*' ;
phrase: plain_phrase|italiced_phrase|bolded_phrase|nota_bene|def_drct|def_rev;

// $$Implements Parser.DOC_Subject
title: '#' phrase* subject = italiced_phrase WORD* ~'\n'? ;
heading: '\n'*HASH+ phrase+ '\n';
// $$Implements Parser.IMPLMNT
implmnt: '\n'+(STAR)+'Implements' ((bolded_id (',' bolded_id)*) |bolded_phrase) sentence_stop? ;
ul_element: '\n'+(STAR)+ phrase sentence_stop? ;
ul: (ul_element|implmnt)+;
// $$Implements Parser.RQ_statement, Parser.ERR_No_RQ_ID, Parser.ERR_DUP_SHALL
requirement: bolded_id '\n'* pre = phrase+ SHALL post = phrase+ '.''\n';
sentence: phrase+ ('.'|ul);
document: title (heading|requirement|sentence|ul|'\n'+)+ EOF;

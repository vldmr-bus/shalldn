grammar shalldn;

WHITESPACE : (' ' |'\t'|'\r')+? -> skip;
fragment WORD_CHAR: [a-zA-Z_0-9];
fragment DIGIT:[0-9];
fragment CAPITAL_CHAR: [A-Z];

NL: '\n';
DSTAR: '**';
STAR: '*';
DUL: '__';
UL: '_';
MINUS: '-';
COMMA: ',';
HASH: '#';
SEMI:';';
QUOTED_FRAGMENT: '"' ~["\n]+? '"'|'\'' ~['\n]+? '\'';
CODE_FRAGMENT: '`' ~[`\n]+? '`';
CODE_BLOCK: '```' .+? '```';
NUMBER: [0-9]+ ('.' [0-9]+)? ;
WORD: WORD_CHAR+;
IDENTIFIER : WORD ('.' WORD)+ ; // *(see identifier)*
SHALL: ('**' 'shall' '**'| '__' 'shall' '__') ;
NB: '*(n.b.)*';
URL: [hH][tT][tT][pP][sS]? '://' [a-zA-Z0-9.&?/_\-+=]+ ;

tag: '$' id=WORD (':' value=~'\n'+ )?;
bolded_id: ('**' (WORD|IDENTIFIER) '**' | '__' (WORD|IDENTIFIER) '__') ;
sentence_stop: '.'|';'|'!'|'?';
punctuation: ','|'_'|'-'|'+'|':'|'('|')'|'['|']'|'{'|'}'|'/'|'$'|'<'|'>'|'='|'&'|'\''|'@'|'#'|'“'|'”'|'‘'|'’'|'–';
plain_phrase:( WORD|IDENTIFIER|NUMBER | QUOTED_FRAGMENT | CODE_FRAGMENT | URL) ( WORD|IDENTIFIER|NUMBER | QUOTED_FRAGMENT | punctuation | URL)*;
italiced_phrase: (STAR plain_phrase STAR|UL plain_phrase UL);
nota_bene: italiced_phrase NB;
bolded_phrase: ('**' plain_phrase '**'|'__' plain_phrase '__');
def_drct: subject = italiced_phrase ('*(i.e.' body = phrase ')*'|'_(i.e.' body = phrase ')_');
def_rev: body = italiced_phrase ('*(' subject = phrase ')*'|'_(' subject = phrase ')_') ;
phrase: (plain_phrase|italiced_phrase|bolded_phrase|nota_bene|def_drct|def_rev|punctuation)+;

// $$Implements Parser.DOC_Subject, Parser.TAGGED_VALUE_RQ
title: '#'? phrase* subject = italiced_phrase WORD* list? ;
hashes: HASH+;
heading: '\n'*hashes phrase list?;
// $$Implements Parser.RQ_statement, Parser.ERR_No_RQ_ID, Parser.ERR_DUP_SHALL, Parser.TAGGED_RQ
requirement: ( tag+ '\n'* )* bolded_id '\n'* pre = phrase SHALL post = phrase ('.'|':') list?;
// $$Implements Parser.IMPLMNT
implmnt: STAR 'Implements' ((bolded_id (',' bolded_id)*) |bolded_phrase) sentence_stop? ;
l_element: sentence* (phrase ':')? ;
ul_element: STAR l_element ;
ol_element: NUMBER '.'? l_element ;
list: ('\n'+(ul_element|ol_element|implmnt))+;
sentence: phrase sentence_stop;
document: '\n'* title (heading|requirement|sentence|CODE_BLOCK|(phrase ':'|heading)? list|'\n'+)+ EOF;

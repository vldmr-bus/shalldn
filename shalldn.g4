grammar shalldn;

WHITESPACE : (' ' |'\t'|'\r')+? -> skip;
fragment WORD_CHAR: [a-zA-Z_0-9];
fragment CAPITAL_CHAR: [A-Z];
WORD: WORD_CHAR+;


PUNCTUATION: ','|'_'|'-'|'('|')';
STAR: '*';
MINUS: '-';
UL: '_';
HASH: '#';
QUOTED_FRAGMENT: '"' .+? '"'|'\'' .+? '\'';
IDENTIFIER : WORD ('.' WORD)+ ; // *(see identifier)*
SENTENCE_STOP: '.'|';'|'!';
SHALL: (STAR STAR 'shall' STAR STAR| UL UL 'shall' UL UL) ;
NB: '*(n.b.)*';
BOLDED_ID: (STAR STAR IDENTIFIER STAR STAR | UL UL IDENTIFIER UL UL) ;

plain_phrase:(WORD | QUOTED_FRAGMENT | PUNCTUATION)+;
italiced_phrase: (STAR plain_phrase STAR|HASH plain_phrase HASH);
nota_bene: italiced_phrase NB;
bolded_phrase: (STAR STAR plain_phrase STAR STAR|HASH HASH plain_phrase HASH HASH);
def_drct: subject = italiced_phrase '*(i.e.' body = phrase ')*';
def_rev: body = italiced_phrase '*(' subject = phrase ')*' ;
phrase: plain_phrase|italiced_phrase|bolded_phrase|nota_bene|def_drct|def_rev;

//$$ Parser.DOC_Subject
title: '#' phrase* subject = italiced_phrase WORD* ~'\n'? ;
heading: '\n'*HASH+ phrase+ '\n';
implmnt_ind: '\n'+(STAR)+'Implements' plain_phrase? id = bolded_phrase plain_phrase?  SENTENCE_STOP? ;
ul_element: '\n'+(STAR)+ phrase SENTENCE_STOP? ;
ul: (ul_element|implmnt_ind)+;
//$$ Parser.RQ_statement Parser.ERR_No_RQ_ID
requirement: BOLDED_ID '\n'* pre = phrase+ SHALL post = phrase+ '.''\n';
sentence: phrase+ '.';
document: title (heading|requirement|sentence|ul|'\n'+)+ EOF;

grammar shalldn;

WHITESPACE : (' ' |'\t')+ -> skip;
fragment WORD_CHAR: [a-zA-Z_0-9];
fragment CAPITAL_CHAR: [A-Z];


STAR: '*';
MINUS: '-';
UL: '_';
HASH: '#';
CAP_WORD: (CAPITAL_CHAR WORD_CHAR*);
QUOTED_FRAGMENT: '"' .+ '"'|'\'' .+ '\'';
WORD: WORD_CHAR+;
IDENTIFIER : WORD ('.' WORD)+ ; // *(see identifier)*
SENTENCE_STOP: '.'|';'|'!';
PUNCTUATION: ','|'_'|'-'|'('|')';
SHALL: (STAR STAR 'shall' STAR STAR| UL UL 'shall' UL UL) ;
NB: '*(n.b.)*';
word: WORD|CAP_WORD;
BOLDED_ID: (STAR STAR IDENTIFIER STAR STAR | UL UL IDENTIFIER UL UL) ;

plain_phrase: word (word | QUOTED_FRAGMENT | PUNCTUATION)*;
italiced_phrase: (STAR plain_phrase STAR|HASH plain_phrase HASH);
nota_bene: italiced_phrase NB;
bolded_phrase: (STAR STAR plain_phrase STAR STAR|HASH HASH plain_phrase HASH HASH);
def_drct: subject = italiced_phrase '*(i.e.' body = phrase ')*';
def_rev: body = italiced_phrase '*(' subject = phrase ')*' ;
phrase: (plain_phrase|italiced_phrase|bolded_phrase|nota_bene|def_drct|def_rev)+;

title: '#' CAP_WORD word* subject = italiced_phrase word* ~'\n'? ;
heading: '\n'*(HASH+) phrase '\n';
implmnt_ind: '\n'+(STAR)+'Implements' plain_phrase? id = bolded_phrase plain_phrase?  SENTENCE_STOP? ;
ul_element: '\n'+(STAR)+ phrase SENTENCE_STOP? ;
ul: (ul_element|implmnt_ind)+;
sentence: CAP_WORD phrase* SENTENCE_STOP;
requirement: BOLDED_ID '\n'* CAP_WORD phrase* phrase SHALL plain_phrase phrase+ '.\n';

document: title (heading |requirement|sentence|ul|'\n'+)+ EOF;

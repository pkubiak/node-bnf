node-bnf
========

Node.js parser for context-free grammars in Backus-Naur Form 

### Concept ###

node-bnf provide class Parser. In constructor it takes string containing context-free grammar in Backus-Naur Form
(http://en.wikipedia.org/wiki/Backus–Naur_Form) or object containing context-free grammar in node-bnf form (described later). Instance of Parser class has following abilities:

* `structure` field - containing structure of cfg described by this parser.
* `match` method - this method takes string and return its parse tree if it exists or null. This methods convert cfg in to chomsky normal form and then execute CYK algorithm (http://en.wikipedia.org/wiki/CYK_algorithm).


### Internal Structure ###

### Parse Tree Structure ###

### Example BNF ###

Context-Free Grammar describing grammar of Backus-Naur Form texts:

```
<syntax>         ::= <rule> | <rule> <syntax>
<rule>           ::= <opt-whitespace> "<" <rule-name> ">" <opt-whitespace> "::=" <opt-whitespace> <expression> <line-end>
<opt-whitespace> ::= " " <opt-whitespace> | ""
<expression>     ::= <list> | <list> "|" <expression>
<line-end>       ::= <opt-whitespace> <EOL> | <line-end> <line-end>
<list>           ::= <term> | <term> <opt-whitespace> <list>
<term>           ::= <literal> | "<" <rule-name> ">"
<literal>        ::= '"' <text> '"' | "'" <text> "'"
```

### Example usage ###
```
var Parser = require('bnf').Parser;

var p = new Parser('<string> ::= "a" | "a" <string>');

console.log(p.structure); // print structure of given cfg (this structure is frozen!)

console.log(p.match('aaaaaaaa')); // return parse tree for this text

console.log(p.match('aaaab')); // return null <- this text doesn't belong to given cfg
```
### Links ###

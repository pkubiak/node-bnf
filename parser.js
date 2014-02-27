var fs = require('fs'), assert = require('assert');

function parse(text){
	assert(typeof(text) == 'string', 'Input text must be a string');
	var tokenTest = /^<[-0-9a-z]+>$/;
	var ruleTest = /^[ ]*<([-0-9a-z]+)>[ ]*::=(.+)$/;
	
	
	var lines = text.split('\n'), state = 0;
	var cfg = {}, lastToken, rules;
	
	/* Rule must be serie of strings ("...") and/or tokens (<...>) */
	
	parseRules = function(text, line){
		var rules = [];
		
		console.log("|"+text+"|");
		var tokens = [];
		
		//assert(rules[j].trim() != "", 'Rule cannot be empty: '+line);
		var state = 0;//0-none, 1-in string, 2-in token
		var lastChar = undefined, c = undefined;
		var token = [];
		
		for(var i=0;i<text.length;i++){
			lastChar = c;
			c = text[i];
			
			if(state == 0){
				if(c == ' ')
					continue;
				else if(c=='"')
					state = 1;
				else if(c=="'")
					state = 3;
				else if(c=='<'){
					token = [];
					state = 2;
				}else if(c=='|'){
					assert(tokens.length > 0, "Empty rule");
					
					rules.push(tokens);
					tokens = [];
				}else throw "Rule parse error";
			}else
			if(state == 1){
				if(c == '"'){
					if(lastChar == '\\')
						tokens.push('"');
					else
						state = 0;
				}else
					tokens.push(c);
			}else
			if(state == 3){
				if(c == "'"){
					if(lastChar == '\\')
						tokens.push("'");
					else
						state = 0;
				}else
					tokens.push(c);
			}else
			if(state == 2){
				if(c == '>'){
					assert(token.length > 0, "Token can not be empty");
					tokens.push('_'+token.join(''));
					state = 0;
				}else
				if((c>='a' && c<='z') || c=='-')
					token.push(c);
				else
					throw "Illegal char in token";
			}
		}
		assert(state == 0, "Unclosed rule");
		if(tokens.length>0)
			rules.push(tokens);
		
		
		assert(rules.length > 0, "There is no rule");
		
		return rules;
	}
	
	
	for(var i=0;i<lines.length;i++){
		//console.log("Line: "+i +"; state = "+state);
		var l = lines[i].toLowerCase().trim();
		if(state == 0){
			if(l == '')
				continue;
			var x = ruleTest.exec(l);
			
			assert(x , 'malformed rule definition :'+i);
			
			var lastToken = x[1].trim();
			rules = x[2].trim();
			
			//console.log(rules);

			if(!(lastToken in cfg))
				cfg[lastToken] = [];
			
			//console.log(rules.length, rules);
			
			if(rules.length == 1 && rules[0].trim()==''){
				state = 1
				continue;
			}
		}else
		if(state == 1)
			rules = l;
		
		state = 0;
		var rules = parseRules(rules.trim(), i);
		
		for(var j=0;j<rules.length;j++)
			cfg[lastToken].push(rules[j]);
	}
	
	assert(state == 0, "Missing ending rule");
	return cfg;	
}


var test = fs.readFileSync('test2.bnf', 'utf-8');
console.log(test);

var bnf = parse(test);
console.log(bnf);


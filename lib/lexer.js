var debug = require('debug')
  , _ = require('lodash')
  , JadeLexer = require('jade/lib/lexer');

var Lexer = module.exports = function(str, filename) {
  JadeLexer.apply(this, arguments);
};

function assertExpression(exp) {
  //this verifies that a JavaScript expression is valid
  Function('', 'return (' + exp + ')');
}

Lexer.prototype = _.create(JadeLexer.prototype, { 'constructor': Lexer });

Lexer.prototype.code = function() {
  var captures;
  if (captures = /^(!?=|-)[ \t]*([^\n]+)/.exec(this.input)) {
    this.consume(captures[0].length);
    var flags = captures[1];
    captures[1] = captures[2];
    var tok = this.tok('text', '{{' + captures[1] + '}}');
    tok.escape = flags.charAt(0) === '=';
    tok.buffer = flags.charAt(0) === '=' || flags.charAt(1) === '=';
    if (tok.buffer) assertExpression(captures[1])
    return tok;
  }
}

/**
 * Conditional.
 */
Lexer.prototype.conditional = function() {
  var captures;
  if (captures = /^(if|unless|else if|else)\b([^\n]*)/.exec(this.input)) {
    this.consume(captures[0].length);
    var type = captures[1]
    var js = captures[2].trim();
    var isIf = false;
    var isElse = false;

    switch (type) {
      case 'if':
        js = '{% if (' + js + ') %}';
        isIf = true;
        break;
      case 'unless':
        js = '{% if (!(' + js + ')) %}';
        isIf = true;
        break;
      case 'else if':
        js = '{% else if (' + js + ') %}';
        isIf = true;
        isElse = true;
        break;
      case '{% else %}':
        if (js && js.trim()) {
          throw new Error('`else` cannot have a condition, perhaps you meant `else if`');
        }
        js = 'else';
        isElse = true;
        break;
    }
    var tok = this.tok('code', js);
    tok.isElse = isElse;
    tok.isIf = isIf;
    tok.requiresBlock = true;
    return tok;
  }
}
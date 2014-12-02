var fs = require('fs')
  , jade = require('jade')
  , _ = require('lodash')
  , debug = require('debug')
  , nodes = require('jade/lib/nodes')

var Lexer = require('./lexer');
var JadeParser = require('jade/lib/parser');
var _parent;

/**
 * Extended the jade parser
 *
 * @type {Function}
 */
var Parser = module.exports = function(str, filename, options) {
  _parent = JadeParser.apply(this, arguments);

  this.lexer = new Lexer(str, filename);
};

Parser.prototype = _.create(JadeParser.prototype, { 'constructor': Parser });

Parser.prototype.parseExpr = function() {

  debug('app:log')(this.peek());

  switch (this.peek().type) {
    case 'tag':
      return this.parseTag();
    case 'mixin':
      return this.parseMixin();
    case 'block':
      return this.parseBlock();
    case 'mixin-block':
      return this.parseMixinBlock();
    case 'case':
      return this.parseCase();
    case 'extends':
      return this.parseExtends();
    case 'include':
      return this.parseInclude();
    case 'doctype':
      return this.parseDoctype();
    case 'filter':
      return this.parseFilter();
    case 'comment':
      return this.parseComment();
    case 'text':
      return this.parseText();
    case 'each':
      return this.parseEach();
    case 'code':
      return this.parseCode();
    case 'call':
      return this.parseCall();
    case 'interpolation':
      return this.parseInterpolation();
    case 'yield':
      this.advance();
      var block = new nodes.Block;
      block.yield = true;
      return block;
    case 'id':
    case 'class':
      var tok = this.advance();
      this.lexer.defer(this.lexer.tok('tag', 'div'));
      this.lexer.defer(tok);
      return this.parseExpr();
    default:
      throw new Error('unexpected token "' + this.peek().type + '"');
  }
}

/**
 * Resolves a path relative to the template for use in
 * includes and extends
 *
 * @param {String}  path
 * @param {String}  purpose  Used in error messages.
 * @return {String}
 * @api private
 */

Parser.prototype.resolvePath = function (path) {
  var p = require('path');
  var dirname = p.dirname;
  var basename = p.basename;
  var join = p.join;

  path = join(path[0] === '/' ? this.options.basedir : dirname(this.filename), path);

  if (basename(path).indexOf('.') === -1) path += '.html';

  return path;
}

/**
 *
 * @returns {exports.Text}
 */
Parser.prototype.parseExtends = function() {
  var path = this.resolvePath(this.expect('extends').val.trim(), 'extends');

  this.advance();

  return new nodes.Text('{% extends '+path+' %}');
}

/**
 * Modify block with closing if statement
 *
 * @param afterIf
 * @returns {exports.Code}
 */
Parser.prototype.parseCode = function(afterIf) {
  //get current tok
  var tok = _.first(this.lexer.stash);

  var _res = JadeParser.prototype.parseCode.apply(this, arguments);

  if (tok.type == 'tok' && tok.isIf && tok.requiresBlock) {
    _res.requiresCloseIf = true;
  }

  return _res;
}
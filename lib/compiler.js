var debug = require('debug')
  , _ = require('lodash')
  , JadeCompiler = require('jade/lib/compiler');

/**
 * Extended the jade parser
 *
 * @type {Function}
 */
var Compiler = module.exports = function(node, options) {
  JadeCompiler.apply(this, arguments);
};

Compiler.prototype = _.create(JadeCompiler.prototype, { 'constructor': Compiler });


/**
 * Visit `code`, respecting buffer / escape flags.
 * If the code is followed by a block, wrap it in
 * a self-calling function.
 *
 * @param {Code} code
 * @api public
 */
Compiler.prototype.visitCode = function(code) {
  this.buf.push(code.val);

  // Block support
  if (code.block) {
    this.visit(code.block);
  }

  if (code.requiresCloseIf) {
    this.buf.push('{% endif %}');
  }
}

/**
 * Visit `each` block.
 *
 * @param {Each} each
 * @api public
 */
Compiler.prototype.visitEach = function(each) {
  this.buf.push('{% for '+each.val+' in '+each.obj+' %}');

  this.visit(each.block);

  this.buf.push('{% endfor %}');
}
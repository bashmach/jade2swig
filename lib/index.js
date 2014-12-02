var jade = require('jade')
  , debug = require('debug')
  , Parser = require('./parser')
  , Compiler = require('./compiler');

module.exports = function(str, callback) {
  var parser = new Parser(str);

  var root = parser.parse();

  debug('app:log')(root);

  var compiler = new Compiler(root);
  var result = compiler.compile();

  debug('app:log')(result);

  callback(result);
}
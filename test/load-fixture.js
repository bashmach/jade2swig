var fs = require('fs');

module.exports = function(fixtureName, format) {
  return fs.readFileSync('./test/fixture/'+fixtureName+'/view.'+format).toString('utf-8');
};
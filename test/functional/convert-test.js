var mocha = require('mocha')
  , assert = require('chai').assert
  , jade2swig =  require('../../lib')
  , loadFixture = require('../load-fixture');

describe('Convert jade template to swig', function() {
  it('should be able to convert simple jade template', function(done) {
    var fixtureName = 'flash-messages';

    var jadeTemplate = loadFixture(fixtureName, 'jade')
      , htmlTemplate = loadFixture(fixtureName, 'html')

    jade2swig(jadeTemplate, function(actualResult) {
      assert.equal(actualResult, htmlTemplate, 'Converted string is not equal to the reference of `simple` fixture');

      done();
    });

  })
});
var mocha = require('mocha')
  , assert = require('chai').assert
  , loadFixture = require('../load-fixture')
  , fs = require('fs');

describe('Fixture manager', function() {
  var parser;

  describe('#load', function(done) {
    it("should be loaded content of jade template file", function (done) {
      assert.equal(
        loadFixture('simple', 'jade'),
        fs.readFileSync('test/fixture/simple/view.jade').toString('utf-8'),
        'Incorrect fixture loaded.'
      );

      done();
    });

    it("should be loaded content of html template file", function (done) {
      assert.equal(
        loadFixture('simple', 'html'),
        fs.readFileSync('test/fixture/simple/view.html').toString('utf-8'),
        'Incorrect fixture loaded.'
      );

      done();
    });
  });
});
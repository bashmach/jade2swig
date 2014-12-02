var mocha = require('mocha')
  , assert = require('chai').assert
  , debug = require('debug')
  , _ = require('lodash')
  , loadFixture = require('../load-fixture')
  , Parser = require('../../lib/parser');

describe('Parser', function() {

  beforeEach(function(done) {
    done();
  });

  afterEach(function(done) {
    done();
  })

  describe('#parse', function(done) {
    it("should be 2 parent nodes in template", function (done) {
      var fixture = loadFixture('simple', 'jade');
      var parser = new Parser(fixture);

      assert.equal(
        parser.parse().nodes.length,
        2,
        'Simple fixture doesn\'t have 2 parent nodes'
      );

      done();
    });

    it("should be 1 child in parent node", function (done) {
      var fixture = loadFixture('simple-with-one-child', 'jade');
      var parser = new Parser(fixture);
      assert.equal(
        parser.parse().nodes[0].block.nodes.length,
        1
      );

      done();
    });

    it("should be 1 block 'content'", function (done) {
      var fixture = loadFixture('view-with-one-block', 'jade');
      var parser = new Parser(fixture);

      var contentBlock = parser.parse().nodes[0];

      assert.ok(contentBlock.parser, 'First node should be a block');
      assert.equal(contentBlock.name, 'content');

      done();
    });

    it("should be 2 blocks 'content' and 'footer'", function (done) {
      var fixture = loadFixture('view-with-multiple-blocks', 'jade');
      var parser = new Parser(fixture);
      var root = parser.parse();

      assert.ok(root.nodes[0].parser);
      assert.ok(root.nodes[1].parser);

      assert.equal(root.nodes[0].name, 'content');
      assert.equal(root.nodes[1].name, 'footer');

      done();
    });
  });
});
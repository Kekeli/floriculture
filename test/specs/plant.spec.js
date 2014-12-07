/* jshint unused:false */

'use strict'

var Plant = require('../../app/models/plant'),
  should = require('chai').should();

/**
 * Plant unit tests
 */
describe('Plant model', function() {
  describe('defaults', function() {

    var plant = {};

    before(function(done) {
      plant = new Plant({Family : 'woody'});
      done();
    });

    it('Family is woody', function(done) {

      // var aa = 'a';
      // aa.should.equal('a');
      plant.should.have.property('Family', 'woody');
      done();
    });

  });
});

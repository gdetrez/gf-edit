'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('GFAce.services'));


  describe('version', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });

  describe('backend', function() {
    it('should contain 2 files', inject(function(backend){
      expect(backend.files['MyAbstract.gf']).not.toBe(null);
      expect(backend.files['MyConcrete.gf']).not.toBe(null);
    }));
  });
});

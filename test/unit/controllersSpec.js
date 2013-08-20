'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('controllers'));

  it('should ....', inject(function() {
    //spec body
  }));

  describe('Editor controllers', function() {
    describe('EditorCtrl', function(){
      it('hould create "files" model with 2 files', inject(function($rootScope, $controller) {
        //spec body
        var scope = $rootScope.$new(),
            ctrl = $controller("EditorCtrl", {$scope: scope });
        expect(scope.data['MyAbstract.gf']).not.toBe(null);
        expect(scope.data['MyConcrete.gf']).not.toBe(null);
      }));
    });
  });
});

'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('GFAce.controllers'));

  describe('Editor controllers', function() {
    describe('EditorCtrl', function(){
      it('should pick the right file from the backend', inject(function($rootScope, $controller) {
        var mockBackend = {
          files: {
            'MyAbstract.gf':
              'abstract MyAbstract = {\n  cat Greeting ;\n}',
            'MyConcrete.gf':
            'concrete MyContrete of MyAbstract = {\n  lincat Greeting = str ;\n  lin hi = \"Hello world!\" ;\n}'
          },
          ls: function() { return ['MyAbstract.gf','MyConcrete.gf']; }
        };
        //spec body
        var scope = $rootScope.$new(),
            ctrl = $controller("EditorCtrl", {
              $scope: scope,
              $routeParams: {file: 'MyAbstract.gf'},
              backend: mockBackend
            });
        expect(scope.currentFile).toBe('MyAbstract.gf');
        expect(scope.tabs).toEqual([ 'MyAbstract.gf', 'MyConcrete.gf' ]);
      }));
    });
  });
});

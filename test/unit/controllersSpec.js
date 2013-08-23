'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(module('GFAce.controllers'));

//  describe('Editor controllers', function() {
//    describe('EditorCtrl', function(){
//      it('should pick the right file from the backend', inject(function($rootScope, $controller) {
//        var mockBackend = {
//          files: {
//            'MyAbstract.gf':
//              'abstract MyAbstract = {\n  cat Greeting ;\n}',
//            'MyConcrete.gf':
//            'concrete MyContrete of MyAbstract = {\n  lincat Greeting = str ;\n  lin hi = \"Hello world!\" ;\n}'
//          },
//          ls: function() { return ['MyAbstract.gf','MyConcrete.gf']; }
//        };
//        //spec body
//        var scope = $rootScope.$new(),
//            ctrl = $controller("EditorCtrl", {
//              $scope: scope,
//              $routeParams: {file: 'MyAbstract.gf'},
//              backend: mockBackend
//            });
//        expect(scope.currentFile).toBe('MyAbstract.gf');
//        expect(scope.tabs).toEqual([ 'MyAbstract.gf', 'MyConcrete.gf' ]);
//      }));
//    });
//  });

  // ~~~ Navbar controller ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  describe('Navbar controller', function() {
    var NavbarCtrl, gist, $scope;

    beforeEach(inject(function($controller, $rootScope) {
      gist = {};
      gist.getUsername = function() { return "youri"; }
      gist.logout = jasmine.createSpy('gist.logout');
      $scope = $rootScope.$new();
      NavbarCtrl = $controller('NavbarCtrl', {$scope: $scope, gist: gist});
    }));

    it('sets the username to what gist returns', function() {
      expect($scope.username).toEqual("youri");
    });

    it('puts the logout method in the scope', function() {
      $scope.logout();
      expect(gist.logout).toHaveBeenCalled();
    });
  });
});

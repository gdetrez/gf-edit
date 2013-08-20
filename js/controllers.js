'use strict';

/* Controllers */

angular.module('controllers', []).
  controller('EditorCtrl', ['$scope', function($scope) {
    $scope.data = {
      'MyAbstract.gf':
        'abstract MyAbstract = {\n  cat Greeting ;\n}',
      'MyConcrete.gf':
        'concrete MyContrete of MyAbstract = {\n  lincat Greeting = str ;\n  lin hi = \"Hello world!\" ;\n}'
      };
  }])
  .controller('MyCtrl2', [function() {

  }]);

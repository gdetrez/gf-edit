'use strict';

/* Controllers */

angular.module('GFAce.controllers', []).
  controller('EditorCtrl', ['$scope', '$routeParams', 'backend', function($scope, $routeParams, backend) {
    $scope.currentFile = $routeParams.file;
    $scope.backend = backend;
    $scope.tabs = Object.keys(backend.files)
  }])
  .controller('LoginCtrl', [function() {

  }]);

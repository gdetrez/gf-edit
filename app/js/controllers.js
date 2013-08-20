'use strict';

/* Controllers */

angular.module('GFAce.controllers', []).
  controller('EditorCtrl', ['$scope', '$routeParams', 'backend', '$location', function($scope, $routeParams, backend, $location) {
    if ($routeParams.file) {
      $scope.currentFile = $routeParams.file;
      $scope.backend = backend;
      $scope.tabs = backend.ls();
      $scope.save = backend.save;
    } else {
      if (backend.ls().length > 0) {
        $location.path('/editor/' + backend.ls()[0]);
      }
      else
        $location.path('/editor/new');
    }

  }]).
  controller('LoginCtrl', ['$location', function(l) {
    l.path('/start');
  }]).
  controller('StartCtrl', ['$scope', '$http', function($scope,$http) {
    $http.get('https://api.github.com/gists', {params: {access_token: 'bf1fcd95368f34ba2848ded6f14f74bbe5f79725'}}).success(function(data) {
      $scope.gists = data;
      $scope.firstFile = function(_gist) { for (var f in _gist.files) return f; };
    });
  }]).

  controller('OpenCtrl', ['$scope', '$routeParams', '$location', 'backend',
    function($scope, $routeParams, $location, backend, $timeout) {
      backend.open($routeParams.gistid).then(
        // On success
        function() {
          console.log("Success!");
          $location.path("/editor");
        },
        // on reject
        function(reason) {
          $scope.error = reason;
        }
        )
  }]);

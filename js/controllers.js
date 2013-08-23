'use strict';

/* Controllers */

angular.module('GFAce.controllers', []).
  controller('EditorCtrl', ['$scope', '$routeParams', 'backend', '$location', 'gf', function($scope, $routeParams, backend, $location, gf) {
    // First  we make sure that we have the correct gist in the backend
    if ($routeParams.gistid != backend.gistid) {
      $location.path('/open/' + $routeParams.gistid);
    }
    // If a file is specified, we open this file
    if ($routeParams.file) {
      $scope.gistid = $routeParams.gistid;
      $scope.currentFile = $routeParams.file;
      $scope.backend = backend;
      $scope.tabs = backend.ls();
      $scope.save = backend.save;
      $scope.compile = function() {
        $('#buildModal').modal('show');
        gf.make(backend.files).then(
          function(data) {
            console.log(data);
            $scope.buildStatus  = data.data.errorcode;
            $scope.buildCommand = data.data.command;
            $scope.buildOutput  = data.data.output;
          },
          function(reason) {
            $scope.buildStatus = 'Error';
            $scope.buildError  = 'Network error';
            console.log(reason);
          });
      };
    } else {
      if (backend.ls().length > 0) {
        $location.path('/e/' + $routeParams.gistid + '/' + backend.ls()[0]);
      }
      else
        $location.path('/e/' + $routeParams.gistid + '/new');
    }

  }]).
  controller('LoginCtrl', ['$location', 'gist', '$scope', function(l,gist,$scope) {
    if(gist.hasToken())
      l.path('/start');
    $scope.login = function() {
      gist.login($scope.username, $scope.password).then(
        function() {
          l.path('/start');
        },
        function(reason) {
          $scope.error = reason;
        });
    };
  }]).
  controller('StartCtrl', ['$scope', 'gist', function($scope, gist) {
    gist.list().success(function(data) {
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
          $location.path("/e/" + $routeParams.gistid);
        },
        // on reject
        function(reason) {
          $scope.error = reason;
        }
        )
  }]).

  controller('NewCtrl', ['$scope', '$location', 'backend', function($scope, $location, backend) {
    $scope.title = "Creating gist..."
    console.log('Create a grammar');
    backend.create().then(
      // On success
      function(gistid) {
        console.log("Creation succeeded");
        $location.path("/e/" + gistid);
      },
      // on reject
      function(reason) {
        $scope.error = reason;
      }
      )
  }]);

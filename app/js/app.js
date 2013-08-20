'use strict';


// Declare app level module which depends on filters, and services
angular.module('GFAce', ['myApp.filters', 'GFAce.services', 'myApp.directives', 'GFAce.controllers', 'ui.ace']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
    $routeProvider.when('/start', {templateUrl: 'partials/start.html', controller: 'StartCtrl'});
    $routeProvider.when('/open/:gistid',  {templateUrl: 'partials/open.html', controller: 'OpenCtrl'});
    $routeProvider.when('/editor', {templateUrl: 'partials/editor.html', controller: 'EditorCtrl'});
    $routeProvider.when('/editor/:file', {templateUrl: 'partials/editor.html', controller: 'EditorCtrl'});
    $routeProvider.otherwise({redirectTo: '/login'});
  }]);

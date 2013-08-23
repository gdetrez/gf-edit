'use strict';


// Declare app level module which depends on filters, and services
angular.module('GFAce', ['myApp.filters', 'GFAce.services', 'myApp.directives', 'GFAce.controllers', 'ui.ace', 'ngCookies']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/login',           {templateUrl: 'partials/login.html', controller: 'LoginCtrl'});
    $routeProvider.when('/start',           {templateUrl: 'partials/start.html', controller: 'StartCtrl'});
    $routeProvider.when('/open/:gistid',    {templateUrl: 'partials/open.html', controller: 'OpenCtrl'});
    $routeProvider.when('/e/:gistid',       {templateUrl: 'partials/editor.html', controller: 'EditorCtrl'});
    $routeProvider.when('/e/:gistid/:file', {templateUrl: 'partials/editor.html', controller: 'EditorCtrl'});
    $routeProvider.when('/new',             {templateUrl: 'partials/progress-bar.html', controller: 'NewCtrl'});
    $routeProvider.otherwise({redirectTo: '/login'});
  }]);

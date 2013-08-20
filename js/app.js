'use strict';


// Declare app level module which depends on filters, and services
angular.module('GFAce', ['myApp.filters', 'GFAce.services', 'myApp.directives', 'GFAce.controllers', 'ui.ace']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/editor/:file', {templateUrl: 'partials/editor.html', controller: 'EditorCtrl'});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);

'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('GFAce.services', []).
  value('version', '0.1').

  factory('backend', ['$q', '$timeout', 'gist', function($q, $timeout, gist, $http) {
    var service = {};
    service.files = {
      'MyAbstract.gf':
        'abstract MyAbstract = {\n  cat Greeting ;\n}',
      'MyConcrete.gf':
        'concrete MyConcrete of MyAbstract = {\n  lincat Greeting = Str ;\n  lin hi = \"Hello world!\" ;\n}'
      };
    // Open a grammar by loading the gist and the file content from github
    service.open = function(gistid) {
      var deferred = $q.defer();
      console.log("Loading...");
      gist.get(gistid).then(
        function(res) {
          console.log('Received gist');
          console.log(res.data);
          service.gistid = gistid;
          service.files = res.data.files;
          deferred.resolve();
        },
        function(reason) { deferred.reject(reason); }
      );
      return deferred.promise;
    };
    // list files
    service.ls = function() {
      var l = [];
      for (var f in service.files) l.push(f);
      return l;
    };

    // save data to github
    service.save = function() {
      return gist.patch( service.gistid, { files: service.files } );
    };
    return service;
  }]).

  /* Authentication service: get an access token and store in a cookie */
  factory('auth', [function () {
    // initialize to whatever is in the cookie, if anything
    var token = 'bf1fcd95368f34ba2848ded6f14f74bbe5f79725';
    //$http.defaults.headers.common['Authorization'] = 'Basic ' + $cookieStore.get('authdata');
    return {
      token: token
      // setCredentials: function (username, password) {
      //   var encoded = Base64.encode(username + ':' + password);
      //   $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
      //   $cookieStore.put('authdata', encoded);
      // },
      // clearCredentials: function () {
      //   document.execCommand("ClearAuthenticationCache");
      //   $cookieStore.remove('authdata');
      //   $http.defaults.headers.common.Authorization = 'Basic ';
      // }
    };
  }]).

  factory('gist', ['$http', 'auth', '$q', function($http, auth, $q) {
    var APIURL = 'https://api.github.com';
    var service = {
      // Get a single gist
      get: function(gistid) {
        var deferred = $q.defer();
        var httpparams = {};
        httpparams['access_token'] = 'bf1fcd95368f34ba2848ded6f14f74bbe5f79725';
        return $http.get(APIURL + '/gists/' + gistid, { params: httpparams } );
      },

      patch: function(id,data) {
        var httpparams = {};
        httpparams['access_token'] = 'bf1fcd95368f34ba2848ded6f14f74bbe5f79725';
        return $http({method: 'PATCH', url: APIURL + '/gists/' + id, data: data, params: httpparams } );
      }};
    return service;
  }]).

  factory('gf', ['$http', '$q', function($http,$q) {
    var APIURL = 'http://cloud.grammaticalframework.org';
    var TMPDIR = '/tmp/gfse.1235190033';
    var service = {
      make: function(files) {
        var httpparams = {};
        httpparams['dir'] = TMPDIR;
        httpparams['command'] = 'make';
        for (var f in files) httpparams[f] = files[f].content;
        $http.defaults.useXDomain = true;
        delete $http.defaults.headers.common['X-Requested-With'];
        return $http.get(APIURL + '/cloud', {params: httpparams});
      }
    };
    return service;
  }]);

'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('GFAce.services', []).
  value('version', '0.1').

  value('new', {
    'MyAbstract.gf': {
       content: 'abstract MyAbstract = {\n  cat Greeting ; fun hello : Greeting ; \n}'},
     'MyConcrete.gf': {
       content: 'concrete MyConcrete of MyAbstract = {\n  lincat Greeting = Str ;\n  lin hello = \"Hello world!\" ;\n}'}
  }).


  factory('backend', ['$q', '$timeout', 'gist', function($q, $timeout, gist, $http) {
    var service = {};
    service.files = {};

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

    // Create a vew grammar an gist.github.com
    service.create = function() {
      var deferred = $q.defer();
      console.log("Creating...");
      var newGist = {
        "description": "Created with GF edit",
        "public": true,
        "files": {
          'MyAbstract.gf': {
            content: 'abstract MyAbstract = {\n  cat Greeting ; fun hello : Greeting ; \n}'},
          'MyConcrete.gf': {
            content: 'concrete MyConcrete of MyAbstract = {\n  lincat Greeting = Str ;\n  lin hello = \"Hello world!\" ;\n}'}
        }
      };
      gist.create(newGist).then(
        function(res) {
          console.log('Created gist:');
          console.log(res.data);
          service.gistid = res.data.id;
          service.files  = res.data.files;
          deferred.resolve(res.data.id);
        },
        function(reason) { deferred.reject(reason.data.message); }
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

  factory('gist', ['$http', '$q', '$cookies', 'Base64', function($http, $q, $cookies, Base64) {
    var APIURL = 'https://api.github.com';

    //var httpparams = {};
    //httpparams['access_token'] = 'bf1fcd95368f34ba2848ded6f14f74bbe5f79725';
    var service = {
      hasToken: function() { return $cookies.githubToken != null ; },
      login: function(username, password) {
        var deferred = $q.defer();
        var encoded = Base64.encode(username + ':' + password);
        $http({
          method: 'POST',
          url: APIURL + '/authorizations',
          data: { scopes: 'gist' },
          headers: { Authorization: 'Basic ' + encoded}
        }).then(
          function(data) {
            console.log(data);
            $cookies.githubToken = data.data.token
            deferred.resolve(true);
          },
          function(reason) {
            console.log(reason);
            deferred.reject(reason.data.message || "Network problem");
          });
        return deferred.promise;
      },
      forgetToken: function() { $cookies.githubToken = null; },

      // Get the list of gists
      list: function() {
        return $http.get(APIURL + '/gists', {params: { access_token: $cookies.githubToken } })
      },
      // Get a single gist
      get: function(gistid) {
        return $http.get(APIURL + '/gists/' + gistid, { params: { access_token: $cookies.githubToken } } );
      },
      // Patch gist
      patch: function(id,data) {
        return $http({
          method: 'PATCH',
          url: APIURL + '/gists/' + id,
          data: data,
          params: { access_token: $cookies.githubToken } 
        });
      },
      // Create gist
      create: function(data) {
        return $http({
          method: 'POST',
          url: APIURL + '/gists',
          data: data,
          params: { access_token: $cookies.githubToken } 
        });
      }};
    return service;
  }]).

  factory('gf', ['$http', '$cookies', function($http, $cookies) {
    var APIURL = 'http://cloud.grammaticalframework.org';
    var TMPDIR = $cookies.gfTmpDir; // '/tmp/gfse.1235190033';
    console.log("tmp dir is: " + TMPDIR);
    if (!TMPDIR) {
      console.log("Getting a new temp dir");
      $http.defaults.useXDomain = true;
      delete $http.defaults.headers.common['X-Requested-With'];
      $http.get(APIURL + '/new').then(
        function(resp) {
          TMPDIR = resp.data;
          $cookies.gfTmpDir = TMPDIR;
          console.log("new tmp dir is: " + TMPDIR);
        },
        function(resp) {
          console.log("Problew while contacting the gf server: " + resp);
        });
    }

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
  }]).

  factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
                 'QRSTUVWXYZabcdef' +
                 'ghijklmnopqrstuv' +
                 'wxyz0123456789+/' +
                 '=';
    return {
      encode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }

          output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);
        return output;
      },

      decode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
          alert("There were invalid base64 characters in the input text.\n" +
              "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
              "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
          }

          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return output;
      }
    };
  });


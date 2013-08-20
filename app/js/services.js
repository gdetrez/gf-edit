'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('GFAce.services', []).
  value('version', '0.1').
  factory('backend', function() {
    var service = {};
    service.files = {
      'MyAbstract.gf':
        'abstract MyAbstract = {\n  cat Greeting ;\n}',
      'MyConcrete.gf':
        'concrete MyContrete of MyAbstract = {\n  lincat Greeting = str ;\n  lin hi = \"Hello world!\" ;\n}'
      };
    return service;
  });

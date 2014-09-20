'use strict';

/**
 * @ngdoc service
 * @name warriorPoetsApp.poemFactory
 * @description
 * # poemFactory
 * Factory in the warriorPoetsApp.
 */
angular.module('warriorPoetsApp')
  .factory('poemFactory', ['$resource', 'endpointConstants',
    function ($resource, endpointConstants) {

      var poemFactory = {};

      poemFactory.get = function(id) {
        return $resource(endpointConstants.poem, {
          id : id
        }).get();
      };

      return poemFactory;

    }
  ]);

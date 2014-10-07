'use strict';

/**
 * @ngdoc service
 * @name numaApp.poemFactory
 * @description
 * # poemFactory
 * Factory in the numaApp.
 */
angular.module('numaApp')
  .factory('poemFactory', ['$resource', 'endpointConstants',
    function ($resource, endpointConstants) {

      var poemFactory = {};

// $resource calls -------------------------------------------------------------

      poemFactory.rGet = function(id) {
        return $resource(endpointConstants.poem, {
          id : id
        }).get();
      };

      poemFactory.rGetQuery = function(page, query, searchBy) {
        typeof page     !== 'undefined' ? page = ('page=' + page + '/') : page = '';
        typeof query    !== 'undefined' ? query = ('query=' + query + '/') : query = '';
        typeof searchBy !== 'undefined' ? searchBy = ('searchby=' + searchBy + '/') : searchBy = '';
        // console.log('req:', endpointConstants.allPoems + '/?' + query + searchBy + page);
        return $resource(endpointConstants.allPoems + '/?' + query + searchBy + page).get();
      };

      return poemFactory;

    }
  ]);

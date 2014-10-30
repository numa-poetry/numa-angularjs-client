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

      poemFactory.rGetQuery = function(page, query, searchby, strictSearch) {
        if (typeof page !== 'undefined') {
          page = 'page=' + page + '&';
        } else {
          page = '';
        }

        if (typeof query !== 'undefined') {
          query = 'query=' + query + '&';
        } else {
          query = '';
        }

        if (typeof searchby !== 'undefined') {
          searchby = 'searchby=' + searchby + '&';
        } else {
          searchby = '';
        }

        if (typeof strictSearch !== 'undefined') {
          strictSearch = 'strict=true';
        } else {
          strictSearch = '';
        }

        // console.log('Search request:', endpointConstants.allPoems + '/?' + page + query + searchby + strictSearch);
        return $resource(endpointConstants.allPoems + '/?' + page + query + searchby + strictSearch).get();
      };

      return poemFactory;

    }
  ]);

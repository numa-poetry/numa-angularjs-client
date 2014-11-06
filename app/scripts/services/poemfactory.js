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

      poemFactory.rGetQuery = function(page, query, searchby, strictSearch, sortby) {
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
          strictSearch = 'strict=true&';
        } else {
          strictSearch = '';
        }

        if (typeof sortby !== 'undefined') {
          sortby = 'sortby=votes';
        } else {
          sortby = '';
        }

        // console.log('Search request:', endpointConstants.allPoems + '/?' + page + query + searchby + strictSearch + sortby);
        return $resource(endpointConstants.allPoems + '/?' + page + query + searchby + strictSearch + sortby).get();
      };

      return poemFactory;

    }
  ]);

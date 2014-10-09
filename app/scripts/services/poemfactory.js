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

      poemFactory.rGetQuery = function(page, query, searchByTitle, searchByTag, searchByContent) {
        if (typeof page !== 'undefined') {
          page = ('page=' + page + '&');
        } else {
          page = '';
        }

        if (typeof query !== 'undefined') {
          query = ('query=' + query + '&');
        } else {
          query = '';
        }

        var searchBy = '';
        if (searchByTitle === true || searchByTag === true || searchByContent === true) {
          searchBy = 'searchby=';
        }

        if (searchByTitle === true) {
          searchBy += 'title,';
        }
        if (searchByTag === true) {
          searchBy += 'tag,';
        }
        if (searchByContent === true) {
          searchBy += 'content,';
        }
        console.log('req:', endpointConstants.allPoems + '/?' + query + page + searchBy);
        return $resource(endpointConstants.allPoems + '/?' + query + page + searchBy).get();
      };

      return poemFactory;

    }
  ]);

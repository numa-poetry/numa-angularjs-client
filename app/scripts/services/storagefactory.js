'use strict';

/**
 * @ngdoc service
 * @name warriorPoetsApp.storageFactory
 * @description
 * # storageFactory
 * Factory in the warriorPoetsApp.
 */
angular.module('warriorPoetsApp')
  .factory('storageFactory', ['storageConstants', '$cookieStore', '$window',
    function(storageConstants, $cookieStore, $window) {

      var storageFactory = {};

// setters ---------------------------------------------------------------------

      storageFactory.setToken = function(token) {
        $window.localStorage.token = token;
      };

      storageFactory.setId = function(id) {
        $cookieStore.put(storageConstants.id, id);
      };

// getters ---------------------------------------------------------------------

      storageFactory.getId = function() {
        return $cookieStore.get(storageConstants.id);
      };

      storageFactory.getToken = function() {
        return $window.localStorage.token;
      };

// deletes ---------------------------------------------------------------------

      storageFactory.deleteId = function() {
        $cookieStore.remove(storageConstants.id);
      };

      storageFactory.deleteToken = function() {
        delete $window.localStorage.token;
      };

      return storageFactory;

    }
  ]);
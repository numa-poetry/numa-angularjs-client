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

      storageFactory.setUserToken = function(token) {
        $window.sessionStorage.userToken = token;
      };

      storageFactory.setUserId = function(id) {
        $cookieStore.put(storageConstants.userId, id);
      };

// getters ---------------------------------------------------------------------

      storageFactory.getUserId = function() {
        return $cookieStore.get(storageConstants.userId);
      };

      storageFactory.getUserToken = function() {
        return $window.sessionStorage.userToken;
      };

// deletes ---------------------------------------------------------------------

      storageFactory.deleteUserId = function() {
        $cookieStore.remove(storageConstants.userId);
      };

      storageFactory.deleteUserToken = function() {
        delete $window.sessionStorage.userToken;
      };

      return storageFactory;

    }
  ]);
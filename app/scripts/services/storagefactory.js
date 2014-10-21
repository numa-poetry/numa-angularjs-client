'use strict';

/**
 * @ngdoc service
 * @name numaApp.storageFactory
 * @description
 * # storageFactory
 * Factory in the numaApp.
 */
angular.module('numaApp')
  .factory('storageFactory', ['storageConstants', '$cookieStore', '$window',
    function(storageConstants, $cookieStore, $window) {

      var storageFactory = {};

// setters ---------------------------------------------------------------------

      storageFactory.setToken = function(token) {
        $window.localStorage.satellizer_token = token;
      };

      storageFactory.setId = function(id) {
        $cookieStore.put(storageConstants.id, id);
      };

      storageFactory.setSocketId = function(id) {
        $cookieStore.put(storageConstants.socketId, id);
      };

// getters ---------------------------------------------------------------------

      storageFactory.getId = function() {
        return $cookieStore.get(storageConstants.id);
      };

      storageFactory.getToken = function() {
        return $window.localStorage.satellizer_token;
      };

      storageFactory.getSocketId = function() {
        return $cookieStore.get(storageConstants.socketId);
      };

// deletes ---------------------------------------------------------------------

      storageFactory.deleteId = function() {
        $cookieStore.remove(storageConstants.id);
      };

      storageFactory.deleteToken = function() {
        delete $window.localStorage.satellizer_token;
      };

      return storageFactory;

    }
  ]);
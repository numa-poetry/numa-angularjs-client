'use strict';

/**
 * @ngdoc service
 * @name numaApp.tokenInterceptorFactory
 * @description
 * # tokenInterceptorFactory
 * Factory in the numaApp.
 */
angular.module('numaApp')
  .factory('tokenInterceptorFactory', ['$q', 'storageFactory', '$cookies',
    function($q, storageFactory, $cookies) {

      var tokenInterceptorFactory = {};

      tokenInterceptorFactory.request = function(config) {
        config.headers = config.headers || {};
        var token      = storageFactory.getToken();
        var socketId   = storageFactory.getSocketId();
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
        }
        if (socketId) {
          config.headers.SocketId = socketId;
        }
        return config;
      };

      tokenInterceptorFactory.response = function(response) {
        return response || $q.when(response);
      };

      return tokenInterceptorFactory;

    }
  ]);
'use strict';

/**
 * @ngdoc service
 * @name warriorPoetsApp.tokenInterceptorFactory
 * @description
 * # tokenInterceptorFactory
 * Factory in the warriorPoetsApp.
 */
angular.module('warriorPoetsApp')
  .factory('tokenInterceptorFactory', ['$q', 'storageFactory',
    function($q, storageFactory) {

      return {

        request : function(config) {
          config.headers = config.headers || {};
          var userToken = storageFactory.getUserToken();
          if (userToken) {
            config.headers.Authorization = 'Bearer ' + userToken;
          }
          return config;
        },

        response : function(response) {
          return response || $q.when(response);
        }

      };

    }
  ]);
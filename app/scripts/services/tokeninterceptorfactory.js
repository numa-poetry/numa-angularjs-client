'use strict';

/**
 * @ngdoc service
 * @name numaApp.tokenInterceptorFactory
 * @description
 * # tokenInterceptorFactory
 * Factory in the numaApp.
 */
angular.module('numaApp')
  .factory('tokenInterceptorFactory', ['$q', 'storageFactory',
    function($q, storageFactory) {

      return {

        request : function(config) {
          config.headers = config.headers || {};
          var token = storageFactory.getToken();
          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }
          return config;
        },

        response : function(response) {
          return response || $q.when(response);
        }

      };

    }
  ]);
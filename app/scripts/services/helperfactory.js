'use strict';

/**
 * @ngdoc service
 * @name numaApp.helperFactory
 * @description
 * # helperFactory
 * Factory in the numaApp.
 */
angular.module('numaApp')
  .factory('helperFactory', ['$location', 'storageFactory', 'userFactory',
    function($location, storageFactory, userFactory) {

      return {

        go : function(path, params) {
          console.log(params);
          $location.path(path);
        },

        // If authentication error logout user and redirect to login.
        // Set query string paramters to
        // /login?session=expired&previousView=<previousView>
        // LoginCtrl will look for this query string and display a 'session
        // expired' message to the user. After successful login redirect user to
        // previous view.
        deleteDataAndRedirectToLogin : function(previousView) {
          storageFactory.deleteId();
          storageFactory.deleteToken();
          userFactory.deleteInfo();
          $location.path('/login').search('session', 'expired').search('previousView', previousView);
        }
      };

    }
  ]);
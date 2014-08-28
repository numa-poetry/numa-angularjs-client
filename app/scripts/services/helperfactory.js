'use strict';

/**
 * @ngdoc service
 * @name warriorPoetsApp.helperFactory
 * @description
 * # helperFactory
 * Factory in the warriorPoetsApp.
 */
angular.module('warriorPoetsApp')
  .factory('helperFactory', ['$location', 'storageFactory', 'userFactory',
    function($location, storageFactory, userFactory) {

      return {

        go : function(path) {
          $location.path(path);
        },

        // If authentication error logout user and redirect to login.
        // Set query string paramters to
        // /login?session=expired&previousView=<previousView>
        // LoginCtrl will look for this query string and display a 'session
        // expired' message to the user. After successful login redirect user to
        // previous view.
        deleteDataAndRedirectToLogin : function(previousView) {
          storageFactory.deleteUserId();
          storageFactory.deleteuserToken();
          userFactory.deleteUserInfo();
          $location.path('/login').search('session', 'expired').search('previousView', previousView);
        }
      };

    }
  ]);
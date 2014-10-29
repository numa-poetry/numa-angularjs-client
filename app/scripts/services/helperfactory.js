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

        go: function(path, params) {
          console.log(params);
          $location.path(path);
        },

        // temporary bug fix
        restoreScrollbar: function() {
          $('body').removeClass('modal-open');
        },

        // If authentication error logout user and redirect to login.
        // Set query string paramters to
        // /login?session=expired&previousView=<previousView>
        // LoginCtrl will look for this query string and display a 'session
        // expired' message to the user. After successful login redirect user to
        // previous view.
        deleteDataAndRedirectToLogin: function(previousView) {
          storageFactory.deleteId();
          storageFactory.deleteToken();
          userFactory.deleteInfo();
          $location.path('/login').search('session', 'expired').search('previousView', previousView);
        },

        // https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site/23259289#23259289
        timeSince: function(date) {
          if (typeof date !== 'object') {
            date = new Date(date);
          }

          var seconds = Math.floor((new Date() - date) / 1000);
          var intervalType;

          var interval = Math.floor(seconds / 31536000);
          if (interval >= 1) {
            intervalType = 'year';
          } else {
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
              intervalType = 'month';
            } else {
              interval = Math.floor(seconds / 86400);
              if (interval >= 1) {
                intervalType = 'day';
              } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1) {
                  intervalType = 'hour';
                } else {
                  interval = Math.floor(seconds / 60);
                  if (interval >= 1) {
                    intervalType = 'minute';
                  } else {
                    interval = seconds;
                    intervalType = 'second';
                  }
                }
              }
            }
          }
          if (interval > 1 || interval === 0) {
            intervalType += 's';
          }
          return interval + ' ' + intervalType;
        }

      };

    }
  ]);
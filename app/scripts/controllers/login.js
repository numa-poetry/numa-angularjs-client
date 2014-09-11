'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('LoginCtrl', ['$location', '$scope', 'helperFactory',
    'userFactory', 'storageFactory', '$auth', '$alert', '$resource', '$http',
    '$rootScope', 'usSpinnerService', 'ngProgress', '$q', '$sce', '$tooltip',
    function ($location, $scope, helperFactory, userFactory, storageFactory,
      $auth, $alert, $resource, $http, $rootScope, usSpinnerService, ngProgress,
      $q, $sce, $tooltip) {

      $scope.popover = {
        title   : 'Protect your privacy',
        content : 'If you close your browser without logging out, we\'ll store an access token to remember you.<br />' +
          'Other people who use this computer will also be able to log in as you.',
        checked : false
      };

      var _sessionExpired = false;

      if ($location.search().session === 'expired') {
        $scope.err      = 'Session expired. Please login again';
        _sessionExpired = true;
      }

// functions -------------------------------------------------------------------

      $scope.go = helperFactory.go;

      // $scope.redditOauth = function() {

      //   return {
      //     login : function() {
      //       var resource = $resource('https://ssl.reddit.com/api/v1/authorize', {
      //         client_id     : 'QWgNmA7jVv4KWA',
      //         response_type : 'code',
      //         state         : 'Random_String',
      //         redirect_uri  : 'http://localhost:9000',
      //         duration      : 'temporary',
      //         scope         : 'identity'
      //       }).save([]);

      //       resource.$promise.then(function(res) {
      //         console.log('Response:', res);
      //       }, function(err) {
      //         console.log('Error:', err);
      //       });
      //     }
      //   };
      // };

      $scope.authenticate = function(provider) {
        usSpinnerService.spin('login-spinner');
        // ngProgress.color('#3D71FF');
        ngProgress.start();
        if (provider === 'reddit') {
          // var resource = $resource('https://ssl.reddit.com/api/v1/authorize', {
          //   client_id     : 'QWgNmA7jVv4KWA',
          //   response_type : 'code',
          //   state         : 'Random_String',
          //   redirect_uri  : window.location.origin,
          //   duration      : 'temporary',
          //   scope         : 'identity'
          // }).save([]);

          // resource.$promise.then(function(res) {
          //   console.log('Response:', res);
          // }, function(err) {
          //   console.log('Error:', err);
          // });

          $http({
            method: 'POST',
            url: 'https://ssl.reddit.com/api/v1/authorize',
            data: {
              client_id     : 'QWgNmA7jVv4KWA',
              response_type : 'code',
              state         : 'Random_String',
              redirect_uri  : window.location.origin,
              duration      : 'temporary',
              scope         : 'identity'
            }
          }).success(function(data, status, headers, config) {
            console.log('SUC:', data);
          }).error(function(data, status, headers, config) {
            console.log('ERR:', data);
          });
          ngProgress.complete();
          usSpinnerService.stop('login-spinner');
        } else {
          $auth.authenticate(provider)
            .then(function(res) {
              $alert({
                type        : 'material',
                dismissable : false,
                duration    : 5,
                placement   : top,
                title       : 'Hello, ' + res.data.displayName + '!',
                content     : 'You have successfully logged in.'
              });
              console.log('RES:',res);
              ngProgress.complete();

              // look into how Satellizer handles response. _id vs id
              userFactory.setInfo(res.data.id, res.data.displayName);
              storageFactory.setId(res.data.id);
              // storageFactory.setToken(res.token);

              $rootScope.displayName = res.data.displayName;
              usSpinnerService.stop('login-spinner');
            })
            .catch(function(res) {
              // if backend is down
              if (res.status === 0) {
                $auth.logout()
                  .then(function() {
                    $alert({
                      type        : 'material-err',
                      title       : 'We\'ve lost connection to our backend.',
                      content     : 'Please try logging back in. If the problem persists, try again later.',
                      duration    : 6,
                      dismissable : true
                    });
                  });
              } else {
                $alert({
                  type        : 'material-err',
                  dismissable : true,
                  title       : 'Oops! ',
                  content     : res.data.message,
                  duration    : 5
                });
              }
              storageFactory.deleteId();
              storageFactory.deleteToken();
              // usSpinnerService.stop('login-spinner');
              $location.path('/login');
              ngProgress.complete();
            });
        }

      };

      $scope.login = function() {
        usSpinnerService.spin('login-spinner');
        // ngProgress.color('#3D71FF');
        ngProgress.start();

        var req          = {};
        req.displayName  = $scope.displayName;
        req.password     = $scope.password;
        req.stayLoggedIn = $scope.stayLoggedIn;

        console.log('REQ:', req);
        var resource    = userFactory.rLogin(req);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            title       : 'Hello, ' + req.displayName + '!',
            content     : 'You have successfully logged in.'
          });

          userFactory.setInfo(res.id, req.displayName);
          storageFactory.setId(res.id);
          storageFactory.setToken(res.token);
          $location.path('/');

          $rootScope.displayName     = req.displayName;
          $rootScope.isAuthenticated = true; // temp fix to work with satellizer

          // Redirect to previous view if session expired
          // var previousView = $location.search().previousView;

          // if (_sessionExpired === true && previousView) {
          //   $scope.go(previousView);
          // } else {
            // $scope.go('/dashboard');
          // }

          // _sessionExpired = false;

          // Clear the query string parameters from the URL
          // $location.url($location.path());
          usSpinnerService.stop('login-spinner');
          ngProgress.complete();
        }, function(res) {
          // if backend is down
          if (res.status === 0) {
            $auth.logout()
              .then(function() {
                $alert({
                  type        : 'material-err',
                  title       : 'We\'ve lost connection to our backend.',
                  content     : 'Please try logging back in. If the problem persists, try again later.',
                  duration    : 6,
                  dismissable : true
                });
              });
          } else {
            $alert({
              type        : 'material-err',
              dismissable : true,
              title       : 'Oops! ',
              content     : res.data.message,
              duration    : 5
            });
          }
          storageFactory.deleteId();
          storageFactory.deleteToken();
          // usSpinnerService.stop('login-spinner');
          $location.path('/login');
          ngProgress.complete();
        });
      };

    }
  ]);
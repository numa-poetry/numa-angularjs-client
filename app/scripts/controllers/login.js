'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('LoginCtrl', ['$location', '$scope',
    'userFactory', 'storageFactory', '$auth', '$alert', '$resource', '$http',
    '$rootScope', 'usSpinnerService',
    function ($location, $scope, userFactory, storageFactory,
      $auth, $alert, $resource, $http, $rootScope, usSpinnerService) {

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
                content     : 'You have successfully logged in.',
                animation   : 'fadeZoomFadeDown'
              });
              console.log('RES:',res);

              userFactory.setInfo(res.data.id, res.data.displayName);
              storageFactory.setId(res.data.id);

              $rootScope.displayName = res.data.displayName;
              usSpinnerService.stop('login-spinner');
              $rootScope.$emit('login');
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
                      dismissable : true,
                      animation   : 'fadeZoomFadeDown'
                    });
                  });
              } else {
                $alert({
                  type        : 'material-err',
                  dismissable : true,
                  title       : 'Oops! ',
                  content     : res.data.message,
                  duration    : 5,
                  animation   : 'fadeZoomFadeDown'
                });
              }
              storageFactory.deleteId();
              storageFactory.deleteToken();
              usSpinnerService.stop('login-spinner');
              $location.path('/login');
            });
        }

      };

      $scope.login = function() {
        usSpinnerService.spin('login-spinner');

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
            content     : 'You have successfully logged in.',
            animation   : 'fadeZoomFadeDown'
          });


          userFactory.setInfo(res.id, req.displayName);
          storageFactory.setId(res.id);
          storageFactory.setToken(res.token);

          $location.path('/feed');

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
          $rootScope.$emit('login');
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
                  dismissable : true,
                  animation   : 'fadeZoomFadeDown'
                });
              });
          } else {
            $alert({
              type        : 'material-err',
              dismissable : true,
              title       : 'Oops! ',
              content     : res.data.message,
              duration    : 5,
              animation   : 'fadeZoomFadeDown'
            });
          }
          storageFactory.deleteId();
          storageFactory.deleteToken();
          usSpinnerService.stop('login-spinner');
          $location.path('/login');
        });
      };

    }
  ]);
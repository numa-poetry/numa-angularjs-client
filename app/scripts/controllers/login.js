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
        content : 'If you close your browser without logging out, we\'ll store ' +
          'an access token to remember you.<br />Other people who use this ' +
          'computer will also be able to log in as you.',
        checked : false
      };

      var _sessionExpired = false;

      if ($location.search().session === 'expired') {
        $scope.err      = 'Session expired. Please login again';
        _sessionExpired = true;
      }

// functions -------------------------------------------------------------------

      $scope.authenticate = function(provider) {
        usSpinnerService.spin('login-spinner');
        $auth.authenticate(provider)
          .then(function(res) {
            $alert({
              type        : 'material',
              duration    : 3,
              title       : 'Hello, ' + res.data.displayName + '!',
              content     : 'You have successfully logged in.',
              animation   : 'fadeZoomFadeDown'
            });
            console.log(res);

            userFactory.setInfo(res.data.id, res.data.displayName);
            storageFactory.setId(res.data.id);

            $rootScope.displayName = res.data.displayName;
            usSpinnerService.stop('login-spinner');
            $rootScope.$emit('loginOrSignup');
          })
          .catch(function(res) {
            // if backend is down
            if (res.status === 0) {
              $auth.logout()
                .then(function() {
                  $alert({
                    type        : 'material-err',
                    title       : 'We\'ve lost connection to our backend.',
                    content     : 'Please try logging back in.',
                    duration    : 3,
                    animation   : 'fadeZoomFadeDown'
                  });
                });
            } else {
              $alert({
                type        : 'material-err',
                title       : 'Oops!',
                content     : res.data.message,
                duration    : 3,
                animation   : 'fadeZoomFadeDown'
              });
            }
            storageFactory.deleteId();
            storageFactory.deleteToken();
            usSpinnerService.stop('login-spinner');
            $location.path('/login');
          });
      };

      $scope.login = function() {
        usSpinnerService.spin('login-spinner');

        var req          = {};
        req.displayName  = $scope.displayName;
        req.password     = $scope.password;
        req.stayLoggedIn = $scope.stayLoggedIn;
        // console.log(req);
        var resource    = userFactory.rLogin(req);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            duration    : 3,
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
          usSpinnerService.stop('login-spinner');
          $rootScope.$emit('loginOrSignup');
        }, function(res) {
          // if backend is down
          if (res.status === 0) {
            $auth.logout()
              .then(function() {
                $alert({
                  type        : 'material-err',
                  title       : 'We\'ve lost connection to our backend.',
                  content     : 'Please try logging back in.',
                  duration    : 3,
                  animation   : 'fadeZoomFadeDown'
                });
              });
          } else {
            $alert({
              type        : 'material-err',
              title       : 'Oops!',
              content     : res.data.message,
              duration    : 3,
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
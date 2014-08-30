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
    function ($location, $scope, helperFactory, userFactory, storageFactory,
      $auth, $alert, $resource, $http) {

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

        } else {
          $auth.authenticate(provider)
            .then(function(res) {
              $alert({
                type        : 'material',
                dismissable : false,
                duration    : 5,
                placement   : top,
                title       : 'Hello, ' + res.displayName + '!',
                content     : 'You have successfully logged in'
              });
              console.log('RES:',res);
            })
            .catch(function(res) {
              $alert({
                content   : res.data.message,
                type      : 'material',
                duration: 3
              });
            });
        }
      };

      $scope.login = function(isValidForm) {
        if (isValidForm) {
          $scope.err = null;
          // usSpinnerService.spin('spinner');

          $scope.master = {};
          $scope.master = angular.copy($scope.user);
          var resource  = userFactory.rLogin($scope.master);

          resource.$promise.then(function(res) {
            userFactory.setUserInfo(res.id, res.username, res.email);
            storageFactory.setUserId(res.id);
            storageFactory.setUserToken(res.token);

            // Redirect to previous view if session expired
            var previousView = $location.search().previousView;

            if (_sessionExpired === true && previousView) {
              $scope.go(previousView);
            } else {
              // $scope.go('/dashboard');
            }

            _sessionExpired = false;

            // Clear the query string parameters from the URL
            $location.url($location.path());

            // usSpinnerService.stop('spinner');
          }, function(err) {
            console.log(err);
            $scope.err = err.data.message;
            // handle 500 error
            storageFactory.deleteUserId();
            storageFactory.deleteUserToken();
            // usSpinnerService.stop('spinner');
          });
        }
      };

      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

    }
  ]);
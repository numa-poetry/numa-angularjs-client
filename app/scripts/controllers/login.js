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
    'userFactory', 'storageFactory',
    function ($location, $scope, helperFactory, userFactory, storageFactory) {

      var _sessionExpired = false;

      if ($location.search().session === 'expired') {
        $scope.err      = 'Session expired. Please login again';
        _sessionExpired = true;
      }

// functions -------------------------------------------------------------------

      $scope.go = helperFactory.go;

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
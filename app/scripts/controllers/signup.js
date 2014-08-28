'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('SignupCtrl', ['$location', '$scope', 'helperFactory',
    'userFactory', 'storageFactory',
    function ($location, $scope, helperFactory, userFactory, storageFactory) {

// functions -------------------------------------------------------------------

      $scope.go = helperFactory.go;

      $scope.signUp = function(isValidForm) {
        if (isValidForm) {
          // usSpinnerService.spin('spinner');

          $scope.err    = null;
          $scope.master = {};
          $scope.master = angular.copy($scope.user);
          var resource  = userFactory.rSignUp($scope.master);

          resource.$promise.then(function(res) {
            userFactory.setUserInfo(res.id, res.username, res.email);
            storageFactory.setUserId(res.id);
            storageFactory.setUserToken(res.token);

            // $location.path('/dashboard');

            // Clear the query string parameters from the URL
            $location.url($location.path());

            // usSpinnerService.stop('spinner');
          }, function(err) {
            $scope.err = err.data.message;

            // handle 500 err

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
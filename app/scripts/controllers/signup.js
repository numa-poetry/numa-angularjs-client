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
    'userFactory', 'storageFactory', '$alert', '$rootScope', 'usSpinnerService',
    function ($location, $scope, helperFactory, userFactory, storageFactory,
      $alert, $rootScope, usSpinnerService) {

// functions -------------------------------------------------------------------

      $scope.go = helperFactory.go;

      $scope.signUp = function() {
        usSpinnerService.spin('signup-spinner');

        var req         = {};
        req.displayName = $scope.displayName;
        req.email       = $scope.email;
        req.password    = $scope.password;

        console.log('REQ:', req);
        var resource    = userFactory.rSignUp(req);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            title       : 'Hello, ' + req.displayName + '!',
            content     : 'You have successfully signed up.'
          });
          console.log('RES:', res);
          userFactory.setInfo(res.id, req.displayName);
          storageFactory.setId(res.id);
          storageFactory.setToken(res.token);

          $location.path('/');

          $rootScope.isAuthenticated = true; // temp fix to work with satellizer
          // Clear the query string parameters from the URL
          // $location.url($location.path());

          usSpinnerService.stop('signup-spinner');
        }, function(res) {
          $alert({
            type        : 'material',
            dismissable : false,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 3
          });
          usSpinnerService.stop('signup-spinner');
        });
      };
    }
  ]);
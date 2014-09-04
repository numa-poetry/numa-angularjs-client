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
    '$q', '$sce', '$tooltip',
    function ($location, $scope, helperFactory, userFactory, storageFactory,
      $alert, $rootScope, usSpinnerService, $q, $sce, $tooltip) {

      $scope.popover = {
        title   : 'Protect your privacy',
        content : 'If you close your browser without logging out, we\'ll store an access token to remember you.<br />' +
          'Other people who use this computer will also be able to log in as you.',
        checked : false
      };

// functions -------------------------------------------------------------------

      $scope.go = helperFactory.go;

      $scope.signUp = function() {
        usSpinnerService.spin('signup-spinner');

        var req          = {};
        req.displayName  = $scope.displayName;
        // req.email        = $scope.email;
        req.password     = $scope.password;
        req.stayLoggedIn = $scope.stayLoggedIn;

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
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 5
          });
          usSpinnerService.stop('signup-spinner');
        });
      };
    }
  ]);
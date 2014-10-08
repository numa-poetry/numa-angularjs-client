'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('SignupCtrl', ['$location', '$scope',
    'userFactory', 'storageFactory', '$alert', '$rootScope', 'usSpinnerService',
    function ($location, $scope, userFactory, storageFactory,
      $alert, $rootScope, usSpinnerService) {

      $scope.popover = {
        title   : 'Protect your privacy',
        content : 'If you close your browser without logging out, we\'ll store an access token to remember you.<br />' +
          'Other people who use this computer will also be able to log in as you.',
        checked : false
      };

// functions -------------------------------------------------------------------

      $scope.signUp = function() {
        usSpinnerService.spin('signup-spinner');

        var req          = {};
        req.displayName  = $scope.displayName;
        req.email        = $scope.email;
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
            content     : 'You have successfully signed up.',
            animation   : 'fadeZoomFadeDown'
          });
          console.log('RES:', res);
          userFactory.setInfo(res.id, req.displayName);
          storageFactory.setId(res.id);
          storageFactory.setToken(res.token);

          $location.path('/');

          $rootScope.displayName     = req.displayName;
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
            duration    : 5,
            animation   : 'fadeZoomFadeDown'
          });
          usSpinnerService.stop('signup-spinner');
        });
      };
    }
  ]);
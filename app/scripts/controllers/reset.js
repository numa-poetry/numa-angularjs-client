'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:ResetCtrl
 * @description
 * # ResetCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('ResetCtrl', ['$scope', '$alert', '$location', '$resource',
    'endpointConstants', 'usSpinnerService',
    function ($scope, $alert, $location, $resource, endpointConstants,
      usSpinnerService) {

      var token = $location.search().token;

      $scope.reset = function() {
        if (token) {
          usSpinnerService.spin('resetPassword-spinner');

          // Verify URL query parameters include reset password token
          var resource = $resource(endpointConstants.resetPassword, {
            token : token
          }).get();

          resource.$promise.then(function(res) {
            $scope.userExists = true;
          }, function(res) {
            usSpinnerService.stop('resetPassword-spinner');
            $alert({
              type        : 'material-err',
              dismissable : true,
              title       : 'Oops! ',
              content     : 'Looks like your reset token expired and/or the specified user does not exists. Please request to reset your password again.',
              duration    : 6
            });

            // clear parameters
            $location.url($location.path());

            // redirect back to forgot password
            $location.path('/forgot');
          });

        } else {
          usSpinnerService.stop('resetPassword-spinner');
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : 'Please follow the link in the email we sent you to reset your password.',
            duration    : 5
          });

          // clear parameters
          $location.url($location.path());

          // redirect back to homepage
          $location.path('/');
        }
      };

      // execute this function when the view is rendered
      $scope.reset();

      $scope.updatePassword = function() {
        if (token) {
          usSpinnerService.spin('resetPassword-spinner');

          var req      = {};
          req.password = $scope.password;

          var resource = $resource(endpointConstants.resetPassword, {
            token : token
          }).save([], req);

          resource.$promise.then(function(res) {
            usSpinnerService.stop('resetPassword-spinner');

            $alert({
              type        : 'material',
              dismissable : false,
              duration    : 5,
              placement   : top,
              title       : 'Success!',
              content     : 'Your password has been changed.'
            });

            $location.path('/login');
          }, function(res) {
            usSpinnerService.stop('resetPassword-spinner');
            $alert({
              type        : 'material-err',
              dismissable : true,
              title       : 'Oops!',
              content     : 'Please try again. If the problem persists please request to reset your password again.',
              duration    : 5
            });
          });
        } else {
          usSpinnerService.stop('resetPassword-spinner');
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops!',
            content     : 'Looks like your reset token expired and/or the specified user does not exists. Please request to reset your password again.',
            duration    : 6
          });

          // clear parameters
          $location.url($location.path());

          // redirect back to homepage
          $location.path('/');
        }
      };

    }
  ]);

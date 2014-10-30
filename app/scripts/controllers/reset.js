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

      // execute this function when the view is rendered
      $scope.reset();

// functions -------------------------------------------------------------------

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
              title       : 'Oops!',
              content     : 'Your reset token expired and/or the specified user does not exists. Please request to reset your password again.',
              duration    : 4,
              animation   : 'fadeZoomFadeDown'
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
            title       : 'Oops!',
            content     : 'Please follow the link in the email we sent you to reset your password.',
            duration    : 4,
            animation   : 'fadeZoomFadeDown'
          });

          // clear parameters
          $location.url($location.path());
          $location.path('/');
        }
      };

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
              duration    : 3,
              placement   : top,
              title       : 'Success!',
              content     : 'Your password has been changed.',
              animation   : 'fadeZoomFadeDown'
            });

            $location.path('/login');
          }, function(res) {
            usSpinnerService.stop('resetPassword-spinner');
            $alert({
              type        : 'material-err',
              title       : 'Oops!',
              content     : 'Please try again. If the problem persists please request to reset your password again.',
              duration    : 3,
              animation   : 'fadeZoomFadeDown'
            });
          });
        } else {
          usSpinnerService.stop('resetPassword-spinner');
          $alert({
            type        : 'material-err',
            title       : 'Oops!',
            content     : 'Your reset token expired and/or the specified user does not exists. Please request to reset your password again.',
            duration    : 3,
            animation   : 'fadeZoomFadeDown'
          });

          // clear parameters
          $location.url($location.path());
          $location.path('/');
        }
      };

    }
  ]);

'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:ForgotCtrl
 * @description
 * # ForgotCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('ForgotCtrl', ['$scope', '$resource', 'endpointConstants', '$alert',
    '$location',
    function ($scope, $resource, endpointConstants, $alert, $location) {

// functions -------------------------------------------------------------------

      $scope.resetPassword = function() {
        var req   = {};
        req.email = $scope.email;

        var resource = $resource(endpointConstants.forgotPassword).save(req);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            // title       : 'Hello, ' + res.displayName + '!',
            content     : 'An email has been sent to you with further instructions.'
          });
          console.log('RES:',res);

          $location.path('/');

        }, function(res) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 5
          });
          console.log('RES:',res);
        });
      };

    }
  ]);
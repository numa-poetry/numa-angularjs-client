'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('ProfileCtrl', ['$scope', 'userFactory', '$alert', 'storageFactory',
    '$location', 'ngProgress', '$rootScope', '$modal',
    function ($scope, userFactory, $alert, storageFactory, $location, ngProgress,
      $rootScope) {

      userFactory.init();

      $scope.modal = {
        'title' : 'Are you sure?'
      };

// functions -------------------------------------------------------------------

      $scope.deleteAccount = function() {
        ngProgress.start();
        var resource = userFactory.rDeleteAccount();

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            // title       : 'Hello, ' + req.displayName + '!',
            content     : 'You have successfully deleted your account.'
          });
          storageFactory.deleteId();
          storageFactory.deleteToken();
          userFactory.deleteInfo();

          $location.path('/');

          $rootScope.isAuthenticated = false; // temp fix to work with satellizer
          ngProgress.complete();
        }, function(res) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 5
          });
          ngProgress.complete();
        });

      };

    }
  ]);

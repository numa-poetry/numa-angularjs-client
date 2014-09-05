'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('MainCtrl', ['$scope', 'storageFactory', 'userFactory',
    function ($scope, storageFactory, userFactory) {

      userFactory.init();

// functions -------------------------------------------------------------------

      $scope.isLoggedIn = function() {
        var userToken = storageFactory.getUserToken();
        var userId    = storageFactory.getUserId();

        if (userToken && userId) {
          return true;
        } else {
          return false;
        }
      };

    }
  ]);
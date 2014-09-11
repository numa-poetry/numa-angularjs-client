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

      // var id    = storageFactory.getId();
      // var token = storageFactory.getToken();

      // if (id && token) {
      //   userFactory.init();
      // }

// functions -------------------------------------------------------------------

      $scope.isLoggedIn = function() {
        var userToken = storageFactory.getToken();
        var userId    = storageFactory.getId();

        if (userToken && userId) {
          return true;
        } else {
          return false;
        }
      };

    }
  ]);
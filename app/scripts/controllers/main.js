'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('MainCtrl', ['$scope', 'storageFactory',
    function ($scope, storageFactory) {

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

      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
      
    }
  ]);
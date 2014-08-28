'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('ProfileCtrl', ['$scope',
    function ($scope) {

      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
      
    }
  ]);

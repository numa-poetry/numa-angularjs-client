'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('NavbarCtrl', ['$scope',
    function ($scope) {

      $scope.isCollapsed = true;

      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

    }
  ]);

'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('AboutCtrl', ['$scope',
    function ($scope) {
      $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
    }
  ]);
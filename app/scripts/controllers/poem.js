'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:PoemsCtrl
 * @description
 * # PoemsCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('PoemsCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

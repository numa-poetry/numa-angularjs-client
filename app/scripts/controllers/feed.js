'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:FeedCtrl
 * @description
 * # FeedCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('FeedCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
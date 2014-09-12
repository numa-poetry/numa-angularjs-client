'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('NavbarCtrl', ['$scope', 'storageFactory', '$rootScope',
    function ($scope, storageFactory, $rootScope) {

      $scope.isCollapsed = true;

      $scope.id = storageFactory.getId();

    }
  ]);

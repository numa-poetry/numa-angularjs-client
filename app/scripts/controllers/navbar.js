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

      var unregisterLogin = $rootScope.$on('login', function() {
        // console.log('$on login');
        $scope.id = storageFactory.getId();
        // console.log('navbar id:', $scope.id);
      });

      var unregisterLogout = $rootScope.$on('logout', function() {
        // console.log('$on logout');
        $scope.id = undefined;
        // console.log('navbar id:', $scope.id);
      });

      $scope.$on('$destroy', function() {
        unregisterLogin();
        unregisterLogout();
      });

    }
  ]);

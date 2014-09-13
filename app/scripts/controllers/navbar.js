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

      var unregisterRefresh = $rootScope.$on('finishedSettingUserDataOnPageRefresh', function() {
        $scope.id = storageFactory.getId();
      });

      var unregisterLogin = $rootScope.$on('login', function() {
        $scope.id = storageFactory.getId();
      });

      var unregisterLogout = $rootScope.$on('logout', function() {
        $scope.id = undefined;
      });

      $scope.$on('$destroy', function() {
        unregisterLogin();
        unregisterLogout();
        unregisterRefresh();
      });

    }
  ]);

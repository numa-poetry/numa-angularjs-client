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
    'userFactory',
    function ($scope, storageFactory, $rootScope, userFactory) {

      $scope.isCollapsed = true;

      var unregisterRefresh = $rootScope.$on('finishedSettingUserDataOnPageRefresh', function() {
        $scope.id        = storageFactory.getId();
        $scope.avatarUrl = userFactory.getAvatarUrl();
      });

      var unregisterLogin = $rootScope.$on('login', function() {
        $scope.id        = storageFactory.getId();
        $scope.avatarUrl = userFactory.getAvatarUrl();
      });

      var unregisterLogout = $rootScope.$on('logout', function() {
        $scope.id        = undefined;
        $scope.avatarUrl = undefined;
      });

      $scope.$on('$destroy', function() {
        unregisterLogin();
        unregisterLogout();
        unregisterRefresh();
      });

    }
  ]);

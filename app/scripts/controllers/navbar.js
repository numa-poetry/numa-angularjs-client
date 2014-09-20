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
    'userFactory', '$tooltip', 'matchmedia',
    function ($scope, storageFactory, $rootScope, userFactory, $tooltip,
      matchmedia) {

      $scope.onPhone     = false;
      $scope.isCollapsed = true;

      $scope.tooltipCreate = {
        title   : 'Create a poem.',
        checked : false
      };

      $scope.tooltipFeed = {
        title   : 'View the poem feed.',
        checked : false
      };

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

      var unregisterMatchMediaOnPhone = matchmedia.onPhone(function() {
        $scope.onPhone = !$scope.onPhone;
      });

      $scope.$on('$destroy', function() {
        unregisterLogin();
        unregisterLogout();
        unregisterRefresh();
        unregisterMatchMediaOnPhone();
      });


// functions -------------------------------------------------------------------

      $scope.collapse = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
      };

    }
  ]);

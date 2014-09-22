'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('NavbarCtrl', ['$scope', 'storageFactory', '$rootScope',
    'userFactory', '$tooltip', 'matchmedia',
    function ($scope, storageFactory, $rootScope, userFactory, $tooltip,
      matchmedia) {

      $scope.isPhone     = false;
      $scope.isCollapsed = true;

      $scope.tooltipCreate = {
        title   : 'Start writing.',
        checked : false
      };

      $scope.tooltipFeed = {
        title   : 'Start reading.',
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
        if (matchmedia.isPhone()) {
          $scope.isPhone = true;
        } else {
          $scope.isPhone = false;
        }
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

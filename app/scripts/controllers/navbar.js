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
    'userFactory', '$tooltip', '$location',
    function ($scope, storageFactory, $rootScope, userFactory, $tooltip, $location) {

      $scope.isCollapsed = true;

      $scope.tooltipCreate = {
        title   : 'Start writing.',
        checked : false
      };

      $scope.tooltipFeed = {
        title   : 'Start reading.',
        checked : false
      };

      $scope.tooltipUnreadComments = {
        title   : 'You have unread comments.',
        checked : false
      };

      var unregisterRefresh = $rootScope.$on('finishedSettingUserDataOnPageRefresh', function() {
        $scope.id                  = storageFactory.getId();
        $scope.avatarUrl           = userFactory.getAvatarUrl();
        $scope.unreadCommentsCount = userFactory.getUnreadCommentsCount();
      });

      var unregisterLogin = $rootScope.$on('login', function() {
        $scope.id        = storageFactory.getId();
        $scope.avatarUrl = userFactory.getAvatarUrl();
      });

      var unregisterLogout = $rootScope.$on('logout', function() {
        $scope.id        = undefined;
        $scope.avatarUrl = undefined;
        $location.path('/feed');
      });

      $scope.$on('$destroy', function() {
        unregisterLogin();
        unregisterLogout();
        unregisterRefresh();
      });

// functions -------------------------------------------------------------------

      if ($location.path() === '/') {
        $scope.isHome = true;
      }

      $scope.goHome = function() {
        $scope.isHome = true;
      };

      $scope.dontGoHome = function() {
        $scope.isHome = false;
      };

      $scope.collapse = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
      };

    }
  ]);

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
        title   : 'Start creating.',
        checked : false
      };

      $scope.tooltipFeed = {
        title   : 'Start reading.',
        checked : false
      };

      $scope.tooltipUnreadComments = {
        title   : 'Someone gave you feedback!',
        checked : false
      };

      $scope.tooltipUnreadPoems = {
        title   : 'Someone you\'re following recently wrote a new poem!',
        checked : false
      };

      var unregisterRefresh = $rootScope.$on('finishedSettingUserDataOnPageRefresh', function() {
        $scope.id                        = storageFactory.getId();
        $scope.avatarUrl                 = userFactory.getLoggedInUserAvatarUrl();
        $scope.unreadCommentsCount       = userFactory.getLoggedInUserUnreadCommentsCount();
        $scope.unreadFollowingPoemsCount = userFactory.getLoggedInUserUnreadFollowingPoemsCount();
      });

      var unregisterLogin = $rootScope.$on('login', function() {
        $scope.id        = storageFactory.getId();
        $scope.avatarUrl = userFactory.getLoggedInUserAvatarUrl();
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

      $scope.collapse = function() {
        $scope.isCollapsed = !$scope.isCollapsed;
      };

    }
  ]);

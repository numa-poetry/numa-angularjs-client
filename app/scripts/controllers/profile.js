'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('ProfileCtrl', ['$scope', 'userFactory', '$alert', 'storageFactory',
    '$location', 'ngProgress', '$rootScope',
    function ($scope, userFactory, $alert, storageFactory, $location, ngProgress,
      $rootScope) {

      userFactory.init();

      $rootScope.$on('finishedSettingUserDataOnPageRefresh', function () {
        $scope.email      = userFactory.getEmail();
        $scope.joinedDate = userFactory.getJoinedDate();
      });

      $scope.editorEnabled = false;

      $scope.modal = {
        'title' : 'Are you sure?'
      };

// functions -------------------------------------------------------------------

      $scope.enableEditor = function() {
        $scope.editorEnabled = true;
      };

      $scope.disableEditor = function() {
        $scope.editorEnabled = false;
      };

      $scope.save = function() {
        ngProgress.start();

        var req = {};
        req.email = $scope.email;

        var http = userFactory.hUpdateUser(req);
        http.then(function(res) {
          // console.log('good res:', res);
          $scope.editorEnabled = false;
          $scope.email = res.data.user.email;
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            content     : 'You have successfully updated your profile.'
          });
          ngProgress.complete();
        }, function(res) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 5
          });
          ngProgress.complete();
        });
      };

      $scope.deleteAccount = function() {
        ngProgress.start();
        var resource = userFactory.rDeleteAccount();

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            // title       : 'Hello, ' + req.displayName + '!',
            content     : 'You have successfully deleted your account.'
          });
          storageFactory.deleteId();
          storageFactory.deleteToken();
          userFactory.deleteInfo();

          $location.path('/');

          $rootScope.isAuthenticated = false; // temp fix to work with satellizer
          ngProgress.complete();
        }, function(res) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 5
          });
          ngProgress.complete();
        });

      };

    }
  ]);

'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('MainCtrl', ['$scope', 'storageFactory', 'userFactory',
    function ($scope, storageFactory, userFactory) {

      var id = storageFactory.getId();
      userFactory.init(id, 'Basic');

// functions -------------------------------------------------------------------

      $scope.isLoggedIn = function() {
        var userToken = storageFactory.getToken();
        var userId    = storageFactory.getId();

        if (userToken && userId) {
          return true;
        } else {
          return false;
        }
      };

    }
  ]);
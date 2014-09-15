'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('MainCtrl', ['$scope', 'storageFactory', 'userFactory',
    function ($scope, storageFactory, userFactory) {

      // modify backend to only send back displayName
      var id = storageFactory.getId();
      userFactory.init(id);

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
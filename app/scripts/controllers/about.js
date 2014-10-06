'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('AboutCtrl', ['$scope',
    function ($scope) {
      $scope.current_title = 'directiv.es';
      $scope.current_description = 'www.directiv.es';
    }
  ]);
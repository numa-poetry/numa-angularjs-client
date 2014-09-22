'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:PoemsCtrl
 * @description
 * # PoemsCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('PoemCtrl', ['$scope', '$routeParams', 'poemFactory', 'storageFactory',
    'userFactory', '$location',
    function ($scope, $routeParams, poemFactory, storageFactory, userFactory,
      $location) {

      $scope.userId = storageFactory.getId();
      userFactory.init($scope.userId, 'Basic');

      var poemId = $routeParams.id;
      if (poemId) {
        var resource = poemFactory.get(poemId);

        resource.$promise.then(function(res) {
          $scope.creatorId = res.creator.id;
          $scope.title     = res.poem.title;
          $scope.poem      = res.poem.poem;
        }, function(res) {
          console.log(res);
        });
      }

// functions -------------------------------------------------------------------

      $scope.go = function(path) {
        $location.path(path + '/' + poemId);
      };

    }
  ]);

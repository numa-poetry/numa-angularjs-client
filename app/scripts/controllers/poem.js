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
    'userFactory',
    function ($scope, $routeParams, poemFactory, storageFactory, userFactory) {

      $scope.userId = storageFactory.getId();
      userFactory.init($scope.userId, 'Basic');

      $scope.poemId = $routeParams.id;
      if ($scope.poemId) {
        var resource = poemFactory.rGet($scope.poemId);

        resource.$promise.then(function(res) {
          $scope.creatorId = res.creator.id;
          $scope.title     = res.poem.title;
          $scope.poem      = res.poem.poem;
          $scope.tags      = res.poem.tags;
        }, function(res) {
          console.log(res);
        });
      }

// functions -------------------------------------------------------------------

    }
  ]);

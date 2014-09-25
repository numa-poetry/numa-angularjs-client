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

      $scope.tags = {}; // This way $watch can update tags after the resource call

      $scope.userId = storageFactory.getId();
      userFactory.init($scope.userId, 'Basic');

      $scope.poemId = $routeParams.id;
      if ($scope.poemId) {
        var resource = poemFactory.rGet($scope.poemId);

        resource.$promise.then(function(res) {
          console.log(res);
          $scope.creatorId = res.creator.id;
          $scope.title     = res.poem.title;
          $scope.poem      = res.poem.poem;
          $scope.tags      = res.poem.tags.join(', ');
          $scope.comments  = res.poem.comments;
        }, function(res) {
          console.log(res);
        });
      }

// functions -------------------------------------------------------------------

      $scope.saveComment = function() {
        console.log($scope.comment);

        var req     = {};
        req.comment = $scope.comment;

        var resource = userFactory.rSaveComment(req, $scope.poemId);

        resource.$promise.then(function(res) {
          console.log(res);
        }, function(res) {
          console.log(res);
        });
      };

    }
  ]);

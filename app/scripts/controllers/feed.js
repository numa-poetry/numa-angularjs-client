'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:FeedCtrl
 * @description
 * # FeedCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('FeedCtrl', ['$scope', 'poemFactory', 'storageFactory',
    'userFactory', 'helperFactory',
    function ($scope, poemFactory, storageFactory, userFactory,
      helperFactory) {

$scope.names=['Igor Minar', 'Brad Green', 'Dave Geddes', 'Naomi Black', 'Greg Weber', 'Dean Sofer', 'Wes Alvaro', 'John Scott', 'Daniel Nadasi'];
      var previousVote;
      $scope.poems = [];
      var id       = storageFactory.getId();
      userFactory.init(id, 'Basic');

      var resource = poemFactory.rGetAll();

      resource.$promise.then(function(res) {
        console.log(res);
        $scope.poems = res;
      }, function(res) {
        console.log(res);
      });

// functions -------------------------------------------------------------------

      $scope.timeSince = helperFactory.timeSince;

      $scope.changeVote = function(vote, flag) {
        previousVote = $scope.vote;
        $scope.vote  = vote === flag ? 'None' : flag;
        console.log($scope.vote);

        var req  = {};
        req.vote = $scope.vote;

        var resource = userFactory.rSaveVote(req, $scope.poemId);

        resource.$promise.then(function(res) {
          console.log(res);
          if ((req.vote === 'up' && previousVote === 'None') ||
            (req.vote === 'None' && previousVote === 'down')) {
            $scope.totalVotes += 1;
          } else if (req.vote === 'up' && previousVote === 'down') {
            $scope.totalVotes += 2;
          } else if ((req.vote === 'down' && previousVote === 'None') ||
            (req.vote === 'None' && previousVote === 'up')) {
            $scope.totalVotes -= 1;
          } else if (req.vote === 'down' && previousVote === 'up') {
            $scope.totalVotes -= 2;
          }
        }, function(res) {
          console.log(res);
        });
      };

    }
  ]);

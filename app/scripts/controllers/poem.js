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
    'userFactory', '$alert', 'helperFactory', '$rootScope', '$location',
    function ($scope, $routeParams, poemFactory, storageFactory, userFactory,
      $alert, helperFactory, $rootScope, $location) {

      $scope.tags = {}; // This way $watch can update tags after the resource call
      var previousVote;

      $scope.modalDeletePoem = {
        'title': 'Are you sure?'
      };

      $scope.modalDeleteComment = {
        'title': 'Are you sure?'
      };

      $scope.userId = storageFactory.getId();
      userFactory.init($scope.userId, 'Basic');

      $scope.poemId = $routeParams.id;
      if ($scope.poemId) {
        var poemResource = poemFactory.rGet($scope.poemId);

        poemResource.$promise.then(function(res) {
          console.log(res);
          $scope.creatorId          = res.poem.creator.id;
          $scope.creatorDisplayName = res.poem.creator.displayName;
          $scope.title              = res.poem.title;
          $scope.poem               = res.poem.poem;
          $scope.tags               = res.poem.tags.join(', ');
          $scope.comments           = res.poem.comments;
          $scope.totalVotes         = res.poem.positiveVotes - res.poem.negativeVotes;
        }, function(res) {
          console.log(res);
        });

        if ($rootScope.isAuthenticated) {
          var voteResource = userFactory.rGetVote($scope.poemId);

          voteResource.$promise.then(function(res) {
            $scope.vote = res.vote;
          }, function(res) {
            console.log(res);
          });
        }
      }

// functions -------------------------------------------------------------------

      $scope.deletePoem = function() {
        var resource = userFactory.rDeletePoem($scope.poemId);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            // title       : 'Hello, ' + req.displayName + '!',
            content     : 'You have successfully deleted your poem.',
            animation   : 'fadeZoomFadeDown'
          });

          $location.path('/feed');
        }, function(res) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 5,
            animation   : 'fadeZoomFadeDown'
          });
        });
      };

      $scope.deleteComment = function(commentId) {
        console.log('here');

        var resource = userFactory.rDeleteCommentAsCreator($scope.poemId, commentId);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            content     : 'Comment deleted.',
            animation   : 'fadeZoomFadeDown'
          });

          // find and remove comment from DOM
          for (var i = $scope.comments.length - 1; i >= 0; i--) {
            if ($scope.comments[i].id === commentId) {
              $scope.comments.splice(i,1);
            }
          };
          console.log($scope.comments);
        }, function(res) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            duration    : 5,
            placement   : top,
            content     : res.data.message,
            animation   : 'fadeZoomFadeDown'
          });
        });
      };

      $scope.saveComment = function() {
        console.log($scope.comment);

        var req     = {};
        req.comment = $scope.comment;

        if (req.comment === '' || req.comment === undefined) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            duration    : 5,
            content     : 'You haven\'t written anything!',
            animation   : 'fadeZoomFadeDown'
          });
          return;
        }

        var resource = userFactory.rSaveComment(req, $scope.poemId);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            content     : 'Comment saved.',
            animation   : 'fadeZoomFadeDown'
          });
          var creator         = {};
          creator.id          = storageFactory.getId();
          creator.displayName = userFactory.getDisplayName();
          creator.avatarUrl   = userFactory.getAvatarUrl();

          var comment         = {};
          comment.id          = res.commentId;
          comment.comment     = req.comment;
          comment.creator     = creator;
          comment.createdAt   = new Date();

          console.log(res);
          $scope.comments.push(comment);
        }, function(res) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 5,
            animation   : 'fadeZoomFadeDown'
          });
        });
      };

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

      $scope.timeSince = helperFactory.timeSince;

    }
  ]);

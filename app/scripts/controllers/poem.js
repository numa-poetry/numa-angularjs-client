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
    'userFactory', '$alert', 'helperFactory', '$rootScope', '$location', 'socket',
    '$sce', '$tooltip',
    function ($scope, $routeParams, poemFactory, storageFactory, userFactory,
      $alert, helperFactory, $rootScope, $location, socket, $sce, $tooltip) {

      $scope.userId = storageFactory.getId();
      userFactory.init($scope.userId, 'Basic');

      $scope.tags = {}; // This way $watch can update tags after the resource call
      var previousVote;

      $scope.modalDeletePoem = {
        'title': 'Are you sure?'
      };

      $scope.modalDeleteComment = {
        'title': 'Are you sure?'
      };

      $scope.tooltipPublished = {
        title   : 'Published to the feed.',
        checked : false
      };

      $scope.poemId = $routeParams.id;
      if ($scope.poemId) {
        var poemResource = poemFactory.rGet($scope.poemId);

        poemResource.$promise.then(function(res) {
          console.log(res);
          $scope.creatorAvatarUrl   = res.poem.creator.avatarUrl;
          $scope.creatorId          = res.poem.creator.id;
          $scope.creatorDisplayName = res.poem.creator.displayName;
          $scope.title              = res.poem.title;
          $scope.poem               = res.poem.poem;
          $scope.tags               = res.poem.tags.join(', ');
          $scope.isPublished        = res.poem.published;
          $scope.comments           = res.poem.comments;
          $scope.totalVotes         = res.poem.positiveVotes - res.poem.negativeVotes;

          if (res.poem.inspirations) {
            $scope.imageUrl = res.poem.inspirations.imageUrl;
            $scope.videoUrl = res.poem.inspirations.videoUrl;
          }
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

          var favoritedPoemResource = userFactory.rGetPoemAsFavoriteStatus($scope.poemId);

          favoritedPoemResource.$promise.then(function(res) {
            if (res.status === 'favorited') {
              $scope.favoritePoem = true;
            } else if (res.status === 'not_favorited') {
              $scope.favoritePoem = false;
            }
          }, function(res) {
            console.log(res);
          });
        }
      }

// functions -------------------------------------------------------------------

      $scope.timeSince = helperFactory.timeSince;

      $scope.restoreScrollbar = helperFactory.restoreScrollbar;

      socket.forward('newComment', $scope);
      var unregisterNewCommentEvent = $scope.$on('socket:newComment', function(ev, data) {
        console.log('newComment data', data);
      });

      $scope.$on('$destroy', function() {
        unregisterNewCommentEvent();
      });

      $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      }

      $scope.playPauseButton = function() {
        $scope.audio1.playPause();
      };

      $scope.deletePoem = function() {
        var resource = userFactory.rDeletePoem($scope.poemId);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            duration    : 3,
            title       : 'Success!',
            content     : 'You have deleted your poem.',
            animation   : 'fadeZoomFadeDown'
          });

          $location.path('/feed');
        }, function(res) {
          $alert({
            type        : 'material-err',
            title       : 'Oops!',
            content     : res.data.message,
            duration    : 3,
            animation   : 'fadeZoomFadeDown'
          });
        });
      };

      $scope.deleteComment = function(commentId) {
        var resource = userFactory.rDeleteComment($scope.poemId, commentId);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            duration    : 3,
            title       : 'Success!',
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
            duration    : 3,
            title       : 'Oops',
            content     : res.data.message,
            animation   : 'fadeZoomFadeDown'
          });
        });
      };

      $scope.saveComment = function() {
        var req     = {};
        req.comment = $scope.comment;

        if (req.comment === '' || req.comment === undefined) {
          $alert({
            type        : 'material-err',
            duration    : 3,
            title       : 'Oops!',
            content     : 'You haven\'t written anything!',
            animation   : 'fadeZoomFadeDown'
          });
          return;
        }

        var resource = userFactory.rSaveComment(req, $scope.poemId);

        resource.$promise.then(function(res) {
          // notify server->notify creator of new comment
          socket.emit('newComment', { creatorId : $scope.creatorId });

          // clear the comment box
          $scope.comment = "";
          $alert({
            type        : 'material',
            duration    : 3,
            title       : 'Success!',
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
            title       : 'Oops!',
            content     : res.data.message,
            duration    : 3,
            animation   : 'fadeZoomFadeDown'
          });
        });
      };

      $scope.saveFavoritedPoem = function() {
        var resource = userFactory.rSavePoemAsFavorite($scope.poemId);

        resource.$promise.then(function(res) {
          console.log(res);
          if (res.status === 'favorited') {
            $scope.favoritePoem = true;
          } else if (res.status === 'removed') {
            $scope.favoritePoem = false;
          }
        }, function(res) {
          console.log(res);
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

    }
  ]);

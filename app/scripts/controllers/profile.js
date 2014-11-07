'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('ProfileCtrl', ['$scope', 'userFactory', '$alert', 'storageFactory',
    '$location', '$rootScope', '$upload', '$routeParams', '$tooltip', 'helperFactory',
    function ($scope, userFactory, $alert, storageFactory, $location, $rootScope,
      $upload, $routeParams, $tooltip, helperFactory) {

      $scope.currentUserId = storageFactory.getId();
      $scope.userViewId    = $routeParams.id;
      userFactory.init($scope.userViewId, 'full');

      var unregister = $rootScope.$on('finishedSettingUserDataOnPageRefresh', function () {
        $scope.pdfUrl               = userFactory.getPdfUrl($scope.userViewId);
        $scope.displayName          = userFactory.getDisplayName();
        $scope.joinedDate           = userFactory.getJoinedDate();
        $scope.avatarUrl            = userFactory.getAvatarUrl();
        $scope.comments             = userFactory.getComments();
        $scope.favoritePoems        = userFactory.getFavoritePoems();
        $scope.unreadComments       = userFactory.getUnreadComments();
        $scope.unreadFollowingPoems = userFactory.getUnreadFollowingPoems();
        $scope.followersCount       = userFactory.getFollowersCount();
        $scope.followingCount       = userFactory.getFollowingCount();
        $scope.email = $scope.workingEmail = userFactory.getEmail();

        var poems     = userFactory.getPoems();
        $scope.poems  = [];
        $scope.drafts = [];
        for (var i = poems.length - 1; i >= 0; --i) {
          if (poems[i].published === true) {
            $scope.poems.push(poems[i]);
          } else {
            $scope.drafts.push(poems[i]);
          }
        };
      });

      if ($rootScope.isAuthenticated && $scope.currentUserId !== $scope.userViewId) {
        var resource = userFactory.rGetUserFollowUser($scope.userViewId);

        resource.$promise.then(function(res) {
          console.log(res);
          if (res.following === 'yes') {
            $scope.isFollowing = true;
          } else {
            $scope.isFollowing = false;
          }
        }, function(res) {
          console.log(res);
          $scope.isFollowing = false;
        });
      }

      $scope.$on('$destroy', function() {
        unregister();
      });

      $scope.modal = {
        'title': 'Are you sure?'
      };

      $scope.tooltipChangeAvatar = {
        title   : 'Change your avatar',
        checked : false
      };

      $scope.tooltipEditProfile = {
        title   : 'Edit profile.',
        checked : false
      };


      $scope.tabs = [
        { title:'Poems' },
        { title:'Comments' }
      ];

      // Temporary Amazon S3 bucket credentials. All images stored here for processing,
      // then transferred to permanent bucket.
      // Credentials invalidated for now.
      // $scope.creds = {
      //   bucketName      : 'numa-temp',
      //   accessKeyId     : 'AKIAIQXDLJ23NA3YRHCQ',
      //   secretAccessKey : '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'
      // };

      $scope.editorEnabled = false;
      $scope.sizeLimit     = 5292880; // 5MB in bytes
      $scope.uploading     = false;

// functions -------------------------------------------------------------------

      $scope.go = helperFactory.go;

      $scope.restoreScrollbar = helperFactory.restoreScrollbar;

      $scope.viewFollowing = function(flag) {
        if (flag === true) {
          $scope.viewFollowingEnabled = false;
          return;
        } else {
          var resource = userFactory.rGetUserFollowing();

          resource.$promise.then(function(res) {
            console.log(res);
            $scope.following            = res.following;
            $scope.viewFollowingEnabled = true;
          }, function(res) {
            console.log(res);
          });
        }
      };

      $scope.viewFollowers = function(flag) {
        if (flag === true) {
          $scope.viewFollowersEnabled = false;
          return;
        } else {
          var resource = userFactory.rGetUserFollowers();

          resource.$promise.then(function(res) {
            console.log(res);
            $scope.followers            = res.followers;
            $scope.viewFollowersEnabled = true;
          }, function(res) {
            console.log(res);
          });
        }
      };

      $scope.followUser = function() {
        var resource = userFactory.rSaveUserFollowUser($scope.userViewId);

        resource.$promise.then(function(res) {
          $scope.isFollowing = true;
          $scope.followersCount = parseInt($scope.followersCount) + 1;
          $alert({
            type        : 'material',
            title       : 'Success!',
            content     : 'You are now following ' + $scope.displayName + '.',
            duration    : 3,
            animation   : 'fadeZoomFadeDown'
          });
        }, function(res) {
          console.log(res);
        });
      };

      $scope.unfollowUser = function() {
        var resource = userFactory.rSaveUserUnfollowUser($scope.userViewId);

        resource.$promise.then(function(res) {
          $scope.isFollowing = false;
          $scope.followersCount = parseInt($scope.followersCount) - 1;
          $alert({
            type        : 'material',
            title       : 'Success!',
            content     : 'You won\'t receive anymore updates from ' + $scope.displayName + '.',
            duration    : 3,
            animation   : 'fadeZoomFadeDown'
          });
        }, function(res) {
          console.log(res);
        });
      }

      $scope.fileSizeLabel = function() {
        // Convert bytes to MB
        return Math.round($scope.sizeLimit / 1024 / 1024) + ' MB';
      };

      $scope.uniqueString = function() {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 8; ++i) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
      };

      // $scope.upload = function() {
      //   $scope.uploading      = true;
      //   $scope.uploadProgress = 0;

      //   // configure the S3 object
      //   AWS.config.update({
      //     accessKeyId     : $scope.creds.accessKeyId,
      //     secretAccessKey : $scope.creds.secretAccessKey
      //   });
      //   AWS.config.region = 'us-west-1';
      //   var s3Bucket = new AWS.S3({
      //     params: {
      //       Bucket: $scope.creds.bucketName
      //     }
      //   });

      //   if ($scope.file) {

      //     // Check file extension
      //     if ($scope.file.type !== 'image/png' && $scope.file.type !== 'image/jpeg') {
      //       $alert({
      //         type        : 'material-err',
      //         title       : 'Oops! ',
      //         content     : 'Only PNG and JPEG types are accepted.',
      //         duration    : 5,
      //         animation   : 'fadeZoomFadeDown'
      //       });
      //       $scope.uploading = false;
      //       return;
      //     }

      //     // Perform File Size Check First
      //     var fileSize = Math.round(parseInt($scope.file.size));
      //     if (fileSize > $scope.sizeLimit) {
      //       $alert({
      //         type        : 'material-err',
      //         title       : 'Oops! ',
      //         content     : 'Maximum file size is 5 MB. Your image is ' +
      //           $scope.fileSizeLabel() + '. Please upload a smaller image.',
      //         duration    : 5,
      //         animation   : 'fadeZoomFadeDown'
      //       });
      //       $scope.uploading = false;
      //       return;
      //     }

      //     // Prepend unique string to prevent overwrites
      //     var uniqueFileName = $scope.uniqueString() + '-' + $scope.file.name;

      //     var params = {
      //       Key                  : uniqueFileName,
      //       ContentType          : $scope.file.type,
      //       Body                 : $scope.file,
      //       ServerSideEncryption : 'AES256'
      //     };

      //     s3Bucket.putObject(params, function(err, data) {
      //       if (err) {
      //         $alert({
      //           type        : 'material-err',
      //           title       : 'Oops! ',
      //           content     : 'Please try again.',
      //           duration    : 5,
      //           animation   : 'fadeZoomFadeDown'
      //         });
      //         console.log(err.code, err.message);
      //         $scope.uploading = false;
      //         return;
      //       } else {
      //         // Call backend for image processing
      //         var req        = {};
      //         req.fileName   = uniqueFileName;

      //         var resource = userFactory.rSaveAvatarUrl(req);

      //         resource.$promise.then(function(res) {
      //           // display it to user / store to userFactory
      //           $alert({
      //             type        : 'material',
      //             title       : 'Success! ',
      //             content     : 'Profile pic updated.',
      //             duration    : 5,
      //             animation   : 'fadeZoomFadeDown'
      //           });
      //           $scope.avatarUrl = res.avatarUrl;
      //           console.log(res);
      //           $scope.uploading = false;
      //         }, function(res) {
      //           console.log(res);
      //           $scope.uploading = false;
      //         });

      //       }
      //     }).on('httpUploadProgress', function(progress) {
      //       console.log('percent completed:', Math.round(progress.loaded / progress.total * 100));
      //     });
      //   } else {
      //     $alert({
      //       type        : 'material-err',
      //       title       : 'Oops! ',
      //       content     : 'Please select an image to upload.',
      //       duration    : 5,
      //       animation   : 'fadeZoomFadeDown'
      //     });
      //     $scope.uploading = false;
      //   }
      // };

      $scope.onFileSelect = function(image) {
        $scope.uploading = true;
        if (angular.isArray(image)) {
          image = image[0];
        }

        if (image.type !== 'image/png' && image.type !== 'image/jpeg' &&
          image.type !== 'image/jpg' && image.type !== 'image/gif') {
          $alert({
            type        : 'material-err',
            title       : 'Oops!',
            content     : 'Only PNG, GIF, JPG, and JPEG are allowed.',
            duration    : 3,
            animation   : 'fadeZoomFadeDown'
          });
          $scope.uploading = false;
          return;
        }

        $scope.upload = $upload.upload({
          url: 'http://localhost:3000/api/v1/user/' + userFactory.getId() + '/avatar',
          method: 'POST',
          file: image
        }).progress(function(event) {
          console.log('percent completed:', parseInt(100.0 * event.loaded / event.total));
        }).success(function(data) {
          console.log(data);

          $alert({
            type        : 'material',
            title       : 'Success! ',
            content     : 'Profile pic updated.',
            duration    : 3,
            animation   : 'fadeZoomFadeDown'
          });
          $scope.avatarUrl = data.avatarUrl;
          $scope.uploading = false;
        }).error(function(err) {
          console.log('Error uploading file: ' + err.message || err);
          $scope.uploading = false;
        });
      };

      $scope.enableEditor = function() {
        $scope.editorEnabled = true;
      };

      $scope.disableEditor = function() {
        $scope.editorEnabled = false;
      };

      $scope.save = function() {
        var req   = {};
        req.email = $scope.email;

        var http = userFactory.hUpdateUser(req);
        http.then(function(res) {
          $scope.editorEnabled = false;
          $scope.workingEmail  = $scope.email;
          $alert({
            type        : 'material',
            duration    : 3,
            title       : 'Success!',
            content     : 'You have updated your profile.',
            animation   : 'fadeZoomFadeDown'
          });
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

      $scope.deleteAccount = function() {
        var resource = userFactory.rDeleteAccount();

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            duration    : 3,
            title       : 'Success!',
            content     : 'You have deleted your account.',
            animation   : 'fadeZoomFadeDown'
          });
          storageFactory.deleteId();
          storageFactory.deleteToken();
          userFactory.deleteInfo();
          $location.path('/');
          $rootScope.isAuthenticated = false; // temp fix to work with satellizer
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

      $scope.markPoemAsRead = function(poemId) {
        var resource = userFactory.rMarkPoemAsRed(poemId);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            duration    : 3,
            title       : 'Success!',
            content     : 'Poem marked as read.',
            animation   : 'fadeZoomFadeDown'
          });
          for (var i = $scope.unreadFollowingPoems.length - 1; i >= 0; --i) {
            if ($scope.unreadFollowingPoems[i].id === poemId) {
              $scope.unreadFollowingPoems.splice(i,1);
            }
          };
        }, function(res) {
          $alert({
            type        : 'material-err',
            duration    : 3,
            title       : 'Oops!',
            content     : res.data.message,
            animation   : 'fadeZoomFadeDown'
          });
        });
      };

      $scope.markCommentAsRead = function(poemId, commentId) {
        var resource = userFactory.rMarkCommentAsRead(poemId, commentId);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            duration    : 3,
            title       : 'Success!',
            content     : 'Comment marked as read.',
            animation   : 'fadeZoomFadeDown'
          });
          for (var i = $scope.unreadComments.length - 1; i >= 0; --i) {
            if ($scope.unreadComments[i].id === commentId) {
              $scope.unreadComments.splice(i,1);
            }
          };
        }, function(res) {
          $alert({
            type        : 'material-err',
            duration    : 3,
            title       : 'Oops!',
            content     : res.data.message,
            animation   : 'fadeZoomFadeDown'
          });
        });
      };

      $scope.deleteComment = function(poemId, commentId, unread) {
        var resource = userFactory.rDeleteComment(poemId, commentId);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            duration    : 3,
            title       : 'Success!',
            content     : 'Comment deleted.',
            animation   : 'fadeZoomFadeDown'
          });

          if (unread === true) {
            for (var i = $scope.unreadComments.length - 1; i >= 0; --i) {
              if ($scope.unreadComments[i].id === commentId) {
                $scope.unreadComments.splice(i,1);
              }
            };
          } else {
            for (var i = $scope.comments.length - 1; i >= 0; --i) {
              if ($scope.comments[i].id === commentId) {
                $scope.comments.splice(i,1);
              }
            };
          }
        }, function(res) {
          $alert({
            type        : 'material-err',
            duration    : 3,
            title       : 'Oops!',
            content     : res.data.message,
            animation   : 'fadeZoomFadeDown'
          });
        });
      };

    }
  ]);

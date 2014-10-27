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
    '$location', '$rootScope', '$upload', '$routeParams', '$tooltip',
    function ($scope, userFactory, $alert, storageFactory, $location, $rootScope,
      $upload, $routeParams, $tooltip) {

      // console.log('params=>', $routeParams.id);

      $scope.currentUserId = storageFactory.getId();
      $scope.userViewId    = $routeParams.id;

      console.log('$scope.currentUserId',$scope.currentUserId);
      console.log('$scope.userViewId', $scope.userViewId);
      console.log('is isAuthenticated:', $rootScope.isAuthenticated)

      userFactory.init($routeParams.id, 'full');

        // $scope.displayName   = userFactory.getDisplayName();
        // $scope.joinedDate    = userFactory.getJoinedDate();
        // $scope.avatarUrl     = userFactory.getAvatarUrl();
        // $scope.poems         = userFactory.getPoems();
        // $scope.comments      = userFactory.getComments();
        // $scope.favoritePoems = userFactory.getFavoritePoems();
        // $scope.email = $scope.workingEmail = userFactory.getEmail();

      var unregister = $rootScope.$on('finishedSettingUserDataOnPageRefresh', function () {
        $scope.displayName    = userFactory.getDisplayName();
        $scope.joinedDate     = userFactory.getJoinedDate();
        $scope.avatarUrl      = userFactory.getAvatarUrl();
        $scope.poems          = userFactory.getPoems();
        $scope.comments       = userFactory.getComments();
        $scope.favoritePoems  = userFactory.getFavoritePoems();
        $scope.unreadComments = userFactory.getUnreadComments();
        $scope.email = $scope.workingEmail = userFactory.getEmail();
      });

      var resource = userFactory.rGetUserFollowUser($scope.userViewId);

      resource.$promise.then(function(res) {
        console.log(res);
        $scope.isFollowing = true;
      }, function(res) {
        console.log(res);
        $scope.isFollowing = false;
      });

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
      $scope.creds = {
        bucketName      : 'numa-temp',
        accessKeyId     : 'AKIAIQXDLJ23NA3YRHCQ',
        secretAccessKey : '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'
      };

      $scope.editorEnabled = false;
      $scope.sizeLimit     = 5292880; // 5MB in bytes
      $scope.uploading     = false;

// functions -------------------------------------------------------------------

      $scope.followUser = function() {
        var resource = userFactory.rSaveUserFollowUser($scope.userViewId);

        resource.$promise.then(function(res) {
          $scope.isFollowing = true;
          $alert({
            type        : 'material',
            dismissable : true,
            title       : 'Success!',
            content     : 'You are now following ' + $scope.displayName + '.',
            duration    : 5,
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
          $alert({
            type        : 'material',
            dismissable : true,
            title       : 'Success!',
            content     : 'You won\'t receive anymore updates from ' + $scope.displayName + '.',
            duration    : 5,
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
      //         dismissable : true,
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
      //         dismissable : true,
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
      //           dismissable : true,
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
      //             dismissable : true,
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
      //       dismissable : true,
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

        if (image.type !== 'image/png' && image.type !== 'image/jpeg' && image.type !== 'image/jpg' &&
            image.type !== 'image/gif') {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : 'Only PNG, GIF, JPG, and JPEG are allowed.',
            duration    : 5,
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
            dismissable : true,
            title       : 'Success! ',
            content     : 'Profile pic updated.',
            duration    : 5,
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

        // console.log('req:',req);

        var http = userFactory.hUpdateUser(req);
        http.then(function(res) {
          $scope.editorEnabled = false;
          $scope.workingEmail  = $scope.email;
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            content     : 'You have successfully updated your profile.',
            animation   : 'fadeZoomFadeDown'
          });
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

      $scope.markAsRead = function() {

      };

      $scope.deleteAccount = function() {
        var resource = userFactory.rDeleteAccount();

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            // title       : 'Hello, ' + req.displayName + '!',
            content     : 'You have successfully deleted your account.',
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
            dismissable : true,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 5,
            animation   : 'fadeZoomFadeDown'
          });
        });
      };

      $scope.deleteComment = function(poemId, commentId, unread) {
        var resource = userFactory.rDeleteComment(poemId, commentId);

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
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
            // find and remove comment from DOM
            for (var i = $scope.comments.length - 1; i >= 0; --i) {
              if ($scope.comments[i].id === commentId) {
                $scope.comments.splice(i,1);
              }
            };
          }
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

    }
  ]);

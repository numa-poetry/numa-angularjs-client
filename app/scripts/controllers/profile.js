'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('ProfileCtrl', ['$scope', 'userFactory', '$alert', 'storageFactory',
    '$location', 'ngProgress', '$rootScope', '$upload',
    function ($scope, userFactory, $alert, storageFactory, $location, ngProgress,
      $rootScope, $upload) {

      userFactory.init();

      $rootScope.$on('finishedSettingUserDataOnPageRefresh', function () {
        $scope.email      = userFactory.getEmail();
        $scope.joinedDate = userFactory.getJoinedDate();
      });

      $scope.editorEnabled = false;

      $scope.modal = {
        'title' : 'Are you sure?'
      };

      $scope.creds = {
        bucketName      : 'numa-temp',
        accessKeyId     : 'AKIAIQXDLJ23NA3YRHCQ',
        secretAccessKey : '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'
      };

      $scope.sizeLimit = 5292880; // 5MB in bytes

// functions -------------------------------------------------------------------

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

      $scope.upload = function() {
        $scope.uploadProgress = 0;

        // configure the S3 object
        AWS.config.update({
          accessKeyId     : $scope.creds.accessKeyId,
          secretAccessKey : $scope.creds.secretAccessKey
        });
        AWS.config.region = 'us-west-1';
        var s3Bucket = new AWS.S3({
          params: {
            Bucket: $scope.creds.bucketName
          }
        });

        if ($scope.file) {

          if ($scope.file.type !== 'image/png' && $scope.file.type !== 'image/jpeg') {
            $alert({
              type        : 'material-err',
              dismissable : true,
              title       : 'Oops! ',
              content     : 'Only PNG and JPEG types are accepted.',
              duration    : 5
            });
            return;
          }

          // Perform File Size Check First
          var fileSize = Math.round(parseInt($scope.file.size));
          if (fileSize > $scope.sizeLimit) {
            $alert({
              type        : 'material-err',
              dismissable : true,
              title       : 'Oops! ',
              content     : 'Maximum file size is 5 MB. Your image is ' +
                $scope.fileSizeLabel() + '. Please upload a smaller image.',
              duration    : 5
            });
            return false;
          }

          // Prepend unique string to prevent overwrites
          var uniqueFileName = $scope.uniqueString() + '-' + $scope.file.name;

          var params = {
            Key                  : uniqueFileName,
            ContentType          : $scope.file.type,
            Body                 : $scope.file,
            ServerSideEncryption : 'AES256'
          };

          s3Bucket.putObject(params, function(err, data) {
            if (err) {
              console.log(err.code, err.message);
              $alert({
                type        : 'material-err',
                dismissable : true,
                title       : 'Oops! ',
                content     : 'Please try again.',
                duration    : 5
              });
              return false;
            } else {
              // $alert({
              //   type        : 'material',
              //   dismissable : true,
              //   title       : 'Success! ',
              //   content     : 'Profile pic updated.',
              //   duration    : 5
              // });

              // Call backend to move to permanent storage
              var req        = {};
              req.fileName   = uniqueFileName;

              var resource = userFactory.rGetProfileImage(req);

              resource.$promise.then(function(res) {
                // display it to user / store to userFactory
                console.log(res);
              }, function(res) {
                console.log(res);
              });

            }
          }).on('httpUploadProgress', function(progress) {
            $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
          });
        } else {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : 'Please select an image to upload.',
            duration    : 5
          });
        }
      };

      // $scope.onFileSelect = function(image) {
      //   $scope.uploadInProgress = true;
      //   $scope.uploadProgress = 0;

      //   if (angular.isArray(image)) {
      //     image = image[0];
      //   }

      //   console.log('image:', image);
      //   console.log('type:', image.type);

      //   if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
      //     $alert({
      //       type        : 'material-err',
      //       dismissable : true,
      //       title       : 'Oops! ',
      //       content     : 'Only PNG and JPEG types are accepted.',
      //       duration    : 5
      //     });
      //     return;
      //   }

      //   $scope.upload = $upload.upload({
      //     url: 'http://localhost:3000/api/v1/user/' + 'Azy18V47AbTZ09M69RJ1' + '/upload/image',
      //     method: 'POST',
      //     data: {
      //       type: 'profile'
      //     },
      //     file: image
      //   }).progress(function(event) {
      //     $scope.uploadProgress = Math.floor(event.loaded / event.total);
      //     // $scope.$apply();
      //   }).success(function(data, status, headers, config) {
      //     console.log('Photo uploaded!');
      //     $scope.uploadedImage = JSON.parse(data);
      //   }).error(function(err) {
      //     $scope.uploadInProgress = false;
      //     console.log('Error uploading file: ' + err.message || err);
      //   });
      // };

      $scope.enableEditor = function() {
        $scope.editorEnabled = true;
      };

      $scope.disableEditor = function() {
        $scope.editorEnabled = false;
      };

      $scope.save = function() {
        ngProgress.start();

        var req = {};
        req.email = $scope.email;

        var http = userFactory.hUpdateUser(req);
        http.then(function(res) {
          // console.log('good res:', res);
          $scope.editorEnabled = false;
          $scope.email = res.data.user.email;
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            content     : 'You have successfully updated your profile.'
          });
          ngProgress.complete();
        }, function(res) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 5
          });
          ngProgress.complete();
        });
      };

      $scope.deleteAccount = function() {
        ngProgress.start();
        var resource = userFactory.rDeleteAccount();

        resource.$promise.then(function(res) {
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            placement   : top,
            // title       : 'Hello, ' + req.displayName + '!',
            content     : 'You have successfully deleted your account.'
          });
          storageFactory.deleteId();
          storageFactory.deleteToken();
          userFactory.deleteInfo();

          $location.path('/');

          $rootScope.isAuthenticated = false; // temp fix to work with satellizer
          ngProgress.complete();
        }, function(res) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 5
          });
          ngProgress.complete();
        });

      };

    }
  ]);

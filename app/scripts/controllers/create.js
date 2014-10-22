'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('CreateCtrl', ['$scope', '$resource', '$alert', 'userFactory',
    '$location', 'storageFactory', '$upload',
    function ($scope, $resource, $alert, userFactory, $location, storageFactory,
      $upload) {

      $scope.tagOptions = ['love', 'life', 'happiness'];

      $scope.tagConfig = {
        create: true,
        placeholder: 'Add tags to your poem for others to easily find it...',
      };

      var id = storageFactory.getId();
      userFactory.init(id, 'Basic');

      $scope.title = 'Untitled';

// functions -------------------------------------------------------------------

      $scope.removeImageFromS3 = function() {
        if ($scope.imageUrl) {
          var req      = {};
          req.imageUrl = $scope.imageUrl;

          var http = userFactory.hDeletePoemImage(req);

          http.then(function(res) {
            console.log(res);
          }, function(res) {
            console.log(res);
          });
        }
      }

      $scope.onFileSelect = function(image) {
        // remove previously uploaded image

        $scope.uploading = true;
        if (angular.isArray(image)) {
          image = image[0];
        }

        if (image.file.type !== 'image/png' && image.file.type !== 'image/jpeg' && image.file.type !== 'image/jpg' &&
            image.file.type !== 'image/gif') {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : 'Only PNG, GIF, JPG, and JPEG are allowed.',
            duration    : 5,
            animation   : 'fadeZoomFadeDown'
          });
          image.cancel();
          $scope.uploading = false;
          return;
        }

        $scope.upload = $upload.upload({
          url: 'http://localhost:3000/api/v1/user/' + storageFactory.getId() + '/poem/image',
          method: 'POST',
          file: image.file
        }).progress(function(event) {
          console.log('percent completed:', parseInt(100.0 * event.loaded / event.total));
        }).success(function(data) {
          console.log(data);
          $alert({
            type        : 'material',
            dismissable : true,
            title       : 'Success! ',
            content     : 'Image uploaded.',
            duration    : 5,
            animation   : 'fadeZoomFadeDown'
          });
          $scope.uploading = false;
          $scope.imageUrl = data.imageUrl;
        }).error(function(err) {
          console.log('Error uploading file: ' + err.message || err);
          $scope.uploading = false;
        });
      };

      $scope.savePoem = function() {
        var req      = {};
        req.poem     = $scope.poem;
        req.title    = $scope.title;
        req.tags     = $scope.tags;
        req.imageUrl = $scope.imageUrl;
        // console.log('req:', req);

        if (req.poem === '' || req.poem === undefined) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            duration    : 5,
            content     : 'You haven\'t written anything yet!',
            animation   : 'fadeZoomFadeDown'
          });
          return;
        }

        if (req.title === '' || req.poem === undefined || req.title === 'Untitled') {
          $alert({
            type        : 'material-err',
            dismissable : true,
            duration    : 5,
            content     : 'You haven\'t spiced up your title!',
            animation   : 'fadeZoomFadeDown'
          });
          return;
        }

        var resource = userFactory.rSavePoem(req);

        resource.$promise.then(function(res) {
          console.log('good res:', res);
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            title       : 'Poem saved.',
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

    }
  ]);
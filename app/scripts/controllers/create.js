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
    '$location', 'storageFactory', '$upload', '$sce', '$tooltip',
    'endpointConstants',
    function ($scope, $resource, $alert, userFactory, $location, storageFactory,
      $upload, $sce, $tooltip, endpointConstants) {

      var id = storageFactory.getId();
      userFactory.init(id, 'Basic');

      $scope.tagOptions = ['love', 'life', 'happiness'];

      $scope.tagConfig = {
        create: true,
        placeholder: 'Add tags to your poem for others to easily find it...',
      };

      $scope.publishPopover = {
        title   : 'Publishing',
        content : 'Publish your poem to the main feed for others to enjoy and ' +
                  'provide feedback.<br /> Otherwise it will be saved as a ' +
                  'draft which you can find from your profile.',
        checked : false
      };

      $scope.title = 'Untitled';

// functions -------------------------------------------------------------------

      $scope.savePoemAndImage = function(image) {
        if ($scope.poem === '' || $scope.poem === undefined) {
          $alert({
            type        : 'material-err',
            duration    : 3,
            title       : 'Oops!',
            content     : 'You haven\'t written anything yet.',
            animation   : 'fadeZoomFadeDown'
          });
          return;
        }

        if ($scope.title === '' || $scope.poem === undefined || $scope.title === 'Untitled') {
          $alert({
            type        : 'material-err',
            duration    : 3,
            title       : 'Oops!',
            content     : 'You haven\'t spiced up your title.',
            animation   : 'fadeZoomFadeDown'
          });
          return;
        }

        if (typeof image !== 'undefined' && image.length > 0) {
          if (angular.isArray(image)) {
            image = image[0];
          }

          if (image.file.type !== 'image/png' && image.file.type !== 'image/jpeg' &&
            image.file.type !== 'image/jpg' && image.file.type !== 'image/gif') {
            $alert({
              type        : 'material-err',
              duration    : 3,
              title       : 'Oops!',
              content     : 'Only PNG, GIF, JPG, and JPEG are allowed.',
              animation   : 'fadeZoomFadeDown'
            });
            image.cancel();
            return;
          }

          $scope.upload = $upload.upload({
            url    : endpointConstants.serverDomain + endpointConstants.apiVersion +
              '/user/' + storageFactory.getId() + '/poem/image',
            method : 'POST',
            file   : image.file
          }).success(function(data) {
            var req       = {};
            req.poem      = $scope.poem;
            req.title     = $scope.title;
            req.tags      = $scope.tags;
            req.videoUrl  = $scope.videoUrl;
            req.published = $scope.toPublish || false;
            req.imageUrl  = data.imageUrl;
            // console.log(req);

            var resource = userFactory.rSavePoem(req);

            resource.$promise.then(function(res) {
              $alert({
                type        : 'material',
                duration    : 3,
                title       : 'Success!',
                content     : 'Your poem has been saved.',
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
          }).error(function(err) {
            console.log('Error uploading file: ' + err.message || err);
          });
        } else {
          var req       = {};
          req.poem      = $scope.poem;
          req.title     = $scope.title;
          req.tags      = $scope.tags;
          req.videoUrl  = $scope.videoUrl;
          req.published = $scope.toPublish || false;
          // console.log(req);

          var resource = userFactory.rSavePoem(req);

          resource.$promise.then(function(res) {
            $alert({
              type        : 'material',
              duration    : 3,
              title       : 'Success!',
              content     : 'Your poem has been saved.',
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
        }
      };

    }
  ]);
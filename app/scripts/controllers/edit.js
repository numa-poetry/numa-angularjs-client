'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:EditCtrl
 * @description
 * # EditCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('EditCtrl', ['$scope', '$routeParams', 'poemFactory', 'storageFactory',
    'userFactory', '$alert', '$location', '$upload',
    function ($scope, $routeParams, poemFactory, storageFactory, userFactory,
      $alert, $location, $upload) {

      $scope.userId = storageFactory.getId();
      userFactory.init($scope.userId, 'Basic');

      $scope.tagOptions = ['love', 'life', 'happiness'];

      $scope.tagConfig = {
        create: true,
        placeholder: 'Add tags to your poem for others to easily find it...',
      };

      var poemId = $routeParams.id;
      if (poemId) {
        var resource = poemFactory.rGet(poemId);

        resource.$promise.then(function(res) {
          console.log(res);
          $scope.title    = res.poem.title;
          $scope.poem     = res.poem.poem;
          $scope.tags     = res.poem.tags;
          $scope.imageUrl = res.poem.inspirations.imageUrl;
          $scope.videoUrl = res.poem.inspirations.videoUrl;
        }, function(res) {
          console.log(res);
        });
      }

// functions -------------------------------------------------------------------

      $scope.removeImage = function() {
        if ($scope.imageUrl) {
          var req      = {};
          req.imageUrl = $scope.imageUrl;
          req.id       = poemId

          var http = userFactory.hDeletePoemImage(req);

          http.then(function(res) {
            console.log(res);
            $scope.imageUrl = undefined;
          }, function(res) {
            console.log(res);
          });
        }
      }

      $scope.updatePoemAndImage = function(image) {
        if ($scope.poem === '' || $scope.poem === undefined) {
          $alert({
            type        : 'material-err',
            duration    : 3,
            title       : 'Oops!',
            content     : 'You haven\'t written anything yet!',
            animation   : 'fadeZoomFadeDown'
          });
          return;
        }

        if ($scope.title === '' || $scope.poem === undefined || $scope.title === 'Untitled') {
          $alert({
            type        : 'material-err',
            duration    : 3,
            title       : 'Oops!',
            content     : 'You haven\'t spiced up your title!',
            animation   : 'fadeZoomFadeDown'
          });
          return;
        }

        var req        = {};
        req.id         = $routeParams.id;
        req.poem       = $scope.poem;
        req.title      = $scope.title;
        req.tags       = $scope.tags;
        req.videoUrl   = $scope.videoUrl;
        req.imageUrl   = '';

        // If an image has been added, update the scope property before the request
        if (image.length > 0 && image !== undefined) {

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
            url    : 'http://localhost:3000/api/v1/user/' + storageFactory.getId() + '/poem/image',
            method : 'POST',
            file   : image.file
          }).success(function(data) {
            req.imageUrl    = data.imageUrl;
            var http        = userFactory.hUpdatePoem(req);

            http.then(function(res) {
              $alert({
                type        : 'material',
                duration    : 3,
                title       : 'Success!',
                content     : 'Your poem has been updated.',
                animation   : 'fadeZoomFadeDown'
              });

              $location.path('/poem/' + req.id);
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
          req.imageUrl = $scope.imageUrl;
          var http = userFactory.hUpdatePoem(req);

          http.then(function(res) {
            $alert({
              type        : 'material',
              duration    : 3,
              title       : 'Success!',
              content     : 'Your poem has been updated.',
              animation   : 'fadeZoomFadeDown'
            });

            $location.path('/poem/' + req.id);
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
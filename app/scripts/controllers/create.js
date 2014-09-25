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
    '$location', 'storageFactory',
    function ($scope, $resource, $alert, userFactory, $location, storageFactory) {

      $scope.tagOptions = ['love', 'life', 'happiness'];

      $scope.tagConfig = {
        create: true,
        placeholder: 'Add tags to your poem for others to easily find it...',
      };

      var id = storageFactory.getId();
      userFactory.init(id, 'Basic');

      $scope.title = 'Untitled';

// functions -------------------------------------------------------------------

      $scope.savePoem = function() {
        var req   = {};
        req.poem  = $scope.poem;
        req.title = $scope.title;
        req.tags  = $scope.tags;
        // console.log('req:', req);

        if (req.poem === '' || req.poem === undefined) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            duration    : 5,
            content     : 'You haven\'t written anything yet!'
          });
          return;
        }

        if (req.title === '' || req.poem === undefined || req.title === 'Untitled') {
          $alert({
            type        : 'material-err',
            dismissable : true,
            duration    : 5,
            content     : 'You haven\'t spiced up your title!'
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
            title       : 'Poem saved.'
          });

          $location.path('/feed');
        }, function(res) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 5
          });
        });
      };

    }
  ]);
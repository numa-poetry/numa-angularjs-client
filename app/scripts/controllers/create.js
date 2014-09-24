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
        delimiter: '|',
        placeholder: 'Describe your poem...',
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
        console.log('req:', req);

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
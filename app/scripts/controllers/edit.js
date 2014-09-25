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
    'userFactory', '$alert', '$location',
    function ($scope, $routeParams, poemFactory, storageFactory, userFactory,
      $alert, $location) {

      $scope.tagOptions = ['love', 'life', 'happiness'];

      $scope.tagConfig = {
        create: true,
        placeholder: 'Add tags to your poem for others to easily find it...',
      };

      $scope.userId = storageFactory.getId();
      userFactory.init($scope.userId, 'Basic');

      var poemId = $routeParams.id;
      if (poemId) {
        console.log($routeParams);
        var resource = poemFactory.rGet(poemId);

        resource.$promise.then(function(res) {
          $scope.title     = res.poem.title;
          $scope.poem      = res.poem.poem;
          $scope.tags      = res.poem.tags;
        }, function(res) {
          console.log(res);
        });
      }

// functions -------------------------------------------------------------------

      $scope.updatePoem = function() {
        var req   = {};
        req.id    = $routeParams.id;
        req.poem  = $scope.poem;
        req.title = $scope.title;
        req.tags  = $scope.tags;
        console.log('req:', req);

        var http = userFactory.hUpdatePoem(req);

        http.then(function(res) {
          console.log('good res:', res);
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            title       : 'Poem saved.'
          });

          $location.path('/poem/' + req.id);
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
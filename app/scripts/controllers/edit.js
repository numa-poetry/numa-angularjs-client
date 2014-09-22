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
    'userFactory', '$location', '$alert',
    function ($scope, $routeParams, poemFactory, storageFactory, userFactory,
      $location, $alert) {

      $scope.userId = storageFactory.getId();
      userFactory.init($scope.userId, 'Basic');

      var poemId = $routeParams.id;
      if (poemId) {
        console.log($routeParams);
        var resource = poemFactory.get(poemId);

        resource.$promise.then(function(res) {
          $scope.title     = res.poem.title;
          $scope.poem      = res.poem.poem;
        }, function(res) {
          console.log(res);
        });
      }

// functions -------------------------------------------------------------------

      $scope.go = function(path) {
        $location.path(path + '/' + poemId);
      };

      $scope.updatePoem = function() {
        var req   = {};
        req.id    = $routeParams.id;
        req.poem  = $scope.poem;
        req.title = $scope.title;
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
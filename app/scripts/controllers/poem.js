'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:PoemsCtrl
 * @description
 * # PoemsCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('PoemCtrl', ['$scope', '$routeParams', 'poemFactory', 'storageFactory',
    'userFactory',
    function ($scope, $routeParams, poemFactory, storageFactory, userFactory) {

      var userId = storageFactory.getId();
      userFactory.init(userId, 'Basic');

      var poemId = $routeParams.id;
      if (poemId) {
        var resource = poemFactory.get(poemId);

        resource.$promise.then(function(res) {
          console.log(res);
          $scope.title = res.poem.title;
          $scope.poem  = res.poem.poem;
        }, function(res) {
          console.log(res);
        });
      }
    }
  ]);

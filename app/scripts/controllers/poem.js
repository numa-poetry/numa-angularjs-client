'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:PoemsCtrl
 * @description
 * # PoemsCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('PoemCtrl', ['$scope', '$routeParams', 'poemFactory',
    function ($scope, $routeParams, poemFactory) {

      var id = $routeParams.id;
      if (id) {
        var resource = poemFactory.get(id);

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

'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:FeedCtrl
 * @description
 * # FeedCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('FeedCtrl', ['$scope', 'poemFactory', 'storageFactory',
    'userFactory', 'helperFactory',
    function ($scope, poemFactory, storageFactory, userFactory,
      helperFactory) {

      $scope.poems         = [];
      $scope.searchByTitle = false;
      $scope.searchByTag   = false;
      var id               = storageFactory.getId();
      userFactory.init(id, 'Basic');

      var resource = poemFactory.rGetAll();

      resource.$promise.then(function(res) {
        console.log(res);
        $scope.poems = res;
      }, function(res) {
        console.log(res);
      });

// functions -------------------------------------------------------------------

      $scope.timeSince = helperFactory.timeSince;

      function aContainsB (a, b) {
        if (typeof a === 'string') {
          return a.toLocaleLowerCase().indexOf(b) >= 0;
        } else if (a instanceof Array) {
          for (var i = a.length - 1; i >= 0; i--) {
            if (a[i].toLocaleLowerCase().indexOf(b) >= 0) {
              return true;
            }
          }
        }
      }

      $scope.poemSearch = function(poem) {
        if ($scope.searchByTitle === true && $scope.searchByTag === true)
        {
          return aContainsB(poem.title, $scope.query) || aContainsB(poem.tags, $scope.query);
        }
        else if ($scope.searchByTitle === true && $scope.searchByTag !== true)
        {
          return aContainsB(poem.title, $scope.query);
        }
        else if ($scope.searchByTitle !== true && $scope.searchByTag === true)
        {
          return aContainsB(poem.tags, $scope.query);
        }
        else if ($scope.searchByTitle !== true && $scope.searchByTag !== true)
        {
          if ($scope.query)
          {
            return aContainsB(poem.title, $scope.query) || aContainsB(poem.tags, $scope.query);
          }
          else
          {
            return poem;
          }
        }
        else
        {
          return poem;
        }
      };

    }
  ]);

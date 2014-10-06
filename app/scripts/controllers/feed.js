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
      $scope.totalPoems    = 0;
      $scope.poemsPerPage  = 25; // this should match however many results your API puts on one page
      $scope.searchByTitle = false;
      $scope.searchByTag   = false;
      var id               = storageFactory.getId();
      userFactory.init(id, 'Basic');
      getPoemsPage(1);

// functions -------------------------------------------------------------------

      function getPoemsPage(pageNumber) {
        var resource = poemFactory.rGetPage(pageNumber);

        resource.$promise.then(function(res) {
          console.log(res);
          $scope.poems      = res.poems;
          $scope.totalPoems = res.poemCount;
        }, function(res) {
          console.log(res);
        });
      };

      $scope.pagination = {
        current: 1
      };

      $scope.pageChangeHandler = function(newPageNumber) {
        console.log('poems page changed to ' + newPageNumber);
        getPoemsPage(newPageNumber);
      };

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

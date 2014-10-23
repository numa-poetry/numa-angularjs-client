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
    'userFactory', 'helperFactory', 'socketIO', '$rootScope', '$cookieStore',
    '$location',
    function ($scope, poemFactory, storageFactory, userFactory,
      helperFactory, socketIO, $rootScope, $cookieStore, $location) {

      $scope.poems           = [];
      $scope.totalPoems      = 0;
      $scope.poemsPerPage    = 8; // this should match however many results your API puts on one page
      $scope.searchByTitle   = false;
      $scope.searchByTag     = false;
      $scope.searchByContent = false;
      $scope.strictSearch    = false;
      $scope.currentPage     = parseInt($location.search().page);
      var id                 = storageFactory.getId();
      userFactory.init(id, 'Basic');

      getPoemsPage(1);

      socketIO.on('newComment', function(data) {
        console.log(data);
      });

      // socketIO.forward('news',$scope);
      // var unregister = $scope.$on('socket:news', function(ev, data) {
      //   console.log(data);
      //   socketIO.emit('my other event', {my: 'data'});
      // });
      // $scope.$on('$destroy', function() {
      //   unregister();
      // });

      // socketIO.on('news', function(data) {
      //   console.log(data);
      //   socketIO.emit('my other event', {my: 'data'});
      // });

// functions -------------------------------------------------------------------

      $scope.searchPoems = function() {
        getPoemsPage(1);
      };

      function getPoemsPage(page) {
        var resource = poemFactory.rGetQuery(page, $scope.query, $scope.searchByTitle,
          $scope.searchByTag, $scope.searchByContent, $scope.strictSearch);

        resource.$promise.then(function(res) {
          $location.search('page', page);
          $scope.currentPage = page;
          $scope.poems       = res.poems;
          $scope.totalPoems  = res.poemCount;
          $scope.pageCount   = res.pageCount;
        }, function(res) {
          console.log(res);
        });
      };

      $scope.nextPage = function() {
        getPoemsPage(parseInt($scope.currentPage) + 1);
      };

      $scope.previousPage = function() {
        getPoemsPage(parseInt($scope.currentPage) - 1);
      };

      $scope.pageChanged = function(newPageNumber) {
        getPoemsPage(newPageNumber);
      };

      $scope.pagination = {
        current: 1
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

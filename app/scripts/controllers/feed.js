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
    'userFactory', 'helperFactory', 'socket', '$rootScope', '$cookieStore',
    '$location', '$resource',
    function ($scope, poemFactory, storageFactory, userFactory,
      helperFactory, socket, $rootScope, $cookieStore, $location, $resource) {

      var id = storageFactory.getId();
      userFactory.init(id, 'Basic');

      $scope.poems             = [];
      $scope.totalPoems        = 0;
      $scope.poemsPerPage      = 15; // this should match however many results your API puts on one page
      $scope.searchByTitle     = false;
      $scope.searchByTag       = false;
      $scope.searchByContent   = false;
      $scope.strictSearch      = false;
      $scope.currentPage       = parseInt($location.search().page) || 1;

      $scope.queryParam = $location.search().query;
      if ($scope.queryParam) {
        $scope.query = $scope.queryParam;
      }

      $scope.searchbyParam = $location.search().searchby;
      if ($scope.searchbyParam) {
        var searchByParams = $scope.searchbyParam.split(',');
        for (var i = searchByParams.length - 1; i >= 0; --i) {
          if (searchByParams[i] === 'title') {
            $scope.searchByTitle = true;
          } else if (searchByParams[i] === 'content') {
            $scope.searchByContent = true;
          } else if (searchByParams[i] === 'tag') {
            $scope.searchByTag = true;
          }
        };
      }

      $scope.strictSearchParam = $location.search().strict;
      if ($scope.strictSearchParam) {
        $scope.strictSearch = true;
      }

      $scope.sortbyParam = $location.search().sortby;
      if ($scope.sortbyParam) {
        $scope.sortByVotes = true;
      }

      // Call this on page load
      getPoemsPage($scope.currentPage, $scope.queryParam, $scope.searchbyParam, $scope.strictSearchParam, $scope.sortbyParam);

      $scope.pagination = {
        current: 1
      };

// functions -------------------------------------------------------------------

      $scope.timeSince = helperFactory.timeSince;

      $scope.searchPoems = function() {
        if (typeof $scope.query !== 'undefined') {
          $location.search('query', $scope.query);
        } else {
          $location.search('query', null);
        }

        if ($scope.strictSearch === true) {
          $location.search('strict', 'true');
        } else {
          $location.search('strict', null);
        }

        if ($scope.sortByVotes === true) {
          $location.search('sortby', 'votes');
        } else {
          $location.search('sortby', null);
        }

        if ($scope.searchByTag === true && $scope.searchByTitle === false && $scope.searchByContent === false) {
          $location.search('searchby', 'tag').search('strict', null);
        } else if ($scope.searchByTag === false && $scope.searchByTitle === true && $scope.searchByContent === false) {
          $location.search('searchby', 'title').search('strict', null);
        } else if ($scope.searchByTag === false && $scope.searchByTitle === false && $scope.searchByContent === true) {
          $location.search('searchby', 'content').search('strict', null);
        } else if ($scope.searchByTag === true && $scope.searchByTitle === true && $scope.searchByContent === false) {
          $location.search('searchby', 'tag,title');
        } else if ($scope.searchByTag === true && $scope.searchByTitle === true && $scope.searchByContent === true) {
          $location.search('searchby', 'tag,title,content');
        } else if ($scope.searchByTag === false && $scope.searchByTitle === true && $scope.searchByContent === true) {
          $location.search('searchby', 'title,content');
        } else if ($scope.searchByTag === false && $scope.searchByTitle === false && $scope.searchByContent === false) {
          $location.search('searchby', null);
        }

        $scope.queryParam        = $location.search().query;
        $scope.searchbyParam     = $location.search().searchby;
        $scope.strictSearchParam = $location.search().strict;
        $scope.sortbyParam       = $location.search().sortby;

        getPoemsPage($scope.currentPage, $scope.queryParam, $scope.searchbyParam, $scope.strictSearchParam, $scope.sortbyParam);
      };

      function getPoemsPage(page, query, searchby, strictSearch, sortby) {
        var resource = poemFactory.rGetQuery(page, query, searchby, strictSearch, sortby);

        resource.$promise.then(function(res) {
          $scope.currentPage = page;
          $location.search('page', $scope.currentPage);
          $scope.poems       = res.poems;
          $scope.totalPoems  = res.poemCount;
          $scope.pageCount   = res.pageCount;
        }, function(res) {
          console.log(res);
        });
      };

      $scope.nextPage = function() {
        getPoemsPage(parseInt($scope.currentPage) + 1, $scope.queryParam,
          $scope.searchbyParam, $scope.strictSearchParam, $scope.sortbyParam);
      };

      $scope.previousPage = function() {
        getPoemsPage(parseInt($scope.currentPage) - 1, $scope.queryParam,
          $scope.searchbyParam, $scope.strictSearchParam, $scope.sortbyParam);
      };

      $scope.pageChanged = function(newPageNumber) {
        getPoemsPage(newPageNumber);
      };

      // function aContainsB (a, b) {
      //   if (typeof a === 'string') {
      //     return a.toLocaleLowerCase().indexOf(b) >= 0;
      //   } else if (a instanceof Array) {
      //     for (var i = a.length - 1; i >= 0; i--) {
      //       if (a[i].toLocaleLowerCase().indexOf(b) >= 0) {
      //         return true;
      //       }
      //     }
      //   }
      // }

      // $scope.poemSearch = function(poem) {
      //   if ($scope.searchByTitle === true && $scope.searchByTag === true)
      //   {
      //     return aContainsB(poem.title, $scope.query) || aContainsB(poem.tags, $scope.query);
      //   }
      //   else if ($scope.searchByTitle === true && $scope.searchByTag !== true)
      //   {
      //     return aContainsB(poem.title, $scope.query);
      //   }
      //   else if ($scope.searchByTitle !== true && $scope.searchByTag === true)
      //   {
      //     return aContainsB(poem.tags, $scope.query);
      //   }
      //   else if ($scope.searchByTitle !== true && $scope.searchByTag !== true)
      //   {
      //     if ($scope.query)
      //     {
      //       return aContainsB(poem.title, $scope.query) || aContainsB(poem.tags, $scope.query);
      //     }
      //     else
      //     {
      //       return poem;
      //     }
      //   }
      //   else
      //   {
      //     return poem;
      //   }
      // };

    }
  ]);

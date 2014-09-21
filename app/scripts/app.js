'use strict';

/**
 * @ngdoc overview
 * @name warriorPoetsApp
 * @description
 * # warriorPoetsApp
 *
 * Main module of the application.
 */
angular
  .module('warriorPoetsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMessages',
    'Satellizer',
    'mgcrea.ngStrap',
    'angularSpinner',
    // include specific directives from Angular UI (conflicts with AngularStrap)
    'ui.bootstrap.tpls',
    'ui.bootstrap.collapse',
    'ui.bootstrap.dropdown',
    'ui.bootstrap.tabs',
    'plangular',
    'contenteditable',
    'angularFileUpload',
    'wu.masonry',
    'matchmedia-ng'
  ])
  .config(['$routeProvider', '$httpProvider', '$authProvider', '$locationProvider',
    '$popoverProvider', '$tooltipProvider', '$modalProvider',
    function ($routeProvider, $httpProvider, $authProvider, $locationProvider,
      $popoverProvider, $tooltipProvider, $modalProvider) {

      /**
       * Redirect user to login if user tries to access authenticated route
       */
      var ensureAuthentication = function() {

        return {
          load: function($location, $auth, $rootScope, $alert) {
            // temp fix for working with Satellizer
            if (!$auth.isAuthenticated() && !$rootScope.isAuthenticated) {
              $alert({
                type        : 'material-err',
                dismissable : true,
                title       : 'Oops! ',
                content     : 'You must be logged in to access this resource.',
                duration    : 5
              });
              return $location.path('/login');
            }
          }
        };
      };

      $authProvider.github({
        clientId: 'a6cf7f2af1739f24601f'
      });

      $authProvider.google({
        clientId: '636774587721-nmkg52cbr188p3rpjda5l0jlndq3ngb0.apps.googleusercontent.com'
      });

      $authProvider.facebook({
        clientId: '551613144966753'
      });

      $routeProvider
        .when('/', {
          templateUrl : 'views/main.html',
          controller  : 'MainCtrl'
        })
        .when('/about', {
          templateUrl : 'views/about.html',
          controller  : 'AboutCtrl'
        })
        .when('/login', {
          templateUrl : 'views/login.html',
          controller  : 'LoginCtrl'/*,*/
          // need this for query parameters to be correctly set in the URL on
          // session expiration redirection to login page from userFactory
          // reloadOnSearch : false
        })
        .when('/logout', {
          template    : null,
          controller  : 'LogoutCtrl'
        })
        .when('/signup', {
          templateUrl : 'views/signup.html',
          controller  : 'SignupCtrl'
        })
        .when('/user/:id', {
          templateUrl : 'views/profile.html',
          controller  : 'ProfileCtrl'/*,
          resolve     : ensureAuthentication()*/
        })
        .when('/forgot', {
          templateUrl : 'views/forgot.html',
          controller  : 'ForgotCtrl'
        })
        .when('/reset', {
          templateUrl : 'views/reset.html',
          controller  : 'ResetCtrl'
        })
        .when('/poem/:id', {
          templateUrl: 'views/poem.html',
          controller: 'PoemCtrl'
        })
        .when('/poem/:id/comments', {
          templateUrl: 'views/comments.html',
          controller: 'CommentsCtrl'
        })
        .when('/feed', {
          templateUrl: 'views/feed.html',
          controller: 'FeedCtrl'
        })
        .when('/create', {
          templateUrl: 'views/create.html',
          controller: 'CreateCtrl'
        })
        // maybe change this to include userid?
        .when('/edit/:id', {
          templateUrl: 'views/edit.html',
          controller: 'EditCtrl'
        })
        .otherwise({
          redirectTo  : '/'
        });

      // Add user's session token to all intercepted $resource calls
      $httpProvider.interceptors.push('tokenInterceptorFactory');

      angular.extend($popoverProvider.defaults, {
        html: true
      });

      angular.extend($tooltipProvider.defaults, {
        html: true
      });

      angular.extend($modalProvider.defaults, {
        html: true
      });

      // https://stackoverflow.com/questions/16677528/location-switching-between-html5-and-hashbang-mode-link-rewriting

      // Disable HTML5 pushState <- screws up Facebook Oauth.
      // $locationProvider.html5Mode(false).hashPrefix('!');

      $locationProvider.hashPrefix('!');
    }
  ]);

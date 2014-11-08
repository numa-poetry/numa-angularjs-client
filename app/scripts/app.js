'use strict';

/**
 * @ngdoc overview
 * @name numaApp
 * @description
 * # numaApp
 *
 * Main module of the application.
 */
angular
  .module('numaApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMessages',
    'satellizer',
    'mgcrea.ngStrap',
    'angularSpinner',
    // include specific directives from Angular UI Bootstrap because of conflicts
    // with AngularStrap (mgcrea.ngStrap)
    'ui.bootstrap.tpls',
    'ui.bootstrap.collapse',
    'ui.bootstrap.dropdown',
    'ui.bootstrap.tabs',
    'plangular',
    'contenteditable',
    'angularFileUpload',
    'matchmedia-ng',
    'selectize',
    'angularUtils.directives.dirPagination',
    'btford.socket-io',
    'flow',
    'wu.masonry'
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
        // .when('/', {
        //   templateUrl    : 'views/feed.html',
        //   controller     : 'FeedCtrl'
        // })
        .when('/about', {
          templateUrl    : 'views/about.html',
          controller     : 'AboutCtrl'
        })
        .when('/login', {
          templateUrl    : 'views/login.html',
          controller     : 'LoginCtrl'
        })
        .when('/logout', {
          template       : null,
          controller     : 'LogoutCtrl'
        })
        .when('/signup', {
          templateUrl    : 'views/signup.html',
          controller     : 'SignupCtrl'
        })
        .when('/user/:id', {
          templateUrl    : 'views/profile.html',
          controller     : 'ProfileCtrl'/*,
          resolve        : ensureAuthentication()*/
        })
        .when('/forgot', {
          templateUrl    : 'views/forgot.html',
          controller     : 'ForgotCtrl'
        })
        .when('/reset', {
          templateUrl    : 'views/reset.html',
          controller     : 'ResetCtrl'
        })
        .when('/poem/:id', {
          templateUrl    : 'views/poem.html',
          controller     : 'PoemCtrl'
        })
        .when('/feed/', {
          templateUrl    : 'views/feed.html',
          controller     : 'FeedCtrl',
          reloadOnSearch : false
        })
        .when('/create', {
          templateUrl    : 'views/create.html',
          controller     : 'CreateCtrl'
        })
        .when('/edit/:id', {
          templateUrl    : 'views/edit.html',
          controller     : 'EditCtrl'
        })
        .when('/privacy', {
          templateUrl    : 'views/privacy.html',
          controller     : 'PrivacyCtrl'
        })
        .when('/terms', {
          templateUrl    : 'views/terms.html',
          controller     : 'TermsCtrl'
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

      $locationProvider.hashPrefix('!');
    }
  ]).
  factory('socket', function(socketFactory, storageFactory, $rootScope) {
    var socket = io.connect('http://localhost:3000');

    // Store client's socket id as browser cookie even though this is already happening.
    // Bug because I can't access the cookie socket.io already sets. So I set it myself
    // and then can access it later on.
    socket.on('newSocketId', function(data) {
      storageFactory.setSocketId(data.id);
    });

    return socketFactory({ ioSocket: socket });
  });

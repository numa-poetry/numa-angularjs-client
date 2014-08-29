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
    // include specific directive (possible conflict with AngularStrap)
    'ui.bootstrap.collapse'
    // xeditable
    // angularSpinner
    // angularModalService
    // ui.bootstrap

  ])
  .config(['$routeProvider', '$httpProvider', '$authProvider', '$locationProvider',
    function ($routeProvider, $httpProvider, $authProvider, $locationProvider) {

      /**
       * Redirect user to login if user tries to access authenticated route
       */
      var ensureAuthentication = function() {

        return {
          load : function($q, $location, storageFactory) {
            var deferred = $q.defer();
            deferred.resolve();

            var userToken = storageFactory.getUserToken();

            if (userToken) {
              return deferred.promise;
            }

            $location.path('/login');
          }
        };
      };

      $authProvider.github({
        clientId: 'a6cf7f2af1739f24601f'
      });

      $authProvider.google({
        clientId: '636774587721-nmkg52cbr188p3rpjda5l0jlndq3ngb0.apps.googleusercontent.com'
      });

      $routeProvider
        .when('/', {
          templateUrl    : 'views/main.html',
          controller     : 'MainCtrl'
        })
        .when('/about', {
          templateUrl    : 'views/about.html',
          controller     : 'AboutCtrl'
        })
        .when('/login', {
          templateUrl    : 'views/login.html',
          controller     : 'LoginCtrl'/*,*/
          // need this for query parameters to be correctly set in the URL on
          // session expiration redirection to login page from userFactory
          // reloadOnSearch : false
        })
        .when('/logout', {
          template       : null,
          controller     : 'LogoutCtrl'
        })
        .when('/signup', {
          templateUrl    : 'views/signup.html',
          controller     : 'SignupCtrl'
        })
        .when('/profile', {
          templateUrl    : 'views/profile.html',
          controller     : 'ProfileCtrl',
          resolve        : ensureAuthentication()
        })
        .otherwise({
          redirectTo     : '/'
        });

      // Add user's session token to all intercepted $resource calls
      $httpProvider.interceptors.push('tokenInterceptorFactory');

      // Enable HTML5 pushState
      $locationProvider.html5Mode(true);
    }
  ]);

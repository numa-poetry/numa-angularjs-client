'use strict';

/**
 * @ngdoc service
 * @name warriorPoetsApp.userFactory
 * @description
 * # userFactory
 * Factory in the warriorPoetsApp.
 */
angular.module('warriorPoetsApp')
  .factory('userFactory', ['endpointConstants', '$resource', 'storageFactory',
    '$rootScope', '$location', /*'helperFactory',*/ '$auth', '$alert',
    function(endpointConstants, $resource, storageFactory, $rootScope,
      $location, $auth, $alert /*, helperFactory*/) {

      var _id;
      var _displayName;
      var _sId        = storageFactory.getId();
      var _sToken     = storageFactory.getToken();
      var _isLoggedIn = false;
      var userFactory = {};

// helper functions ------------------------------------------------------------

      userFactory.init = function() {
        console.log('fetching and initializing user data');

        if (_sToken && _sId) {
          var resource = $resource(endpointConstants.user, {
            id : _sId
          }).get();

          resource.$promise.then(function(res) {
            userFactory.setInfo(res.id, res.displayName);
            $rootScope.displayName     = res.displayName;
            $rootScope.isAuthenticated = true; // temp fix to work with satellizer
            $rootScope.$broadcast('finishedSettingUserDataOnPageRefresh');
          }, function(res) {
            // if backend is down
            if (res.status === 0) {
              $auth.logout()
                .then(function() {
                  $alert({
                    type        : 'material-err',
                    title       : 'We\'ve lost connection to our backend.',
                    content     : 'Please try logging back in',
                    duration    : 4,
                    dismissable : true
                  });
                  storageFactory.deleteId();
                  storageFactory.deleteToken();
                  userFactory.deleteInfo();
                });
              $location.path('/login');
            }
            if (res.data.type === 'token_expired') {
              $auth.logout()
                .then(function() {
                  $alert({
                    type        : 'material-err',
                    title       : 'Your session has expired!',
                    content     : 'Please log back in to continue',
                    duration    : 4,
                    dismissable : true
                  });
                  storageFactory.deleteId();
                  storageFactory.deleteToken();
                  userFactory.deleteInfo();
                });
              $location.path('/login');
            }
            // On refresh if session expired return user to login and upon
            // successful login, redirect to previous view
            // var previousView = $location.url();
            // $location.path('/login').search('session', 'expired').search('previousView', previousView);
            // helperFactory.deleteDataAndRedirectToLogin($location.url());
          });
        }
      };

// setters ---------------------------------------------------------------------

      userFactory.setInfo = function(id, displayName) {
        _id          = id;
        _displayName = displayName;
        _isLoggedIn  = true;
      };

      userFactory.setIsLoggedIn = function(isLoggedIn) {
        _isLoggedIn = isLoggedIn;
      };

      userFactory.setId = function(id) {
        _id = id;
      };

      userFactory.setDisplayName = function(displayName) {
        _displayName = displayName;
      };

// getters ---------------------------------------------------------------------

      userFactory.getIsLoggedIn = function() {
        return _isLoggedIn;
      };

      userFactory.getId = function() {
        return _id;
      };

      userFactory.getDisplayName = function() {
        return _displayName;
      };

// deletes ---------------------------------------------------------------------

      userFactory.deleteInfo = function() {
        _id          = undefined;
        _displayName = undefined;
        _isLoggedIn  = false;
      };

// $resource calls -------------------------------------------------------------

      userFactory.rSignUp = function(info) {
        return $resource(endpointConstants.userSignup).save([], info);
      };

      userFactory.rLogin = function(info) {
        return $resource(endpointConstants.userLogin).save([], info);
      };

      userFactory.rLogout = function() {
        return $resource(endpointConstants.userLogout).get([]);
      };

      userFactory.rDeleteAccount = function() {
        console.log('_id:', _id);
        return $resource(endpointConstants.user, {
          id : _id
        }).delete();
      };

      return userFactory;

    }
  ]);
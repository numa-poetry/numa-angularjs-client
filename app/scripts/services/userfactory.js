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
    '$rootScope', '$location', 'helperFactory',
    function(endpointConstants, $resource, storageFactory, $rootScope,
      $location, helperFactory) {

      var _userId;
      var _userEmail;
      var _username;
      var _sUserId    = storageFactory.getUserId();
      var _sUserToken = storageFactory.getUserToken();
      var _isLoggedIn = false;
      var userFactory = {};

// helper functions ------------------------------------------------------------

      userFactory.init = function() {
        console.log('fetching and initializing user data');

        if (_sUserToken && _sUserId) {
          var resource = $resource(endpointConstants.user, {
            id : _sUserId
          }).get([]);

          resource.$promise.then(function(res) {
            userFactory.setUserInfo(res.id, res.username, res.email);

            $rootScope.$broadcast('finishedSettingUserDataOnPageRefresh');
          }, function(err) {
            if (/* session expired */) {
              // storageFactory.deleteUserId();
              // storageFactory.deleteUserToken();
              // userFactory.deleteUserInfo();

              // On refresh if session expired return user to login and upon
              // successful login, redirect to previous view
              // var previousView = $location.url();
              // $location.path('/login').search('session', 'expired').search('previousView', previousView);
              helperFactory.deleteDataAndRedirectToLogin($location.url());
            }
          });
        }
      };

// setters ---------------------------------------------------------------------
      
      userFactory.setUserInfo = function(id, username, email) {
        _userId     = id;
        _username   = username;
        _userEmail  = email;
        _isLoggedIn = true;
      };

      userFactory.setIsLoggedIn = function(isLoggedIn) {
        _isLoggedIn = isLoggedIn;
      };

      userFactory.setUserId = function(id) {
        _userId = id;
      };

      userFactory.setusername = function(username) {
        _username = username;
      };

      userFactory.setUserEmail = function(email) {
        _userEmail = email;
      };

// getters ---------------------------------------------------------------------

      userFactory.getIsLoggedIn = function() {
        return _isLoggedIn;
      };

      userFactory.getUserId = function() {
        return _userId;
      };

      userFactory.getusername = function() {
        return _username;
      };

      userFactory.getUserEmail = function() {
        return _userEmail;
      };

// deletes ---------------------------------------------------------------------

      userFactory.deleteUserInfo = function() {
        _userId     = undefined;
        _username   = undefined;
        _userEmail  = undefined;
        _isLoggedIn = false;
      };

// $resource calls -------------------------------------------------------------

      userFactory.rSignUp = function(userInfo) {
        return $resource(endpointConstants.userSignup).save([], userInfo);
      };

      userFactory.rLogin = function(userInfo) {
        return $resource(endpointConstants.userLogin).save([], userInfo);
      };

      userFactory.rLogoutUser = function() {
        return $resource(endpointConstants.userLogout).get([]);
      };

      userFactory.rDeleteUser = function(userId) {
        return $resource(endpointConstants.user, {
          id : userId
        }).get([]);
      };

      return userFactory;

    }
  ]);
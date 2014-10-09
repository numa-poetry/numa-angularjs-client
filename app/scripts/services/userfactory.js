'use strict';

/**
 * @ngdoc service
 * @name numaApp.userFactory
 * @description
 * # userFactory
 * Factory in the numaApp.
 */
angular.module('numaApp')
  .factory('userFactory', ['endpointConstants', '$resource', 'storageFactory',
    '$rootScope', '$location', '$auth', '$alert', '$http',
    function(endpointConstants, $resource, storageFactory, $rootScope,
      $location, $auth, $alert, $http) {

      var _id;
      var _displayName;
      var _joinedDate;
      var _email;
      var _avatarUrl;
      var _poems       = [];
      var _comments    = [];
      var _sId         = storageFactory.getId();
      var _sToken      = storageFactory.getToken();
      var _isLoggedIn  = false;
      var userFactory  = {};
      var serverDomain = 'http://localhost:3000';
      var apiVersion   = '/api/v1';

// helper functions ------------------------------------------------------------

      userFactory.init = function(paramsId, profile) {
        var _sId = storageFactory.getId();
        // console.log('fetching and initializing user data');

        // If no cookie found, logout
        // console.log(_sId);

        if (paramsId) {

          profile === 'full' ? profile = ('profile=full') : profile = '';

          var resource = $resource(endpointConstants.user + '/?' + profile, {
            id : paramsId
          }).get();

          resource.$promise.then(function(res) {
            console.log(res);

            // Store basic user info
            userFactory.setInfo(res.id, res.displayName, res.createdAt.split('T')[0],
              res.email, res.avatarUrl);

            if (_sId === paramsId) {
              // console.log('Viewing own profile');
              $rootScope.displayName     = res.displayName;
              $rootScope.isAuthenticated = true; // temp fix to work with satellizer
            } else {
              // console.log('Viewing other user profile');
            }

            // If 'full' profile was requested, store poem titles and comments
            if (profile === 'profile=full') {
              userFactory.setPoems(res.poems);
              userFactory.setComments(res.comments);
            }

            $rootScope.$emit('finishedSettingUserDataOnPageRefresh');
          }, function(res) {

            console.log('err:', res);

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
        } else {
          // if (!paramsId) { console.log('no params specified'); }
        }
      };

// setters ---------------------------------------------------------------------

      userFactory.setInfo = function(id, displayName, joinedDate, email, avatarUrl) {
        _id          = id;
        _displayName = displayName;
        _joinedDate  = joinedDate;
        _email       = email;
        _avatarUrl   = avatarUrl;
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

      userFactory.setJoinedDate = function(joinedDate) {
        _joinedDate = joinedDate;
      };

      userFactory.setEmail = function(email) {
        _email = email;
      };

      userFactory.setAvatarUrl = function(avatarUrl) {
        _avatarUrl = avatarUrl;
      };

      userFactory.setPoems = function(poems) {
        _poems = poems;
      };

      userFactory.setComments = function(comments) {
        _comments = comments;
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

      userFactory.getJoinedDate = function() {
        return _joinedDate;
      };

      userFactory.getEmail = function() {
        return _email;
      };

      userFactory.getAvatarUrl = function() {
        return _avatarUrl;
      };

      userFactory.getPoems = function() {
        return _poems;
      };

      userFactory.getComments = function() {
        return _comments;
      };

// deletes ---------------------------------------------------------------------

      userFactory.deleteInfo = function() {
        _sId         = undefined;
        _sToken      = undefined;
        _id          = undefined;
        _displayName = undefined;
        _joinedDate  = undefined;
        _email       = undefined;
        _avatarUrl   = undefined;
        _poems       = undefined;
        _comments    = undefined;
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
        return $resource(endpointConstants.userLogout).get();
      };

      userFactory.rDeleteAccount = function() {
        return $resource(endpointConstants.user, {
          id : _sId
        }).delete();
      };

      userFactory.rGetUser = function() {
        return $resource(endpointConstants.user, {
          id : _sId
        }).get();
      };

      userFactory.rSaveAvatarUrl = function(info) {
        _sId = storageFactory.getId();
        return $resource(endpointConstants.userAvatar, {
          id : _sId
        }).save([], info);
      };

      userFactory.rSavePoem = function(info) {
        _sId = storageFactory.getId();
        return $resource(endpointConstants.userPoemSave, {
          id : _sId
        }).save([], info);
      };

      userFactory.rDeletePoem = function(poemId) {
        _sId = storageFactory.getId();
        return $resource(endpointConstants.userPoem, {
          userId : _sId,
          poemId : poemId
        }).delete();
      };

      userFactory.rSaveComment = function(info, poemId) {
        _sId = storageFactory.getId();
        return $resource(endpointConstants.userPoemCommentSave, {
          userId : _sId,
          poemId : poemId
        }).save([], info);
      };

      userFactory.rDeleteCommentAsCreator = function(poemId, commentId) {
        _sId = storageFactory.getId();
        return $resource(endpointConstants.userPoemComment, {
          userId    : _sId,
          poemId    : poemId,
          commentId : commentId
        }).delete();
      };

      userFactory.rSaveVote = function(info, poemId) {
        _sId = storageFactory.getId();
        return $resource(endpointConstants.userPoemVote, {
          userId : _sId,
          poemId : poemId
        }).save([], info);
      };

      userFactory.rGetVote = function(poemId) {
        _sId = storageFactory.getId();
        return $resource(endpointConstants.userPoemVote, {
          userId : _sId,
          poemId : poemId
        }).get();
      };

// $http calls -----------------------------------------------------------------

      userFactory.hUpdateUser = function(info) {
        _sId = storageFactory.getId();
        console.log(_sId);
        return $http({
          method : 'PUT',
          url    : serverDomain + apiVersion + '/user/' + _sId,
          data   : {
            email: info.email
          }
        });
      };

      userFactory.hUpdatePoem = function(info) {
        _sId = storageFactory.getId();
        return $http({
          method : 'PUT',
          url    : serverDomain + apiVersion + '/user/' + _sId + '/poem/' + info.id,
          data   : info
        });
      };

      return userFactory;

    }
  ]);
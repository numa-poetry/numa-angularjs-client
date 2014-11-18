'use strict';

var serverDomain = 'http://localhost:3000';
// var serverDomain = 'https://numabackend-40189.onmodulus.net';

var apiVersion   = '/api/v1';

/**
 * @ngdoc service
 * @name numaApp.endpointConstants
 * @description
 * # endpointConstants
 * Constant in the numaApp.
 */
angular.module('numaApp')
  .constant('endpointConstants', {

    serverDomain        : 'http://localhost:3000',
    // serverDomain        : 'https://numabackend-40189.onmodulus.net',

    apiVersion          : '/api/v1',

    // GET
    allUsers            : serverDomain + apiVersion + '/user',

    // GET, DELETE, PUT
    user                : serverDomain + apiVersion + '/user/:id',

    // POST
    userAvatar          : serverDomain + apiVersion + '/user/:id/avatar',

    // POST
    userPoemSave        : serverDomain + apiVersion + '/user/:id/poem',

    // GET
    userLogout          : serverDomain + apiVersion + '/user/:id/logout',

    // POST
    userPoemImage       : serverDomain + apiVersion + '/user/:id/poem/image',

    // POST, GET
    userFollowUser      : serverDomain + apiVersion + '/user/:id/follow/user/:followingId',

    // POST
    userUnfollowUser    : serverDomain + apiVersion + '/user/:id/unfollow/user/:followingId',

    // GET
    allUserFollowers    : serverDomain + apiVersion + '/user/:id/follower',

    // GET
    allUserFollowing    : serverDomain + apiVersion + '/user/:id/following',

    // DELETE
    userPoemImageDelete : serverDomain + apiVersion + '/user/:userId/poem/:poemId/image',

    // DELETE
    userPoem            : serverDomain + apiVersion + '/user/:userId/poem/:poemId',

    // POST, GET
    userPoemFavorite    : serverDomain + apiVersion + '/user/:userId/poem/:poemId/favorite',

    // POST
    userPoemCommentSave : serverDomain + apiVersion + '/user/:userId/poem/:poemId/comment',

    // DELETE
    userPoemComment     : serverDomain + apiVersion + '/user/:userId/poem/:poemId/comment/:commentId',

    // DELETE
    userPoemRead        : serverDomain + apiVersion + '/user/:userId/read/poem/:poemId',

    // DELETE
    userCommentRead     : serverDomain + apiVersion + '/user/:userId/read/comment/:commentId/',

    // GET, POST
    userPoemVote        : serverDomain + apiVersion + '/user/:userId/poem/:poemId/vote',

    // POST
    userSignup          : serverDomain + apiVersion + '/signup',

    // POST
    userLogin           : serverDomain + apiVersion + '/login',

    // POST
    forgotPassword      : serverDomain + apiVersion + '/forgot',

    // GET, POST
    resetPassword       : serverDomain + apiVersion + '/reset/:token',

    // GET
    allPoems            : serverDomain + apiVersion + '/poem',

    // GET, PUT
    poem                : serverDomain + apiVersion + '/poem/:id',

    // GET
    poemCount           : serverDomain + apiVersion + '/poem/count'

  });

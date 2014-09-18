'use strict';

var serverDomain = 'http://localhost:3000';
var apiVersion   = '/api/v1';

/**
 * @ngdoc service
 * @name warriorPoetsApp.endpointConstants
 * @description
 * # endpointConstants
 * Constant in the warriorPoetsApp.
 */
angular.module('warriorPoetsApp')
  .constant('endpointConstants', {

    // GET
    allUsers         : serverDomain + apiVersion + '/user',

    // POST
    userSignup       : serverDomain + apiVersion + '/signup',

    // POST
    userLogin        : serverDomain + apiVersion + '/login',

    // GET, DELETE, PUT
    user             : serverDomain + apiVersion + '/user/:id',

    // POST
    forgotPassword   : serverDomain + apiVersion + '/forgot',

    // GET, POST
    resetPassword    : serverDomain + apiVersion + '/reset/:token',

    // POST
    userProfileImage : serverDomain + apiVersion + '/user/:id/profile/image',

    // POST
    userPoem         : serverDomain + apiVersion + '/user/:id/poem'

  });

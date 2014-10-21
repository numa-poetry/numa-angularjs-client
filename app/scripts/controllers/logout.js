'use strict';

/**
 * @ngdoc function
 * @name numaApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the numaApp
 */
angular.module('numaApp')
  .controller('LogoutCtrl', ['$auth', '$alert', 'storageFactory', 'userFactory',
    '$rootScope',
    function ($auth, $alert, storageFactory, userFactory, $rootScope) {

      var resource = userFactory.rLogout();

      resource.$promise.then(function(res) {
        console.log(res);
        $auth.logout()
          .then(function() {
            $alert({
              type        : 'material',
              // title       : 'You have been logged out!',
              content     : 'You\'ve been logged out.',
              duration    : 4,
              dismissable : false,
              animation   : 'fadeZoomFadeDown'
            });
            storageFactory.deleteId();
            storageFactory.deleteToken();
            userFactory.deleteInfo();
            $rootScope.$emit('logout');
          });
      }, function(res) {
        console.log(res);
      });

    }
  ]);
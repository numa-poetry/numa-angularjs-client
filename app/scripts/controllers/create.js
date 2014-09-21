'use strict';

/**
 * @ngdoc function
 * @name warriorPoetsApp.controller:CreateCtrl
 * @description
 * # CreateCtrl
 * Controller of the warriorPoetsApp
 */
angular.module('warriorPoetsApp')
  .controller('CreateCtrl', ['$scope', '$resource', '$alert', 'userFactory',
    '$location', 'storageFactory',
    function ($scope, $resource, $alert, userFactory, $location, storageFactory) {

      var id = storageFactory.getId();
      userFactory.init(id, 'Basic');

      $scope.title = 'Untitled';

// functions -------------------------------------------------------------------

      $scope.savePoem = function() {
        var req   = {};
        req.poem  = $scope.poem;
        req.title = $scope.title;
        console.log('req:', req);

        var resource = userFactory.rSavePoem(req);

        resource.$promise.then(function(res) {
          console.log('good res:', res);
          $alert({
            type        : 'material',
            dismissable : false,
            duration    : 5,
            title       : 'Poem saved.'
          });

          var _sId = storageFactory.getId();
          $location.path('/user/' + _sId);
        }, function(res) {
          $alert({
            type        : 'material-err',
            dismissable : true,
            title       : 'Oops! ',
            content     : res.data.message,
            duration    : 5
          });
        });
      };

    }
  ]);
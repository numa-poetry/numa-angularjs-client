'use strict';

describe('Controller: PoemsCtrl', function () {

  // load the controller's module
  beforeEach(module('numaApp'));

  var PoemsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PoemsCtrl = $controller('PoemsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});

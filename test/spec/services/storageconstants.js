'use strict';

describe('Service: storageConstants', function () {

  // load the service's module
  beforeEach(module('warriorPoetsApp'));

  // instantiate service
  var storageConstants;
  beforeEach(inject(function (_storageConstants_) {
    storageConstants = _storageConstants_;
  }));

  it('should do something', function () {
    expect(!!storageConstants).toBe(true);
  });

});

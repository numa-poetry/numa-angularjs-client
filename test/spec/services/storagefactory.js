'use strict';

describe('Service: storageFactory', function () {

  // load the service's module
  beforeEach(module('numaApp'));

  // instantiate service
  var storageFactory;
  beforeEach(inject(function (_storageFactory_) {
    storageFactory = _storageFactory_;
  }));

  it('should do something', function () {
    expect(!!storageFactory).toBe(true);
  });

});

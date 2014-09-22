'use strict';

describe('Service: helperFactory', function () {

  // load the service's module
  beforeEach(module('numaApp'));

  // instantiate service
  var helperFactory;
  beforeEach(inject(function (_helperFactory_) {
    helperFactory = _helperFactory_;
  }));

  it('should do something', function () {
    expect(!!helperFactory).toBe(true);
  });

});

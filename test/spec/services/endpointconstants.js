'use strict';

describe('Service: endpointConstants', function () {

  // load the service's module
  beforeEach(module('warriorPoetsApp'));

  // instantiate service
  var endpointConstants;
  beforeEach(inject(function (_endpointConstants_) {
    endpointConstants = _endpointConstants_;
  }));

  it('should do something', function () {
    expect(!!endpointConstants).toBe(true);
  });

});

'use strict';

describe('Service: tokenInterceptorFactory', function () {

  // load the service's module
  beforeEach(module('numaApp'));

  // instantiate service
  var tokenInterceptorFactory;
  beforeEach(inject(function (_tokenInterceptorFactory_) {
    tokenInterceptorFactory = _tokenInterceptorFactory_;
  }));

  it('should do something', function () {
    expect(!!tokenInterceptorFactory).toBe(true);
  });

});

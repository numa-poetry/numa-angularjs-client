'use strict';

describe('Service: poemFactory', function () {

  // load the service's module
  beforeEach(module('numaApp'));

  // instantiate service
  var poemFactory;
  beforeEach(inject(function (_poemFactory_) {
    poemFactory = _poemFactory_;
  }));

  it('should do something', function () {
    expect(!!poemFactory).toBe(true);
  });

});

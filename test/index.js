// Configure karma-fixture to point to the right base path
fixture.base = 'test/' + fixture.base;

// Pick files that end with Spec and tun them as tests
var testsContext = require.context('./spec', true, /Spec$/);
testsContext.keys().forEach(testsContext);

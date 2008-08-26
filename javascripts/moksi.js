var Moksi = {
  stubbed: [],
  called: {},
  expected: {},
  
  beforeStubPrefix: "__before_stub_",
  beforeStubRegexp: /^__before_stub_(.*)$/,
  
  stubbedFunctionName: function(functionName) {
    return this.beforeStubPrefix + functionName;
  },
  
  stub: function(object, functionName, definition) {
    var temporaryName = this.stubbedFunctionName(functionName);
    
    object[temporaryName] = object[functionName];
    object[functionName] = definition;
    
    if (this.stubbed.indexOf(object) == -1) {
      this.stubbed.push(object);
    }
  },
  
  unstub: function(object, functionName) {
    var temporaryName = this.stubbedFunctionName(functionName);
    this.revertMethod(object, functionName, temporaryName);
  },
  
  expects: function(object, functionName) {
    this.expected[object] = this.expected[object] || {}
    this.expected[object][functionName] = 1;
    
    this.stub(object, functionName, function() {
      Moksi.called[object] = Moksi.called[object] || {};
      Moksi.called[object][functionName] = Moksi.called[object][functionName] || 0;
      Moksi.called[object][functionName] += 1;
    });
  },
  
  revert: function() {
    var object;
    while(object = this.stubbed.pop()) {
      for (var property in object) {
        var match;
        if (match = property.match(this.beforeStubRegexp)) {
          this.revertMethod(object, match[1], property);
        }
      }
    }
    this.expected = {};
    this.called = {};
  },
  
  revertMethod: function(object, originalName, temporaryName) {
    object[originalName] = object[temporaryName];
    delete object[temporaryName];
  },
  
  assertExpectations: function(testCase) {
    for (object in this.expected) {
      for (property in this.expected[object]) {
        var called;
        if ((this.called[object]) && (this.called[object][property])) {
          called = this.called[object][property];
        } else {
          called = 0;
        }
        
        var message = testCase.buildMessage('expectation',
          'expected ?.? to be called ? times, but was called ? times',
          object.name||'Object',
          property,
          this.expected[object][property], called);
        testCase.assertEqual(this.expected[object][property], called, message);
      }
    }
  }
};
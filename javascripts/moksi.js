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
  
  expects: function(object, functionName, options) {
    options = options || {};
    if (options.times == undefined) options.times = 1;
    
    this.expected[object] = this.expected[object] || {}
    this.expected[object][functionName] = [];
    this.expected[object][functionName].push(options);
    
    this.stub(object, functionName, function() {
      Moksi.called[object] = Moksi.called[object] || {};
      Moksi.called[object][functionName] = Moksi.called[object][functionName] || [];
      Moksi.called[object][functionName].push(this[functionName].arguments);
    });
  },
  
  rejects: function(object, functionName) {
    this.expects(object, functionName, {times: 0});
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
  
  sameObject: function(left, right) {
    if (typeof left == 'object') {
      for (var key in left) {
        if (!this.sameObject(left[key], right[key])) return false;
      }
      for (var key in right) {
        if (!this.sameObject(left[key], right[key])) return false;
      }
      return true;
    } else {
      return left == right;
    }
  },
  
  sameArguments: function(left, right) {
    left = $A(left);
    right = $A(right);
    if (left.length != right.length) return false;
    
    for(i=0; i < left.length; i++) {
      if (!this.sameObject(left[i], right[i])) return false;
    }
    return true;
  },
  
  assertExpectation: function(testCase, object, functionName, expected) {
    var callsToFunction = [];
    if (this.called[object] && this.called[object][property]) {
      callsToFunction = this.called[object][property];
    }
    
    var timesCalled = callsToFunction.inject(0, function(timesCalled, call) {
      if (typeof expected['with'] == 'undefined' || this.sameArguments(call, expected['with'])) {
        return timesCalled + 1;
      } else {
        return timesCalled;
      }
    }, this);
    
    var message = testCase.buildMessage('expectation',
      'expected ?.? to be called ? times, but was called ? times',
      object.name||'Object', property, expected.times, timesCalled);
    testCase.assertEqual(expected.times, timesCalled, message);
  },
  
  assertExpectations: function(testCase) {
    for (object in this.expected) {
      for (property in this.expected[object]) {
        $A(this.expected[object][property]).each(function(expected) {
          this.assertExpectation(testCase, object, property, expected);
        }, this);
      }
    }
  }
};
Moksi.Expectations = {};

Moksi.Expectations.Expectation = Class.create({
  initialize: function(subject, expectedResult, resolver) {
    this.subject        = subject;
    this.expectedResult = expectedResult;
    this.resolver       = resolver;
  },
  
  _assert: function(assertion, messages) {
    this.resolver.assert(assertion.curry(this.subject, this.expectedResult));
  },
  
  _assertDelayed: function(assertion, messages) {
    this.resolver.assertDelayed(assertion.curry(this.subject, this.expectedResult));
  },
  
  equals: function(expected) {
    this._assert(function(subject, expectedResult) {
      var message, result = Moksi.Object.isEqual(subject, expected);
      
      if (result != expectedResult) {
        if (expectedResult) {
          message = 'expected ‘'+subject+'’ to be equal to ‘'+expected+'’';
        } else {
          message = 'expected ‘'+subject+'’ to not be equal to ‘'+expected+'’';
        }
      }
      
      return { result: result, message: message, expectedResult: expectedResult };
    });
  },
  
  equalsArray: function(expected) {
    this._assert(function(subject, expectedResult) {
      var message, result = Moksi.Object.isEqualEnumerable(subject, expected);
      
      if (result != expectedResult) {
        if (expectedResult) {
          message = 'expected ['+subject.join(', ')+'] to be equal to ['+expected.join(', ')+']';
        } else {
          message = 'expected ['+subject.join(', ')+'] to not be equal to ['+expected.join(', ')+']';
        }
      }
      
      return { result: result, message: message, expectedResult: expectedResult };
    });
  },
  
  truthy: function() {
    this._assert(function(subject, expectedResult) {
      var message, result = subject;
      
      if (result != expectedResult) {
        if (expectedResult) {
          message = 'expected ‘'+subject+'’ to be truthy';
        } else {
          message = 'expected ‘'+subject+'’ to not be truthy';
        }
      }
      
      return { result: result, message: message, expectedResult: expectedResult };
    });
  },
  
  // TODO: Find a way to show nicer output for expected values.
  empty: function() {
    this._assert(function(subject, expectedResult) {
      var message, result = Moksi.Object.isEmpty(subject);
      
      if (result != expectedResult) {
        if (expectedResult) {
          message = 'expected ‘'+subject+'’ to be empty';
        } else {
          message = 'expected ‘'+subject+'’ to not be empty';
        }
      }
      
      return { result: result, message: message, expectedResult: expectedResult };
    });
  },
  
  receives: function(method, options) {
    options = options || {}
    
    Moksi.stubs(this.subject, method, function(subject) {
      Moksi.Invocations.register(subject, method, subject[method].arguments);
    }.curry(this.subject));
    
    this._assertDelayed(function(subject, expectedResult) {
      var _times = function(count) {
        return '' + count + (count == 1 ? ' time' : ' times');
      };
      
      var result, invocationCount, messageParts = [];
      
      invocationCount = Moksi.Invocations.invocationCount(subject, method, options.withArguments)
      
      if (options.times) {
        result = invocationCount == options.times;
      } else {
        result = invocationCount > 0;
      }
      
      if (result != expectedResult) {
        messageParts.push('expected ‘'+subject+'’');
        
        if (expectedResult) {
          messageParts.push('to receive');
        } else {
          messageParts.push('to not receive');
        }
        
        if (options.withArguments) {
          messageParts.push('‘'+method+'('+options.withArguments+')’');
        } else {
          messageParts.push('‘'+method+'’');
        }
        
        if (options.times) {
          messageParts.push(_times(options.times)+', but was '+_times(invocationCount));
        }
      }
      
      return { result: result, message: messageParts.join(' '), expectedResult: expectedResult };
    });
  }
});

Moksi.Expectations.Resolver = Class.create({
  initialize: function() {
    this.results = [];
    this.delayed = [];
  },
  
  flush: function() {
    var results = this.results;
    this.results = [];
    return results;
  },
  
  assert: function(assertion) {
    var assertion = assertion();
    if (assertion.result == assertion.expectedResult) {
      this.capture('ok');
    } else {
      this.capture('not ok', assertion.message);
    }
  },
  
  assertDelayed: function(assertion) {
    this.delayed.push(assertion);
  },
  
  runDelayedAssertions: function() {
    this.delayed.each(this.assert, this);
    this.delayed = [];
  },
  
  capture: function(result, message) {
    this.results.push({result: result, message: message});
  },
  
  report: function() {
    var expectations = this.flush();
    var report = {result: 'ok', messages: [], expectationCount: 0};
    
    expectations.each(function(expectation) {
      report.expectationCount += 1;
      if (expectation.result == 'not ok') {
        report.result = 'not ok';
        report.messages.push(expectation.message);
      }
    });
    
    return report;
  }
});


Moksi.Expectations.Methods = function() {
  var _resolver = new Moksi.Expectations.Resolver();
  
  function expects(subject) {
    return new Moksi.Expectations.Expectation(subject, true, _resolver);
  }
  
  function rejects(subject) {
    return new Moksi.Expectations.Expectation(subject, false, _resolver);
  }
  
  return {_resolver: _resolver, expects: expects, rejects: rejects};
}();
Moksi.Expectations = {};

Moksi.Expectations.Expectation = Class.create({
  initialize: function(subject, assertionResult, resolver) {
    this.subject         = subject;
    this.assertionResult = assertionResult;
    this.resolver        = resolver;
  },
  
  _assert: function(assertion, messages) {
    this.resolver.assert({
      run: assertion.curry(this.subject),
      assertionResult: this.assertionResult,
      messages: messages
    });
  },
  
  _assertDelayed: function(assertion, messages) {
    this.resolver.assertDelayed({
      run: assertion.curry(this.subject),
      assertionResult: this.assertionResult,
      messages: messages
    });
  },
  
  equals: function(expected) {
    this._assert(function(subject) {
      return Moksi.Object.isEqual(subject, expected);
    }, {
      expects: 'expected ‘'+this.subject+'’ to be equal to ‘'+expected+'’',
      rejects: 'expected ‘'+this.subject+'’ to not be equal to ‘'+expected+'’'
    });
  },
  
  equalsArray: function(expected) {
    this._assert(function(subject) {
      return Moksi.Object.isEqualEnumerable(subject, expected);
    }, {
      expects: 'expected ['+this.subject.join(', ')+'] to be equal to ['+expected.join(', ')+']',
      rejects: 'expected ['+this.subject.join(', ')+'] to not be equal to ['+expected.join(', ')+']'
    });
  },
  
  truthy: function() {
    this._assert(function(subject) {
      return subject;
    }, {
      expects: 'expected ‘'+this.subject+'’ to be truthy',
      rejects: 'expected ‘'+this.subject+'’ to not be truthy'
    });
  },
  
  // TODO: Find a way to show nicer output for expected values.
  empty: function() {
    this._assert(function(subject) {
      return Moksi.Object.isEmpty(subject);
    }, {
      expects: 'expected ‘'+this.subject+'’ to be empty',
      rejects: 'expected ‘'+this.subject+'’ to not be empty',
    });
  },
  
  receives: function(method) {
    Moksi.stubs(this.subject, method, function(subject) {
      Moksi.Invocations.register(subject, method, subject[Moksi.Stubber.stubbedName(method)].arguments);
    }.curry(this.subject));
    
    this._assertDelayed(function(subject) {
      return Moksi.Invocations.isCalled(subject, method);
    }, {
      expects: 'expected ‘'+this.subject+'’ to receive ‘'+method+'’',
      rejects: 'expected ‘'+this.subject+'’ to not receive ‘'+method+'’'
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
    if (assertion.run() == assertion.assertionResult)
    {
      this.capture('ok');
    } else {
      var message = assertion.assertionResult ? assertion.messages.expects : assertion.messages.rejects;
      this.capture('not ok', message);
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
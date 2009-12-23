Moksi.Expectations = {};

Moksi.Expectations.Expectation = Class.create({
  initialize: function(subject, assertionResult, resolver) {
    this.subject         = subject;
    this.assertionResult = assertionResult;
    this.resolver        = resolver;
  },
  
  equals: function(expected) {
    var subject = this.subject;
    this.resolver.assert({
      run: function() {
        return Moksi.Object.isEqual(subject, expected);
      },
      assertionResult: this.assertionResult,
      messages: {
        expects: 'expected ‘'+this.subject+'’ to be equal to ‘'+expected+'’',
        rejects: 'expected ‘'+this.subject+'’ to not be equal to ‘'+expected+'’'
      }
    });
  },
  
  equalsArray: function(expected) {
    var subject = this.subject;
    this.resolver.assert({
      run: function() {
        return Moksi.Object.isEqualEnumerable(subject, expected);
      },
      assertionResult: this.assertionResult,
      messages: {
        expects: 'expected ['+this.subject.join(', ')+'] to be equal to ['+expected.join(', ')+']',
        rejects: 'expected ['+this.subject.join(', ')+'] to not be equal to ['+expected.join(', ')+']'
      }
    });
  },
  
  truthy: function() {
    var subject = this.subject;
    this.resolver.assert({
      run: function() {
        return subject;
      },
      assertionResult: this.assertionResult,
      messages: {
        expects: 'expected ‘'+this.subject+'’ to be truthy',
        rejects: 'expected ‘'+this.subject+'’ to not be truthy'
      }
    });
  },
  
  // TODO: Find a way to show nicer output for expected values.
  empty: function() {
    var subject = this.subject;
    this.resolver.assert({
      run: function() {
        return Moksi.Object.isEmpty(subject);
      },
      assertionResult: this.assertionResult,
      messages: {
        expects: 'expected ‘'+this.subject+'’ to be empty',
        rejects: 'expected ‘'+this.subject+'’ to not be empty',
      }
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
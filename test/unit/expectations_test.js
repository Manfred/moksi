Moksi.describe('Moksi.Expectations.Resolver', {
  setup: function() {
    this.resolver = new Moksi.Expectations.Resolver();
    
    this.successfulExpectation = function() {
      return { result: true, expectedResult: true, message: null };
    };
    this.successfulRejection = function() {
      return { result: false, expectedResult: false, message: null };
    };
    this.failedExpectation = function() {
      return { result: false, expectedResult: true, message: 'expected message' };
    };
    this.failedRejection = function() {
      return { result: true, expectedResult: false, message: 'expected message' };
    };
  },
  
  'captures and flushes expectation results': function() {
    this.suite.resolver.capture('ok');
    var results = this.suite.resolver.flush();
    expects(results.length).equals(1);
    expects(results[0].result).equals('ok');
    
    this.suite.resolver.capture('not ok', 'things I expect should be the case');
    var results = this.suite.resolver.flush();
    expects(results.length).equals(1);
    expects(results[0].result).equals('not ok');
    expects(results[0].message).equals('things I expect should be the case');
    
    expects(this.suite.resolver.results).empty();
  },
  
  'reports success when there are no expectations': function() {
    var report = this.suite.resolver.report();
    expects(report.result).equals('ok');
  },
  
  'reports failure when all expectations fail': function() {
    this.suite.resolver.capture('not ok', 'something is not ok');
    this.suite.resolver.capture('not ok', 'something else is also bad');
    
    var report = this.suite.resolver.report();
    expects(report.result).equals('not ok');
  },
  
  'reports failure when one expectation fails': function() {
    this.suite.resolver.capture('ok');
    this.suite.resolver.capture('not ok', 'something is not ok');
    
    var report = this.suite.resolver.report();
    expects(report.result).equals('not ok');
  },
  
  'reports expectation messages': function() {
    this.suite.resolver.capture('ok');
    this.suite.resolver.capture('not ok', 'something is not ok');
    this.suite.resolver.capture('not ok', 'something else is also bad');
    
    var report = this.suite.resolver.report();
    expects(report.messages).equalsArray(['something is not ok', 'something else is also bad']);
  },
  
  'reports the correct expectation count': function() {
    expects(this.suite.resolver.report().expectationCount).equals(0);
    
    this.suite.resolver.capture('ok');
    expects(this.suite.resolver.report().expectationCount).equals(1);
    
    this.suite.resolver.capture('ok');
    this.suite.resolver.capture('ok');
    expects(this.suite.resolver.report().expectationCount).equals(2);
  },
  
  'runs a successful assertion and reports success (expected)': function() {
    this.suite.resolver.assert(this.suite.successfulExpectation);
    var results = this.suite.resolver.flush();
    expects(results.length).equals(1);
    expects(results[0].result).equals('ok');
  },
  
  'runs a failed assertion and reports failure (expected)': function() {
    this.suite.resolver.assert(this.suite.failedExpectation);
    var results = this.suite.resolver.flush();
    expects(results.length).equals(1);
    expects(results[0].result).equals('not ok');
    expects(results[0].message).equals('expected message');
  },
  
  'runs a successful assertion and reports success (rejected)': function() {
    this.suite.resolver.assert(this.suite.successfulRejection);
    var results = this.suite.resolver.flush();
    expects(results.length).equals(1);
    expects(results[0].result).equals('ok');
  },
  
  'runs a failed assertion and reports failure (rejected)': function() {
    this.suite.resolver.assert(this.suite.failedRejection);
    var results = this.suite.resolver.flush();
    expects(results.length).equals(1);
    expects(results[0].result).equals('not ok');
    expects(results[0].message).equals('expected message');
  },
  
  'records a delayed assertion': function() {
    expects(this.suite.resolver.delayed.length).equals(0);
    this.suite.resolver.assertDelayed({})
    expects(this.suite.resolver.delayed.length).equals(1);
  },
  
  'runs a delayed successful assertion and reports success (expected)': function() {
    this.suite.resolver.assertDelayed(this.suite.successfulExpectation);
    this.suite.resolver.runDelayedAssertions();
    var results = this.suite.resolver.flush();
    expects(results.length).equals(1);
    expects(results[0].result).equals('ok');
  },
  
  'runs a delayed failed assertion and reports failure (expected)': function() {
    this.suite.resolver.assertDelayed(this.suite.failedExpectation);
    this.suite.resolver.runDelayedAssertions();
    var results = this.suite.resolver.flush();
    expects(results.length).equals(1);
    expects(results[0].result).equals('not ok');
    expects(results[0].message).equals('expected message');
  },
  
  'runs a delayed successful assertion and reports success (rejected)': function() {
    this.suite.resolver.assertDelayed(this.suite.successfulRejection);
    this.suite.resolver.runDelayedAssertions();
    var results = this.suite.resolver.flush();
    expects(results.length).equals(1);
    expects(results[0].result).equals('ok');
  },
  
  'runs a delayed failed assertion and reports failure (rejected)': function() {
    this.suite.resolver.assertDelayed(this.suite.failedRejection);
    this.suite.resolver.runDelayedAssertions();
    var results = this.suite.resolver.flush();
    expects(results.length).equals(1);
    expects(results[0].result).equals('not ok');
    expects(results[0].message).equals('expected message');
  }
});

var BaseTestSuite = {
  setup: function() {
    this.resolver = new Moksi.Expectations.Resolver();
  },
  
  helpers: {
    expectAssertionsRun: function(method, options) {
      options.examples.each(function(example) {
        var expectation = new Moksi.Expectations.Expectation(example[0], options.asserting, this.suite.resolver);
        expectation[method](example[1]);
      }, this);
      
      expects(this.suite.resolver.results.length).equals(options.examples.length);
      expects(this.suite.resolver.results.all(function(result) {
        return result.result == options.withResult;
      })).truthy();
      
      if (options.withMessages) {
        var i = options.withMessages.length;
        while(i--) {
          expects(this.suite.resolver.results[i].message).equals(options.withMessages[i]);
        }
      }
    }
  }
}

Moksi.describe('Moksi.Expectations.Expectation, concerning equals', Object.extend({
  'reports success for successful expected tests': function() {
    // For example expects(1).equals(1) should succeed
    expectAssertionsRun('equals', {
      examples:   [[1, 1], [2, 2], ['ok', 'ok'], [2.0, 2.0]],
      asserting:  true,
      withResult: 'ok'
    });
  },
  
  'reports failure for failed expected tests': function() {
    // For example expects(1).equals(2) should fail
    expectAssertionsRun('equals', {
      examples:   [[1, 2], [2, 1], ['ok', 'not ok'], [2.0, 2.1]],
      asserting:  true,
      withResult: 'not ok',
      withMessages: [
        'expected ‘1’ to be equal to ‘2’',
        'expected ‘2’ to be equal to ‘1’',
        'expected ‘ok’ to be equal to ‘not ok’',
        'expected ‘2’ to be equal to ‘2.1’'
      ]
    });
  },
  
  'reports success for successful rejected tests': function() {
    // For example rejects(1).equals(2) should succeed
    expectAssertionsRun('equals', {
      examples:   [[1, 2], [2, 1], ['ok', 'not ok'], [2.0, 2.1]],
      asserting:  false,
      withResult: 'ok'
    });
  },
  
  'reports failure for failed rejected tests': function() {
    // For example rejects(1).equals(1) should fail
    expectAssertionsRun('equals', {
      examples:   [[1, 1], [2, 2], ['ok', 'ok'], [2.1, 2.1]],
      asserting:  false,
      withResult: 'not ok',
      withMessages: [
        'expected ‘1’ to not be equal to ‘1’',
        'expected ‘2’ to not be equal to ‘2’',
        'expected ‘ok’ to not be equal to ‘ok’',
        'expected ‘2.1’ to not be equal to ‘2.1’'
      ]
    });
  }
}, BaseTestSuite));

Moksi.describe('Moksi.Expectations.Expectation, concerning equalsArray', Object.extend({
  'reports success for successful expected tests': function() {
    // For example expects([1]).equalsArray([1]) should succeed
    expectAssertionsRun('equalsArray', {
      examples:   [[[1], [1]], [[1,2], [1,2]], [['ok'], ['ok']], [[2.0], [2.0]]],
      asserting:  true,
      withResult: 'ok'
    });
  },
  
  'reports failure for failed expected tests': function() {
    // For example expects([1]).equalsArray([2]) should fail
    expectAssertionsRun('equalsArray', {
      examples:   [[[1], [2]], [[1,2], [2,1]], [['ok'], ['not ok']], [[2.0], [2.1]]],
      asserting:  true,
      withResult: 'not ok',
      withMessages: [
        'expected [1] to be equal to [2]',
        'expected [1, 2] to be equal to [2, 1]',
        'expected [ok] to be equal to [not ok]',
        'expected [2] to be equal to [2.1]'
      ]
    });
  },
  
  'reports success for successful rejected tests': function() {
    // For example rejects([1]).equalsArray([2]) should succeed
    expectAssertionsRun('equalsArray', {
      examples:   [[[1], [2]], [[1,2], [2,1]], [['ok'], ['not ok']], [[2.0], [2.1]]],
      asserting:  false,
      withResult: 'ok'
    });
  },
  
  'reports failure for failed rejected tests': function() {
    // For example rejects([1]).equalsArray([1]) should fail
    expectAssertionsRun('equalsArray', {
      examples:   [[[1], [1]], [[1,2], [1,2]], [['ok'], ['ok']], [[2.1], [2.1]]],
      asserting:  false,
      withResult: 'not ok',
      withMessages: [
        'expected [1] to not be equal to [1]',
        'expected [1, 2] to not be equal to [1, 2]',
        'expected [ok] to not be equal to [ok]',
        'expected [2.1] to not be equal to [2.1]'
      ]
    });
  }
}, BaseTestSuite));

Moksi.describe('Moksi.Expectations.Expectation, concerning truthy', Object.extend({
  'reports success for successful expected tests': function() {
    // For example expects(true).truthy() should succeed
    expectAssertionsRun('truthy', {
      examples:   [[true], [1]],
      asserting:  true,
      withResult: 'ok'
    });
  },
  
  'reports failure for failed expected tests': function() {
    // For example expects(false).truthy() should fail
    expectAssertionsRun('truthy', {
      examples:   [[false], [2], [0]],
      asserting:  true,
      withResult: 'not ok',
      withMessages: [
        'expected ‘false’ to be truthy',
        'expected ‘2’ to be truthy',
        'expected ‘0’ to be truthy'
      ]
    });
  },
  
  'reports success for successful rejected tests': function() {
    // For example rejects(false).truthy() should succeed
    expectAssertionsRun('truthy', {
      examples:   [[false], [0]],
      asserting:  false,
      withResult: 'ok'
    });
  },
  
  'reports failure for failed rejected tests': function() {
    // For example rejects(true).truthy() should fail
    expectAssertionsRun('truthy', {
      examples:   [[true], [1]],
      asserting:  false,
      withResult: 'not ok',
      withMessages: [
        'expected ‘true’ to not be truthy',
        'expected ‘1’ to not be truthy'
      ]
    });
  }
}, BaseTestSuite));

Moksi.describe('Moksi.Expectations.Expectation, concerning empty', Object.extend({
  'reports success for successful expected tests': function() {
    // For example expects([]).empty() should succeed
    expectAssertionsRun('empty', {
      examples:   [[[]], [{}]],
      asserting:  true,
      withResult: 'ok'
    });
  },

  'reports failure for failed expected tests': function() {
    // For example expects(['a']).empty() should fail
    expectAssertionsRun('empty', {
      examples:   [[['a', 'b']], [[1]], [{a:1}]],
      asserting:  true,
      withResult: 'not ok',
      withMessages: [
        'expected ‘a,b’ to be empty',
        'expected ‘1’ to be empty',
        'expected ‘[object Object]’ to be empty'
      ]
    });
  },

  'reports success for successful rejected tests': function() {
    // For example rejects(['a']).empty() should succeed
    expectAssertionsRun('empty', {
      examples:   [[['a']], [[1]], [{a:1}]],
      asserting:  false,
      withResult: 'ok'
    });
  },
  
  'reports failure for failed rejected tests': function() {
    // For example rejects([]).empty() should fail
    expectAssertionsRun('empty', {
      examples:   [[[]], [{}]],
      asserting:  false,
      withResult: 'not ok',
      withMessages: [
        'expected ‘’ to not be empty',
        'expected ‘[object Object]’ to not be empty'
      ]
    });
  }
}, BaseTestSuite));

var Person = {
  name: function() {
    return 'Alice';
  },
  
  hasFriend: function(name) {
    return true;
  }
}

Moksi.describe('Moksi.Expectations.Expectation, concerning receives', Object.extend({
  'reports success for successful expected tests': function() {
    // For example expects(Person).receives('name') should succeed
    var expectation = new Moksi.Expectations.Expectation(Person, true, this.suite.resolver);
    expectation.receives('name');
    Person.name();
    
    expects(this.suite.resolver.results).empty();
    expects(this.suite.resolver.delayed.length).equals(1);
    
    this.suite.resolver.runDelayedAssertions();
    
    expects(this.suite.resolver.delayed).empty();
    expects(this.suite.resolver.results.length).equals(1);
    
    expects(this.suite.resolver.results[0].result).equals('ok');
  },
  
  'reports failure for failed expected tests': function() {
    // For example expects(Person).receives('name') should fail
    var expectation = new Moksi.Expectations.Expectation(Person, true, this.suite.resolver);
    expectation.receives('name');
    
    expects(this.suite.resolver.results).empty();
    expects(this.suite.resolver.delayed.length).equals(1);
    
    this.suite.resolver.runDelayedAssertions();
    
    expects(this.suite.resolver.delayed).empty();
    expects(this.suite.resolver.results.length).equals(1);
    
    expects(this.suite.resolver.results[0].result).equals('not ok');
    expects(this.suite.resolver.results[0].message).equals('expected ‘[object Object]’ to receive ‘name’');
  },
  
  'reports success for successful rejected tests': function() {
    // For example rejects(Person).receives('name') should succeed
    var expectation = new Moksi.Expectations.Expectation(Person, false, this.suite.resolver);
    expectation.receives('name');
    
    expects(this.suite.resolver.results).empty();
    expects(this.suite.resolver.delayed.length).equals(1);
    
    this.suite.resolver.runDelayedAssertions();
    
    expects(this.suite.resolver.delayed).empty();
    expects(this.suite.resolver.results.length).equals(1);
    
    expects(this.suite.resolver.results[0].result).equals('ok');
  },
  
  'reports failure for failed rejected tests': function() {
    // For example rejects(Person).receives('name') should fail
    var expectation = new Moksi.Expectations.Expectation(Person, false, this.suite.resolver);
    expectation.receives('name');
    Person.name();
    
    expects(this.suite.resolver.results).empty();
    expects(this.suite.resolver.delayed.length).equals(1);
    
    this.suite.resolver.runDelayedAssertions();
    
    expects(this.suite.resolver.delayed).empty();
    expects(this.suite.resolver.results.length).equals(1);
    
    expects(this.suite.resolver.results[0].result).equals('not ok');
    expects(this.suite.resolver.results[0].message).equals('expected ‘[object Object]’ to not receive ‘name’');
  },
  
  'reports success for successful expected test with expected arguments': function() {
    var expectation = new Moksi.Expectations.Expectation(Person, true, this.suite.resolver);
    expectation.receives('hasFriend', {
      withArguments: ['Manfred']
    });
    
    Person.hasFriend('Manfred');
    this.suite.resolver.runDelayedAssertions();
    
    expects(this.suite.resolver.results.length).equals(1);
    expects(this.suite.resolver.results[0].result).equals('ok');
  },
  
  'reports failure for failed expected test with expected arguments': function() {
    var expectation = new Moksi.Expectations.Expectation(Person, true, this.suite.resolver);
    expectation.receives('hasFriend', {
      withArguments: ['Manfred']
    });
    
    Person.hasFriend();
    Person.hasFriend('Krista');
    this.suite.resolver.runDelayedAssertions();
    
    expects(this.suite.resolver.results.length).equals(1);
    expects(this.suite.resolver.results[0].result).equals('not ok');
    expects(this.suite.resolver.results[0].message).equals('expected ‘[object Object]’ to receive ‘hasFriend(Manfred)’');
  },
  
  'reports success for successful rejected test with expected arguments': function() {
    var expectation = new Moksi.Expectations.Expectation(Person, false, this.suite.resolver);
    expectation.receives('hasFriend', {
      withArguments: ['Manfred']
    });
    
    Person.hasFriend();
    Person.hasFriend('Krista');
    this.suite.resolver.runDelayedAssertions();
    
    expects(this.suite.resolver.results.length).equals(1);
    expects(this.suite.resolver.results[0].result).equals('ok');
  },
  
  'reports failure for failed rejected test with expected arguments': function() {
    var expectation = new Moksi.Expectations.Expectation(Person, false, this.suite.resolver);
    expectation.receives('hasFriend', {
      withArguments: ['Manfred']
    });
    
    Person.hasFriend('Manfred');
    this.suite.resolver.runDelayedAssertions();
    
    expects(this.suite.resolver.results.length).equals(1);
    expects(this.suite.resolver.results[0].result).equals('not ok');
    expects(this.suite.resolver.results[0].message).equals('expected ‘[object Object]’ to not receive ‘hasFriend(Manfred)’');
  },
  
  'reports success for successful expected test with expected arguments and an invocation count': function() {
    var expectation = new Moksi.Expectations.Expectation(Person, true, this.suite.resolver);
    expectation.receives('hasFriend', {
      withArguments: ['Manfred'],
      times: 2
    });
    
    Person.hasFriend('Manfred');
    Person.hasFriend('Manfred');
    this.suite.resolver.runDelayedAssertions();
    
    expects(this.suite.resolver.results.length).equals(1);
    expects(this.suite.resolver.results[0].result).equals('ok');
  },
  
  'reports failure for failed expected test with expected arguments and an invocation count': function() {
    var expectation = new Moksi.Expectations.Expectation(Person, true, this.suite.resolver);
    expectation.receives('hasFriend', {
      withArguments: ['Manfred'],
      times: 2
    });
    
    Person.hasFriend();
    Person.hasFriend('Krista');
    Person.hasFriend('Manfred');
    this.suite.resolver.runDelayedAssertions();
    
    expects(this.suite.resolver.results.length).equals(1);
    expects(this.suite.resolver.results[0].result).equals('not ok');
    expects(this.suite.resolver.results[0].message).equals('expected ‘[object Object]’ to receive ‘hasFriend(Manfred)’ 2 times, but was 1 time');
  },
  
  'reports success for successful rejected test with expected arguments and an invocation count': function() {
    var expectation = new Moksi.Expectations.Expectation(Person, false, this.suite.resolver);
    expectation.receives('hasFriend', {
      withArguments: ['Manfred'],
      times: 2
    });
    
    Person.hasFriend();
    Person.hasFriend('Krista');
    Person.hasFriend('Manfred');
    this.suite.resolver.runDelayedAssertions();
    
    expects(this.suite.resolver.results.length).equals(1);
    expects(this.suite.resolver.results[0].result).equals('ok');
  },
  
  'reports failure for failed rejected test with expected arguments and an invocation count': function() {
    var expectation = new Moksi.Expectations.Expectation(Person, false, this.suite.resolver);
    expectation.receives('hasFriend', {
      withArguments: ['Manfred'],
      times: 2
    });
    
    Person.hasFriend('Manfred');
    Person.hasFriend('Manfred');
    this.suite.resolver.runDelayedAssertions();
    
    expects(this.suite.resolver.results.length).equals(1);
    expects(this.suite.resolver.results[0].result).equals('not ok');
    expects(this.suite.resolver.results[0].message).equals('expected ‘[object Object]’ to not receive ‘hasFriend(Manfred)’ 2 times, but was 2 times');
  }
}, BaseTestSuite));
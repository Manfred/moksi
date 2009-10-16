Moksi.describe('Moksi.Expectations.Collection', {
  'captures and flushes expectation results': function() {
    var collection = new Moksi.Expectations.Collection();
    
    collection.capture('ok');
    var results = collection.flush();
    expects(results.length).equals(1);
    expects(results[0].result).equals('ok');
    
    collection.capture('not ok', 'things I expect should be the case');
    var results = collection.flush();
    expects(results.length).equals(1);
    expects(results[0].result).equals('not ok');
    expects(results[0].message).equals('things I expect should be the case');
    
    expects(collection.results).empty();
  },
  
  'reports success when there are no expectations': function() {
    var collection = new Moksi.Expectations.Collection();
    var report = collection.report();
    expects(report.result).equals('ok');
  },
  
  'reports success when all expectations fail': function() {
    var collection = new Moksi.Expectations.Collection();
    collection.capture('not ok', 'something is not ok');
    collection.capture('not ok', 'something else is also bad');
    
    var report = collection.report();
    expects(report.result).equals('not ok');
  },
  
  'reports failure when one expectation fails': function() {
    var collection = new Moksi.Expectations.Collection();
    collection.capture('ok');
    collection.capture('not ok', 'something is not ok');
    
    var report = collection.report();
    expects(report.result).equals('not ok');
  },
  
  'reports expectation messages': function() {
    var collection = new Moksi.Expectations.Collection();
    collection.capture('ok');
    collection.capture('not ok', 'something is not ok');
    collection.capture('not ok', 'something else is also bad');
    
    var report = collection.report();
    expects(report.messages).equalsArray(['something is not ok', 'something else is also bad']);
  },
  
  'reports the correct expectation count': function() {
    var collection = new Moksi.Expectations.Collection();
    
    expects(collection.report().expectationCount).equals(0);
    
    collection.capture('ok');
    expects(collection.report().expectationCount).equals(1);
    
    collection.capture('ok');
    collection.capture('ok');
    expects(collection.report().expectationCount).equals(2);
  }
});

var Fake = {};
Fake.Collection = {
  captured: [],
  capture: function(result, message) {
    Fake.Collection.captured.push({result: result, message: message});
  }
}

var BaseTestSuite = {
  setup: function() {
    Fake.Collection.captured = [];
  },
  
  helpers: {
    expectAssertionsRun: function(method, options) {
      options.examples.each(function(example) {
        var subject = new Moksi.Expectations.Subject(example[0], Fake.Collection, {result: options.asserting});
        subject[method](example[1]);
      }, this);
      
      expects(Fake.Collection.captured.length).equals(options.examples.length);
      expects(Fake.Collection.captured.all(function(result) {
        return result.result == options.withResult;
      })).truthy();
      
      if (options.withMessages) {
        var i; for (i=0; i < options.withMessages.length; i++) {
          expects(Fake.Collection.captured[i].message).equals(options.withMessages[i]);
        }
      }
    }
  }
}

Moksi.describe('Moksi.Expectations.Subject, concerning equals', Object.extend({
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

Moksi.describe('Moksi.Expectations.Subject, concerning equalsArray', Object.extend({
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

Moksi.describe('Moksi.Expectations.Subject, concerning truthy', Object.extend({
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
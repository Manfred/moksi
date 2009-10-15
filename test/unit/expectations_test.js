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
    expects(report.contents).equalsArray(['something is not ok', 'something else is also bad']);
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

Fake = {};
Fake.Collection = {
  captured: [],
  capture: function(result) {
    Fake.Collection.captured.push(result);
  }
}

Moksi.describe('Moksi.Expectations.Subject', {
  'reports success for successful equality tests': function() {
    Fake.Collection.captured = [];
    var examples = [
      [1, 1], [2, 2], ['ok', 'ok'], [2.0, 2.0]
    ];
    
    examples.each(function(example) {
      var subject = new Moksi.Expectations.Subject(example[0], Fake.Collection, {result: true});
      subject.equals(example[1]);
    }, this);
    
    expects(Fake.Collection.captured.length).equals(examples.length);
    expects(Fake.Collection.captured.all(function(element) {
      return element == 'ok';
    })).truthy();
  },
  
  'reports failure for failed equality tests': function() {
    Fake.Collection.captured = [];
    var examples = [
      [1, 2], [2, 1], ['ok', 'not ok'], [2.0, 2.1]
    ];
    
    examples.each(function(example) {
      var subject = new Moksi.Expectations.Subject(example[0], Fake.Collection, {result: true});
      subject.equals(example[1]);
    }, this);
    
    expects(Fake.Collection.captured.length).equals(examples.length);
    expects(Fake.Collection.captured.all(function(element) {
      return element == 'not ok';
    })).truthy();
  },
  
  'reports success for successful not null tests': function() {
    Fake.Collection.captured = [];
    var examples = [1, 0, 'a', false, true];
    
    examples.each(function(example) {
      var subject = new Moksi.Expectations.Subject(example, Fake.Collection, {result: true});
      subject.notNull();
    }, this);
    
    expects(Fake.Collection.captured.length).equals(examples.length);
    expects(Fake.Collection.captured.all(function(element) {
      return element == 'ok';
    })).truthy();
  },
  
  'reports failure for failed not null tests': function() {
    Fake.Collection.captured = [];
    
    var subject = new Moksi.Expectations.Subject(null, Fake.Collection, {result: true});
    subject.notNull();
    
    expects(Fake.Collection.captured.length).equals(1);
    expects(Fake.Collection.captured.first()).equals('not ok');
  }
});
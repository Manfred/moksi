Moksi.Expectations = {};

Moksi.Expectations.Collection = Class.create({
  initialize: function() {
    this.results = [];
  },
  
  capture: function(result, message) {
    this.results.push({result: result, message: message});
  },
  
  flush: function() {
    var results = this.results;
    this.results = [];
    return results;
  },
  
  report: function() {
    var expectations = this.flush();
    var report = {result: 'ok', contents: [], expectationCount: 0};
    
    expectations.each(function(expectation) {
      report.expectationCount += 1;
      if (expectation.result == 'not ok') {
        report.result = 'not ok';
        report.contents.push(expectation.message);
      }
    });
    
    return report;
  }
});

Moksi.Expectations.Subject = Class.create({
  initialize: function(subject, collection, options) {
    this.subject    = subject;
    this.collection = collection;
    this.options    = options;
  },
  
  equals: function(expected) {
    if ((this.subject == expected) == this.options.result) {
      this.collection.capture('ok');
    } else {
      this.collection.capture('not ok', 'expected ‘'+this.subject+'’ to be equal to ‘'+expected+'’');
    }
  },
  
  equalsArray: function(expected) {
    if (this.subject.length != expected.length) return false;
    
    var success = true;
    for (i=0; i < expected.length; i++) {
      if (this.subject[i] != expected[i]) success = false; break;
    }
    
    if (success) {
      this.collection.capture('ok');
    } else {
      this.collection.capture('not ok', 'expected ['+this.subject.join(', ')+'] to be equal to ['+expected.join(', ')+']');
    }
  },
  
  empty: function() {
    if ((this.subject.length == 0) == this.options.result) {
      this.collection.capture('ok');
    } else {
      this.collection.capture('not ok', 'expected ‘'+this.subject+'’ to be empty');
    }
  }
});

Moksi.Expectations.Methods = function() {
  var _expectations = new Moksi.Expectations.Collection();
  
  function expects(subject) {
    return new Moksi.Expectations.Subject(subject, _expectations, {result: true});
  }

  function rejects(subject) {
    return new Moksi.Expectations.Subject(subject, _expectations, {result: false});
  }
  
  return {_expectations: _expectations, expects: expects, rejects: rejects};
}();
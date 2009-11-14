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

Moksi.Expectations.Subject = Class.create({
  initialize: function(subject, collection, options) {
    this.subject    = subject;
    this.collection = collection;
    this.options    = options;
  },
  
  _assert: function(result, messages) {
    if (result == this.options.result)
    {
      this.collection.capture('ok');
    } else {
      var message = this.options.result ? messages.expects : messages.rejects;
      this.collection.capture('not ok', message);
    }
  },
  
  equals: function(expected) {
    this._assert(Moksi.Object.isEqual(this.subject, expected), {
      expects: 'expected ‘'+this.subject+'’ to be equal to ‘'+expected+'’',
      rejects: 'expected ‘'+this.subject+'’ to not be equal to ‘'+expected+'’'
    })
  },
  
  equalsArray: function(expected) {
    var equals = true;
    
    if (this.subject.length != expected.length) {
      equals = false;
    } else {
      for (i=0; i < expected.length; i++) {
        if (this.subject[i] != expected[i]) equals = false; break;
      }
    }
    
    this._assert(equals, {
      expects: 'expected ['+this.subject.join(', ')+'] to be equal to ['+expected.join(', ')+']',
      rejects: 'expected ['+this.subject.join(', ')+'] to not be equal to ['+expected.join(', ')+']'
    });
  },
  
  truthy: function() {
    this._assert(this.subject, {
      expects: 'expected ‘'+this.subject+'’ to be truthy',
      rejects: 'expected ‘'+this.subject+'’ to not be truthy'
    });
  },
  
  // TODO: Find a way to show nicer output for expected values.
  empty: function() {
    this._assert(Moksi.Object.isEmpty(this.subject), {
      expects: 'expected ‘'+this.subject+'’ to be empty',
      rejects: 'expected ‘'+this.subject+'’ to not be empty',
    });
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
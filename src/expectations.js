Moksi.Expectations = {};

Moksi.Expectations.Collection = {
  results: [],
  
  capture: function(result, message) {
    Moksi.Expectations.Collection.results.push({result: result, message: message});
  },
  
  flush: function() {
    var results = Moksi.Expectations.Collection.results;
    Moksi.Expectations.Collection.results = [];
    return results;
  },
  
  report: function() {
    var expectations = Moksi.Expectations.Collection.flush();
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
};

Moksi.Expectations.Subject = Class.create({
  initialize: function(subject, options) {
    this.subject = subject;
    this.options = options;
  },
  
  equals: function(expected) {
    if ((this.subject == expected) == this.options.result) {
      Moksi.Expectations.Collection.capture('ok');
    } else {
      Moksi.Expectations.Collection.capture('not ok', 'expected <'+this.subject+'> to be equal to <'+expected+'>');
    }
  }
});

Moksi.Expectations.Methods = function() {
  function expects(subject) {
    return new Moksi.Expectations.Subject(subject, {result: true});
  }

  function rejects(subject) {
    return new Moksi.Expectations.Subject(subject, {result: false});
  }
  
  return {expects: expects, rejects: rejects};
}();
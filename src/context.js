Moksi.Context = Class.create({
  initialize: function(subject, cases) {
    this.subject = subject;
    this.cases   = $H(cases);
    
    Moksi.Reporter.plan(subject, this.cases.keys().length);
  },
  
  run: function() {
    this.cases.each(function(test) {
      var result = test.value();
      Moksi.Reporter.report(result.result, test.key, result.message);
    });
  }
});
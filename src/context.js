Moksi.Context = Class.create({
  initialize: function(subject, cases) {
    this.subject = subject;
    this.cases   = $H(cases);
    
    Object.extend(this.cases, Moksi.Expectations.Methods);
    Moksi.Reporter.plan(subject, this.cases.keys().length);
  },
  
  run: function() {
    this.cases.each(function(test) {
      test.value.bind(this.cases)();
      var report = Moksi.Expectations.Collection.report();
      Moksi.Reporter.report(report.result, test.key, report.contents);
    }, this);
  }
});
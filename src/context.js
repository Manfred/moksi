Moksi.Context = Class.create({
  initialize: function(subject, cases, options) {
    options = options || {};
    
    this.subject  = subject;
    this.cases    = $H(cases);
    this.reporter = options.reporter || new Moksi.Reporter();
    
    Object.extend(this.cases, Moksi.Expectations.Methods);
    this.reporter.plan(subject, this.cases.keys().length);
  },
  
  run: function() {
    this.cases.each(function(test) {
      test.value.bind(this.cases)();
      var report = Moksi.Expectations.Collection.report();
      this.reporter.report(test.key, report);
    }, this);
  }
});
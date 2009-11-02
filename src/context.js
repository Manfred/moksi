Moksi.Context = Class.create({
  initialize: function(subject, cases, options) {
    options = options || {};
    
    this.subject  = subject;
    this.suite    = cases;
    this.cases    = $H(cases).select(function(testCase) {
      return Object.isFunction(testCase.value) && (testCase.key != 'setup') && (testCase.key != 'teardown');
    });
    this.reporter = options.reporter || new Moksi.Reporter();
    
    Object.extend(this.cases, Moksi.Expectations.Methods);
    
    this.reporter.plan(subject, this.cases.length);
  },
  
  run: function() {
    this.cases.each(function(test) {
      var suite   = this.suite;
      var helpers = this.suite.helpers;
      
      if (suite.setup) suite.setup();
      
      Object.extend(test.value, (function() {
        Object.extend(this, {suite: suite})
        Object.extend(this, helpers);
        Object.extend(this, Moksi.Expectations.Methods);
      })())();
      
      if (suite.teardown) suite.teardown();
      if (Moksi.unstubAll) Moksi.unstubAll();
      
      var report = Moksi.Expectations.Methods._expectations.report();
      this.reporter.report(test.key, report);
    }, this);
  }
});
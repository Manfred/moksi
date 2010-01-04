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
      
      var helpers = {};
      if (Moksi.Helpers) {
        for (module in Moksi.Helpers) { if (Moksi.Helpers.hasOwnProperty(module)) {
          Object.extend(helpers, Moksi.Helpers[module]);
        }}
      }
      Object.extend(helpers, this.suite.helpers);
      
      var context = function() {
        Object.extend(this, {suite: suite})
        Object.extend(this, helpers);
        Object.extend(this, Moksi.Expectations.Methods);
      };
      
      if (suite.setup) {
        Object.extend(suite.setup, context())();
      }
      
      Object.extend(test.value, context())();
      
      if (suite.teardown) {
        Object.extend(suite.teardown, context())();
      }
      
      if (Moksi.unstubAll) Moksi.unstubAll();
      Moksi.Expectations.Methods._resolver.runDelayedAssertions();
      Moksi.Invocations.reset();
      
      var report = Moksi.Expectations.Methods._resolver.report();
      this.reporter.report(test.key, report);
    }, this);
  }
});
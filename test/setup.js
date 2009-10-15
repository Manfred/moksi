var Runner = {
  loadContext: function(options) {
    var testFile = '../' + options['test'] + '_test.js';
    Moksi.require('../fake_reporter.js')
    Moksi.require(testFile);
  },
  
  run: function() {
    var options = window.location.search.parseQuery();
    Runner.loadContext(options);
  }
};

window.onload = Runner.run;
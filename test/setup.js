var Runner = {
  loadContext: function(options) {
    var testFile = '../' + options['test'] + '_test.js';
    Moksi.require(testFile);
  },
  
  run: function() {
    var options = window.location.search.parseQuery();
    if (options['test'])
      Runner.loadContext(options);
    else
      console.log("No test!");
  }
};

window.onload = Runner.run;
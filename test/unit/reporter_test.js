Moksi.describe('Moksi.Reporter', {
  'inserts HTML to log test output to': function() {
    var output = $('moksi-reporter-output');
    if (!output) {
      document.body.insert({bottom: '<div id="moksi-reporter-output" style="display:none;"></div>'});
      output = $('moksi-reporter-output');
    }
    
    var reporter = new Moksi.Reporter({output: output});
    reporter.plan('Planting tomatoes', 1);
    
    var context = output.select('div.context').last();
    var header  = context.down('h2');
    var table   = context.down('table');
    
    expects(header.tagName).equals('H2');
    expects(table.tagName).equals('TABLE');
    
    expects(header.innerHTML).equals('Planting tomatoes <span class="test-count">(1 test)</span>');
  },
  
  'properly pluralizes “test” depending on the number of tests': function() {
    var output = $('moksi-reporter-output');
    if (!output) {
      document.body.insert({bottom: '<div id="moksi-reporter-output" style="display:none;"></div>'});
      output = $('moksi-reporter-output');
    }
    
    var reporter = new Moksi.Reporter({output: output});
    reporter.plan('', 1);
    
    var context = output.select('div.context').last();
    var header  = context.down('h2');
    
    expects(header.innerHTML).equals(' <span class="test-count">(1 test)</span>');
    
    reporter.plan('', 2);
    
    context = output.select('div.context').last();
    header  = context.down('h2');
    
    expects(header.innerHTML).equals(' <span class="test-count">(2 tests)</span>');
  },
  
  'inserts HTML with the test report': function() {
    var output = $('moksi-reporter-output');
    if (!output) {
      document.body.insert({bottom: '<div id="moksi-reporter-output" style="display:none;"></div>'});
      output = $('moksi-reporter-output');
    }
    
    var reporter = new Moksi.Reporter({output: output});
    reporter.plan('Planting tomatoes', 1);
    reporter.report('results in juicy tomatoes', {expectationCount: 2, contents: ["didn't plant them right", "not enough sun"]})
    
    var context = output.select('div.context').last();
    var row     = context.down('tr');
    
    expects(row.innerHTML).equals('<td class="result"></td><td class="description">results in juicy tomatoes (2 assertions)</td><td class="message"><span class="message-part">didn\'t plant them right</span> <span class="message-part">not enough sun</span></td>');
  },
  
  'properly reports the number of assertions': function() {
    var output = $('moksi-reporter-output');
    if (!output) {
      document.body.insert({bottom: '<div id="moksi-reporter-output" style="display:none;"></div>'});
      output = $('moksi-reporter-output');
    }
    
    var reporter = new Moksi.Reporter({output: output});
    reporter.plan('Planting tomatoes', 1);
    reporter.report('results in juicy tomatoes', {expectationCount: 0, contents: []})
    
    var context = output.select('div.context').last();
    var row     = context.select('tr').last();
    
    expects(row.innerHTML).equals('<td class="result"></td><td class="description">results in juicy tomatoes (No assertions)</td><td class="message"></td>');
    
    
    reporter.report('results in juicy tomatoes', {expectationCount: 1, contents: ["didn't plant them right"]})
    
    var context = output.select('div.context').last();
    var row     = context.select('tr').last();
    
    expects(row.innerHTML).equals('<td class="result"></td><td class="description">results in juicy tomatoes (One assertion)</td><td class="message"><span class="message-part">didn\'t plant them right</span></td>');
  }
});
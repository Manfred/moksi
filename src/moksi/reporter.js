Moksi.Reporter = Class.create({
  initialize: function(options) {
    options = options || {};
    
    this.domID     = 'test-log-' + (new Date).valueOf();
    this.output    = options.output || document.body,
    this.templates = options.templates || Moksi.Reporter.Templates
  },
  
  plan: function(description, count) {
    var tests = count + (count > 1 ? ' tests' : ' test');
    this.output.insert({bottom: this.templates.context.evaluate({
      description: description.escapeHTML(), tests: tests.escapeHTML(), token: this.domID
    })});
  },
  
  report: function(description, report) {
    switch(report.expectationCount) {
      case 0:
        var assertions = 'No assertions';
        break;
      case 1:
        var assertions = 'One assertion';
        break;
      default:
        var assertions = report.expectationCount + ' assertions';
    };
    var messages = report.messages.map(function(message) {
      return this.templates.message.evaluate({message: message.escapeHTML()});
    }, this).join(' ');
    $(this.domID).insert({bottom: this.templates.result.evaluate({
      result: report.result, description: description.escapeHTML(), assertions: assertions, messages: messages
    })});
  }
});

Moksi.Reporter.Templates = {
  context: new Template('<div class="context"><h2>#{description} <span class="test-count">(#{tests})</span></h2><table><tbody id="#{token}"></tbody></table></div>'),
  result:  new Template('<tr class="test #{result}"><td class="result">#{result}</td><td class="description">#{description} (#{assertions})</td><td class="messages">#{messages}</td></tr>'),
  message: new Template('<span class="message-part">#{message}</span>')
};

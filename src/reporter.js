Moksi.Reporter = Class.create({
  initialize: function(options) {
    options = options || {};
    
    this.output     = options.output || document.body,
    this.templates = options.templates || Moksi.Reporter.Templates
  },
  
  plan: function(description, count) {
    var tests = count > 1 ? count + ' tests' : count + ' test';
    this.output.insert({bottom: this.templates.context.evaluate({
      description: description.escapeHTML(), tests: tests.escapeHTML()
    })});
  },
  
  report: function(result, description, messages) {
    var message = messages.map(function(message) {
      return this.templates.message.evaluate({message: message.escapeHTML()});
    }, this).join(' ');
    $('test-log').insert({bottom: this.templates.result.evaluate({
      result: result, description: description.escapeHTML(), message: message
    })});
  }
});

Moksi.Reporter.Templates = {
  context: new Template('<div class="context"><h2>#{description} <span class="test-count">(#{tests})</span></h2><table><tbody id="test-log"></tbody></table></div>'),
  result:  new Template('<tr class="test #{result}"><td class="result">#{result}</td><td class="description">#{description}</td><td class="message">#{message}</td></tr>'),
  message: new Template('<span class="message-part">#{message}</span>')
};

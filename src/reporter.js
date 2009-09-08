Moksi.Reporter = {
  contextTemplate: new Template('<div class="context"><h2>#{description} <span class="test-count">(#{tests})</span></h2><table><tbody id="test-log"></tbody></table></div>'),
  resultTemplate:  new Template('<tr class="test #{result}"><td class="result">#{result}</td><td class="description">#{description}</td><td class="message">#{message}</td></tr>'),
  messageTemplate: new Template('<span class="message-part">#{message}</span>'),
  
  plan: function(description, count) {
    var tests = count > 1 ? count + ' tests' : count + ' test';
    document.body.insert({bottom: Moksi.Reporter.contextTemplate.evaluate({
      description: description, tests: tests
    })});
  },
  
  report: function(result, description, messages) {
    var message = messages.map(function(message) {
      return this.messageTemplate.evaluate({message: message});
    }, this).join(' ');
    $('test-log').insert({bottom: Moksi.Reporter.resultTemplate.evaluate({
      result: result, description: description, message: message
    })});
  }
};
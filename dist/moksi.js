/*
 * Copyright © 2009 Manfred Stienstra, Fingertips <manfred@fngtps.com>
 *
 * See LICENSE for licensing details.
 */

var Moksi = {
  VERSION: "0.1.0",

  describe: function(subject, cases) {
    var context = new Moksi.Context(subject, cases)
    return context.run();
  },

  require: function(filename) {
    var uniq = new Date().valueOf();
    var script = document.createElement('script');
    script.type = 'application/javascript';
    script.src = filename + '?' + uniq;
    document.body.appendChild(script);
  }
};

Moksi.Context = Class.create({
  initialize: function(subject, cases) {
    this.subject = subject;
    this.cases = $H(cases);

    Moksi.Reporter.plan(subject, this.cases.keys().length);
  },

  run: function() {
    this.cases.each(function(testCase) {
      var result = testCase.value();
      Moksi.Reporter.report(result.result, testCase.key, result.message);
    });
  }
});

Moksi.Reporter = {
  contextTemplate: new Template('<div class="context"><h2>#{description} <span class="test-count">#{count} tests</span></h2><table><tbody id="test-log"></tbody></table></div>'),
  resultTemplate:  new Template('<tr class="test #{result}"><td>#{result}</td><td>#{description}</td><td>#{message}</td></tr>'),

  plan: function(description, count) {
    console.log(description + ' – ' + count);
    document.body.insert({bottom: Moksi.Reporter.contextTemplate.evaluate({
      description: description, count: count
    })});
  },

  report: function(result, description, message) {
    $('test-log').insert({bottom: Moksi.Reporter.resultTemplate.evaluate({
      result: result, description: description, message: message
    })});
  }
};

Moksi.Expectation = {};
Moksi.Expectation.Subject = Class.create({
  initialize: function(subject, options) {
    this.subject = subject;
    this.options = options;
  },

  equals: function(expected) {
    if ((this.subject == expected) == options.result)
      console.log('Yay')
    else
      console.log('Boo')
  }
});

Moksi.Expectations = {
  expects: function(subject) {
    return new Moksi.Expectations.Subject(subject, {result: true});
  },

  rejects: function(subject) {
    return new Moksi.Expectations.Subject(subject, {result: false});
  }
};

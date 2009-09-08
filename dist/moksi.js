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

Moksi.Expectations = {};

Moksi.Expectations.Collection = {
  results: [],

  capture: function(result, message) {
    Moksi.Expectations.Collection.results.push({result: result, message: message});
  },

  flush: function() {
    var results = Moksi.Expectations.Collection.results;
    Moksi.Expectations.Collection.results = [];
    return results;
  },

  report: function() {
    var expectations = Moksi.Expectations.Collection.flush();
    var report = {result: 'ok', contents: [], expectationCount: 0};

    expectations.each(function(expectation) {
      report.expectationCount += 1;
      if (expectation.result == 'not ok') {
        report.result = 'not ok';
        report.contents.push(expectation.message);
      }
    });

    return report;
  }
};

Moksi.Expectations.Subject = Class.create({
  initialize: function(subject, options) {
    this.subject = subject;
    this.options = options;
  },

  equals: function(expected) {
    if ((this.subject == expected) == this.options.result) {
      Moksi.Expectations.Collection.capture('ok');
    } else {
      Moksi.Expectations.Collection.capture('not ok', 'expected <'+this.subject+'> to be equal to <'+expected+'>');
    }
  }
});

Moksi.Expectations.Methods = function() {
  function expects(subject) {
    return new Moksi.Expectations.Subject(subject, {result: true});
  }

  function rejects(subject) {
    return new Moksi.Expectations.Subject(subject, {result: false});
  }

  return {expects: expects, rejects: rejects};
}();

Moksi.Context = Class.create({
  initialize: function(subject, cases) {
    this.subject = subject;
    this.cases   = $H(cases);

    Object.extend(this.cases, Moksi.Expectations);

    Moksi.Reporter.plan(subject, this.cases.keys().length);
  },

  run: function() {
    this.cases.each(function(test) {
      Object.extend(test.value, Moksi.Expectations.Methods);

      var report = Moksi.Expectations.Collection.report();
      Moksi.Reporter.report(report.result, test.key, report.contents);
    });
  }
});

Moksi.Reporter = {
  contextTemplate: new Template('<div class="context"><h2>#{description} <span class="test-count">(#{tests})</span></h2><table><tbody id="test-log"></tbody></table></div>'),
  resultTemplate:  new Template('<tr class="test #{result}"><td class="result">#{result}</td><td class="description">#{description}</td><td class="message">#{message}</td></tr>'),

  plan: function(description, count) {
    var tests = count > 1 ? count + ' tests' : count + ' test';
    document.body.insert({bottom: Moksi.Reporter.contextTemplate.evaluate({
      description: description, tests: tests
    })});
  },

  report: function(result, description, message) {
    $('test-log').insert({bottom: Moksi.Reporter.resultTemplate.evaluate({
      result: result, description: description, message: message
    })});
  }
};

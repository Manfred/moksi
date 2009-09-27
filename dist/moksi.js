/*
 * Copyright © 2009 Manfred Stienstra, Fingertips <manfred@fngtps.com>
 *
 * See LICENSE for licensing details.
 */

var Moksi = {
  VERSION: "0.1.0",

  describe: function(subject, cases, options) {
    var context = new Moksi.Context(subject, cases, options);
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
      Moksi.Expectations.Collection.capture('not ok', 'expected ‘'+this.subject+'’ to be equal to ‘'+expected+'’');
    }
  },

  empty: function() {
    if ((this.subject.length == 0) == this.options.result) {
      Moksi.Expectations.Collection.capture('ok');
    } else {
      Moksi.Expectations.Collection.capture('not ok', 'expected ‘'+this.subject+'’ to be empty');
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
  initialize: function(subject, cases, options) {
    options = options || {};

    this.subject  = subject;
    this.cases    = $H(cases);
    this.reporter = options.reporter || new Moksi.Reporter();

    Object.extend(this.cases, Moksi.Expectations.Methods);
    this.reporter.plan(subject, this.cases.keys().length);
  },

  run: function() {
    this.cases.each(function(test) {
      test.value.bind(this.cases)();
      var report = Moksi.Expectations.Collection.report();
      this.reporter.report(test.key, report);
    }, this);
  }
});

Moksi.Reporter = Class.create({
  initialize: function(options) {
    options = options || {};

    this.domID     = 'test-log-' + new Date().valueOf();
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
    var message = report.contents.map(function(message) {
      return this.templates.message.evaluate({message: message.escapeHTML()});
    }, this).join(' ');
    $(this.domID).insert({bottom: this.templates.result.evaluate({
      result: report.result, description: description.escapeHTML(), assertions: assertions, message: report.contents
    })});
  }
});

Moksi.Reporter.Templates = {
  context: new Template('<div class="context"><h2>#{description} <span class="test-count">(#{tests})</span></h2><table><tbody id="#{token}"></tbody></table></div>'),
  result:  new Template('<tr class="test #{result}"><td class="result">#{result}</td><td class="description">#{description} (#{assertions})</td><td class="message">#{message}</td></tr>'),
  message: new Template('<span class="message-part">#{message}</span>')
};

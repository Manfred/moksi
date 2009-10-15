/*
 * Copyright © 2009 Manfred Stienstra, Fingertips <manfred@fngtps.com>
 *
 * See LICENSE for licensing details.
 */

var Moksi = {
  VERSION: "0.1.0",

  describe: function(subject, cases, options) {
    var context = new Moksi.Context(subject, cases, options);
    context.run();
    return context;
  },

  require: function(filename) {
    var uniq = new Date().valueOf();
    var script = document.createElement('script');
    script.type = 'application/javascript';
    script.src = filename + '?' + uniq;
    document.body.appendChild(script);
  }
};

Moksi.Object = {
  isEqual: function(left, right) {
    if (left && (typeof left == 'function')) {
      return left == right;
    } else if (left && (typeof left.length == 'number') && (typeof left != 'string')) {
      return Moksi.Object.isEqualEnumerable(left, right);
    } else if (typeof left == 'object') {
      return Moksi.Object.isEqualObject(left, right);
    } else {
      return left == right;
    }
  },

  isEqualEnumerable: function(left, right) {
    if (left.length != right.length) return false;

    for(i=0; i < left.length; i++) {
      if (!this.isEqual(left[i], right[i])) return false;
    }

    return true;
  },

  isEqualObject: function(left, right) {
    for (var key in left) {
      if (!this.isEqual(left[key], right[key])) return false;
    }
    for (var key in right) {
      if (!this.isEqual(left[key], right[key])) return false;
    }
    return true;
  }
};

Moksi.Expectations = {};

Moksi.Expectations.Collection = Class.create({
  initialize: function() {
    this.results = [];
  },

  capture: function(result, message) {
    this.results.push({result: result, message: message});
  },

  flush: function() {
    var results = this.results;
    this.results = [];
    return results;
  },

  report: function() {
    var expectations = this.flush();
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
});

Moksi.Expectations.Subject = Class.create({
  initialize: function(subject, collection, options) {
    this.subject    = subject;
    this.collection = collection;
    this.options    = options;
  },

  _assert: function(result, message) {
    if (result == this.options.result)
    {
      this.collection.capture('ok');
    } else {
      this.collection.capture('not ok', message);
    }
  },

  equals: function(expected) {
    this._assert(
      Moksi.Object.isEqual(this.subject, expected),
      'expected ‘'+this.subject+'’ to be equal to ‘'+expected+'’'
    )
  },

  equalsArray: function(expected) {
    var equals = true;

    if (this.subject.length != expected.length) {
      equals = false;
    } else {
      for (i=0; i < expected.length; i++) {
        if (this.subject[i] != expected[i]) equals = false; break;
      }
    }

    this._assert(equals, 'expected ['+this.subject.join(', ')+'] to be equal to ['+expected.join(', ')+']');
  },

  notNull: function() {
    this._assert(this.subject != null, 'expected ‘'+this.subject+'’ to not be null');
  },

  truthy: function() {
    this._assert(this.subject, 'expected ‘'+this.subject+'’ to be true');
  },

  falsy: function() {
    this._assert(!this.subject, 'expected ‘'+this.subject+'’ to be false');
  },

  empty: function() {
    this._assert(this.subject.length == 0, 'expected ‘'+this.subject+'’ to be empty');
  }
});

Moksi.Expectations.Methods = function() {
  var _expectations = new Moksi.Expectations.Collection();

  function expects(subject) {
    return new Moksi.Expectations.Subject(subject, _expectations, {result: true});
  }

  function rejects(subject) {
    return new Moksi.Expectations.Subject(subject, _expectations, {result: false});
  }

  return {_expectations: _expectations, expects: expects, rejects: rejects};
}();

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
      var helpers = this.suite.helpers;

      if (suite.setup) suite.setup();

      Object.extend(test.value, (function() {
        Object.extend(this, {suite: suite})
        Object.extend(this, helpers);
        Object.extend(this, Moksi.Expectations.Methods);
      })())();

      if (suite.teardown) suite.teardown();

      var report = Moksi.Expectations.Methods._expectations.report();
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
    var messages = report.contents.map(function(message) {
      return this.templates.message.evaluate({message: message.escapeHTML()});
    }, this).join(' ');
    $(this.domID).insert({bottom: this.templates.result.evaluate({
      result: report.result, description: description.escapeHTML(), assertions: assertions, message: messages
    })});
  }
});

Moksi.Reporter.Templates = {
  context: new Template('<div class="context"><h2>#{description} <span class="test-count">(#{tests})</span></h2><table><tbody id="#{token}"></tbody></table></div>'),
  result:  new Template('<tr class="test #{result}"><td class="result">#{result}</td><td class="description">#{description} (#{assertions})</td><td class="message">#{message}</td></tr>'),
  message: new Template('<span class="message-part">#{message}</span>')
};

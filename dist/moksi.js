/*
 * Copyright © 2009 Manfred Stienstra, Fingertips <manfred@fngtps.com>
 *
 * See LICENSE for licensing details.
 */

var Moksi = {
  VERSION: "0.2.0",

  describe: function(subject, cases, options) {
    var context = new Moksi.Context(subject, cases, options);
    context.run();
    return context;
  },

  require: function(filename) {
    var uniq = (new Date).valueOf();
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
    var report = {result: 'ok', messages: [], expectationCount: 0};

    expectations.each(function(expectation) {
      report.expectationCount += 1;
      if (expectation.result == 'not ok') {
        report.result = 'not ok';
        report.messages.push(expectation.message);
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

  _assert: function(result, messages) {
    if (result == this.options.result)
    {
      this.collection.capture('ok');
    } else {
      var message = this.options.result ? messages.expects : messages.rejects;
      this.collection.capture('not ok', message);
    }
  },

  equals: function(expected) {
    this._assert(Moksi.Object.isEqual(this.subject, expected), {
      expects: 'expected ‘'+this.subject+'’ to be equal to ‘'+expected+'’',
      rejects: 'expected ‘'+this.subject+'’ to not be equal to ‘'+expected+'’'
    })
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

    this._assert(equals, {
      expects: 'expected ['+this.subject.join(', ')+'] to be equal to ['+expected.join(', ')+']',
      rejects: 'expected ['+this.subject.join(', ')+'] to not be equal to ['+expected.join(', ')+']'
    });
  },

  truthy: function() {
    this._assert(this.subject, {
      expects: 'expected ‘'+this.subject+'’ to be truthy',
      rejects: 'expected ‘'+this.subject+'’ to not be truthy'
    });
  },

  empty: function() {
    this._assert(this.subject.length == 0, {
      expects: 'expected ‘'+this.subject+'’ to be empty'
    });
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
      if (Moksi.unstubAll) Moksi.unstubAll();

      var report = Moksi.Expectations.Methods._expectations.report();
      this.reporter.report(test.key, report);
    }, this);
  }
});

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

Moksi.Stubber = {
  stubbed: [],

  beforeStubPrefix: "__before_stub_",
  beforeStubRegexp: /^__before_stub_(.*)$/,

  stubbedName: function(name) {
    return this.beforeStubPrefix + name;
  },

  stub: function(object, name, definition) {
    var temporaryName = this.stubbedName(name);

    object[temporaryName] = object[name];
    object[name] = definition;

    if (this.stubbed.indexOf(object) == -1) {
      this.stubbed.push(object);
    }
  },

  unstub: function(object, name) {
    var temporaryName = this.stubbedName(name);
    object[name] = object[temporaryName];
    delete object[temporaryName];
  },

  unstubAll: function() {
    var object;
    while(object = this.stubbed.pop()) {
      for (var property in object) { if (object.hasOwnProperty(property)) {
        var match;
        if (match = property.match(this.beforeStubRegexp)) {
          this.unstub(object, match[1], property);
        }
      }}
    }
  }
};

Object.extend(Moksi, {
  stubber: Moksi.Stubber,

  stubs: function(object, name, definition) {
    this.stubber.stub(object, name, definition);
  },

  unstub: function(object, name) {
    this.stubber.unstub(object, name);
  },

  unstubAll: function() {
    this.stubber.unstubAll();
  }
});

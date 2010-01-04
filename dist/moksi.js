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
  isUndefined: function(object) {
    return typeof object === "undefined";
  },

  isEmpty: function(object) {
    if (Moksi.Object.isUndefined(object)) return true;
    if (object == null) return true;

    if (object.length > 0) {
      return false;
    } else {
      for (property in object) { if (object.hasOwnProperty(property)) {
        return false;
      } }
    }
    return true;
  },

  isEqual: function(left, right) {
    if (left == null && right == null) return true;

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
    if (Moksi.Object.isUndefined(left) || Moksi.Object.isUndefined(right)) return false;
    if (left == null || right == null) return false;

    if (left.length != right.length) return false;
    var i = left.length;
    while(i--) {
      if (!this.isEqual(left[i], right[i])) return false;
    }
    return true;
  },

  isEqualObject: function(left, right) {
    if (Moksi.Object.isUndefined(left) || Moksi.Object.isUndefined(right)) return false;
    if (left == null || right == null) return false;

    for (var key in left) {
      if (!this.isEqual(left[key], right[key])) return false;
    }
    for (var key in right) {
      if (!this.isEqual(left[key], right[key])) return false;
    }
    return true;
  }
};

if (typeof Moksi == 'undefined') Moksi = {};

Moksi.Invocations = {
  invoked: [],

  register: function() {
    this.invoked.push(arguments);
  },

  isEqualCall: function(one, other) {
    if (Moksi.Object.isEqualEnumerable(one, other)) return true;
    if (
      Moksi.Object.isEqual(one[0], other[0]) &&
      Moksi.Object.isEqual(one[1], other[1]) &&
      Moksi.Object.isEmpty(one[2]) &&
      Moksi.Object.isEmpty(other[2])
    ) return true;
    return false;
  },

  isCalled: function() {
    var i = this.invoked.length;
    if (!i) return false;
    while(i--) {
      if (Moksi.Invocations.isEqualCall(arguments, this.invoked[i])) return true;
    }
    return false;
  },

  invocationCount: function() {
    var i = this.invoked.length, count = 0;
    if (!i) return false;
    while(i--) {
      if (Moksi.Invocations.isEqualCall(arguments, this.invoked[i])) count += 1
    }
    return count;
  },

  reset: function() {
    this.invoked = [];
  }
};

Moksi.Expectations = {};

Moksi.Expectations.Expectation = Class.create({
  initialize: function(subject, expectedResult, resolver) {
    this.subject        = subject;
    this.expectedResult = expectedResult;
    this.resolver       = resolver;
  },

  _assert: function(assertion, messages) {
    this.resolver.assert(assertion.curry(this.subject, this.expectedResult));
  },

  _assertDelayed: function(assertion, messages) {
    this.resolver.assertDelayed(assertion.curry(this.subject, this.expectedResult));
  },

  equals: function(expected) {
    this._assert(function(subject, expectedResult) {
      var message, result = Moksi.Object.isEqual(subject, expected);

      if (result != expectedResult) {
        if (expectedResult) {
          message = 'expected ‘'+subject+'’ to be equal to ‘'+expected+'’';
        } else {
          message = 'expected ‘'+subject+'’ to not be equal to ‘'+expected+'’';
        }
      }

      return { result: result, message: message, expectedResult: expectedResult };
    });
  },

  equalsArray: function(expected) {
    this._assert(function(subject, expectedResult) {
      var message, result = Moksi.Object.isEqualEnumerable(subject, expected);

      if (result != expectedResult) {
        if (expectedResult) {
          message = 'expected ['+subject.join(', ')+'] to be equal to ['+expected.join(', ')+']';
        } else {
          message = 'expected ['+subject.join(', ')+'] to not be equal to ['+expected.join(', ')+']';
        }
      }

      return { result: result, message: message, expectedResult: expectedResult };
    });
  },

  truthy: function() {
    this._assert(function(subject, expectedResult) {
      var message, result = subject;

      if (result != expectedResult) {
        if (expectedResult) {
          message = 'expected ‘'+subject+'’ to be truthy';
        } else {
          message = 'expected ‘'+subject+'’ to not be truthy';
        }
      }

      return { result: result, message: message, expectedResult: expectedResult };
    });
  },

  empty: function() {
    this._assert(function(subject, expectedResult) {
      var message, result = Moksi.Object.isEmpty(subject);

      if (result != expectedResult) {
        if (expectedResult) {
          message = 'expected ‘'+subject+'’ to be empty';
        } else {
          message = 'expected ‘'+subject+'’ to not be empty';
        }
      }

      return { result: result, message: message, expectedResult: expectedResult };
    });
  },

  receives: function(method, options) {
    options = options || {}

    Moksi.stubs(this.subject, method, function(subject) {
      Moksi.Invocations.register(subject, method, subject[method].arguments);
      return options.returns;
    }.curry(this.subject));

    this._assertDelayed(function(subject, expectedResult) {
      var _times = function(count) {
        return '' + count + (count == 1 ? ' time' : ' times');
      };

      var result, invocationCount, messageParts = [];

      invocationCount = Moksi.Invocations.invocationCount(subject, method, options.withArguments)

      if (options.times) {
        result = invocationCount == options.times;
      } else {
        result = invocationCount > 0;
      }

      if (result != expectedResult) {
        messageParts.push('expected ‘'+subject+'’');

        if (expectedResult) {
          messageParts.push('to receive');
        } else {
          messageParts.push('to not receive');
        }

        if (options.withArguments) {
          messageParts.push('‘'+method+'('+options.withArguments+')’');
        } else {
          messageParts.push('‘'+method+'’');
        }

        if (options.times) {
          messageParts.push(_times(options.times)+', but was '+_times(invocationCount));
        }
      }

      return { result: result, message: messageParts.join(' '), expectedResult: expectedResult };
    });
  }
});

Moksi.Expectations.Resolver = Class.create({
  initialize: function() {
    this.results = [];
    this.delayed = [];
  },

  flush: function() {
    var results = this.results;
    this.results = [];
    return results;
  },

  assert: function(assertion) {
    var assertion = assertion();
    if (assertion.result == assertion.expectedResult) {
      this.capture('ok');
    } else {
      this.capture('not ok', assertion.message);
    }
  },

  assertDelayed: function(assertion) {
    this.delayed.push(assertion);
  },

  runDelayedAssertions: function() {
    this.delayed.each(this.assert, this);
    this.delayed = [];
  },

  capture: function(result, message) {
    this.results.push({result: result, message: message});
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


Moksi.Expectations.Methods = function() {
  var _resolver = new Moksi.Expectations.Resolver();

  function expects(subject) {
    return new Moksi.Expectations.Expectation(subject, true, _resolver);
  }

  function rejects(subject) {
    return new Moksi.Expectations.Expectation(subject, false, _resolver);
  }

  return {_resolver: _resolver, expects: expects, rejects: rejects};
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

      Moksi.Expectations.Methods._resolver.runDelayedAssertions();
      Moksi.Invocations.reset();

      var report = Moksi.Expectations.Methods._resolver.report();
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

if (typeof Moksi == 'undefined') Moksi = {};

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

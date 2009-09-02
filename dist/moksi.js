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
    this.cases = cases;
  },

  run: function() {
    for (var description in this.cases) { if (this.cases.hasOwnProperty(description)) {
      this.cases[description]();
    }};
  }
});

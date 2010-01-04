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

//= require "moksi/object"

//= require "moksi/stubbing"

//= require "moksi/invocations"

//= require "moksi/expectations"

//= require "moksi/context"

//= require "moksi/reporter"
/*
 * Copyright © 2009 Manfred Stienstra, Fingertips <manfred@fngtps.com>
 *
 * See LICENSE for licensing details.
 */
 
if (typeof Moksi == 'undefined')                 Moksi = {};
if (typeof Moksi.Helpers == 'undefined') Moksi.Helpers = {};

Moksi.Helpers.Sample = {
  addSample: function(contents) {
    var sample = $('sample');
    if (!sample) {
      document.body.insert({bottom: '<div id="sample"></div>'});
      sample = $('sample');
    }
    sample.insert({bottom: contents});
  },
  
  clearSamples: function() {
    var sample = $('sample');
    if (sample) sample.remove();
  },
  
  setSample: function(contents) {
    clearSamples();
    addSample(contents);
  }
};
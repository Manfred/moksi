# Moksi

Moksi is an all-in-one JavaScript testing framework with a lot of salt, but easy on the pepper. With Moksi you write tests which are terse and readable.

## A taste

    var Person = Class.create({
      initialize: function(name, mood) {
        this._name = name;
      },
      
      name: function() {
        return this._name;
      },
  
      toBlurb: function() {
        return this.name() + ' is a ' + mood + ' person.';
      }
    });

    Moksi.describe('Person', {
      setup: function() {
        this.person = new Person('Alice', 'happy');
      },
  
      'describes itself in a blurb': function() {
        expects(this.person.toBlurb()).equals('Alice is a happy person.');
      },
      
      'includes the name in the blurb': function() {
        expects(this.person).receives('name', { times: 1 });
        this.toBlurb();
      }
    });

Copyright © 2009, Manfred Stienstra <manfred@fngtps.com>
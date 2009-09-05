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
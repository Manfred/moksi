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
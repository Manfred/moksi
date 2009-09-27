Fake = {};
Fake.Reporter = {
  plan: function(description, count) {
    Fake.Reporter.description = description;
    Fake.Reporter.count       = count;
    Fake.Reporter.results     = [];
  },
  
  report: function(result, report) {
    Fake.Reporter.results.push([result, report]);
    return [];
  }
};

Moksi.describe('Example', {
  'should succeed': function() {
    this.expects(0).equals(0);
    this.expects(1).equals(1);
  },
  
  'should fail': function() {
    this.expects(0).equals(1);
    this.expects(0).equals(2);
  }
}, { reporter: Fake.Reporter });

Moksi.describe('Moksi.Context', {
  'reports its description': function() {
    this.expects(Fake.Reporter.description).equals('Example');
  },
  
  'reports its number of tests': function() {
    this.expects(Fake.Reporter.count).equals(2);
  },
  
  'reports succeeding tests with proper result and description': function() {
    var success = Fake.Reporter.results[0];
    
    this.expects(success[0]).equals('should succeed');
    this.expects(success[1].result).equals('ok');
    this.expects(success[1].expectationCount).equals(2);
    this.expects(success[1].contents).empty();
  },
  
  'reports failing tests with proper result, description, and messages': function() {
    var failure = Fake.Reporter.results[1];
    
    this.expects(failure[0]).equals('should fail');
    this.expects(failure[1].result).equals('not ok');
    this.expects(failure[1].expectationCount).equals(2);
    this.expects(failure[1].contents.length).equals(2);
    this.expects(failure[1].contents[0]).equals('expected ‘0’ to be equal to ‘1’');
    this.expects(failure[1].contents[1]).equals('expected ‘0’ to be equal to ‘2’');
  }
});
Moksi.describe('Example', {
  setup: function() {},
  teardown: function() {},
  helpers: {},
  
  'should succeed': function() {
    expects(0).equals(0);
    expects(1).equals(1);
  },
  
  'should fail': function() {
    expects(0).equals(1);
    expects(0).equals(2);
  },
}, { reporter: Fake.Reporter });

Moksi.describe('Moksi.Context', {
  helpers: {
    globalHelper: function() {
      return true;
    }
  },
  
  'reports its description': function() {
    expects(Fake.Reporter.description).equals('Example');
  },
  
  'reports its number of tests': function() {
    expects(Fake.Reporter.count).equals(2);
  },
  
  'reports succeeding tests with proper result and description': function() {
    var success = Fake.Reporter.results[0];
    
    expects(success[0]).equals('should succeed');
    expects(success[1].result).equals('ok');
    expects(success[1].expectationCount).equals(2);
    expects(success[1].contents).empty();
  },
  
  'reports failing tests with proper result, description, and messages': function() {
    var failure = Fake.Reporter.results[1];
    
    expects(failure[0]).equals('should fail');
    expects(failure[1].result).equals('not ok');
    expects(failure[1].expectationCount).equals(2);
    expects(failure[1].contents.length).equals(2);
    expects(failure[1].contents[0]).equals('expected ‘0’ to be equal to ‘1’');
    expects(failure[1].contents[1]).equals('expected ‘0’ to be equal to ‘2’');
  },
  
  'has access to its helpers': function() {
    expects(globalHelper()).equals(true);
  }
});
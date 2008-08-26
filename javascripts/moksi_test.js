var Person = {
  name: function() {
    return 'Alice';
  },
  age: function() {
    return 21;
  }
};

var MockTestCaseAssertions = {
  assertActualCalls: function(expected, actual) {
    this.assertEqual(expected, this.mockTestCase.assertEqualArguments[0]);
    this.assertEqual(actual, this.mockTestCase.assertEqualArguments[1]);
    this.assertEqual('mock test case', this.mockTestCase.assertEqualArguments[2]);
  }
};

new Test.Unit.Runner({
  setup: function() {
    Moksi.stub(Person, 'name', function() {
      return 'Bob';
    });
    Moksi.stub(Person, 'age', function() {
      return 28;
    });
    
    this.mockTestCase = {
      assertEqualArguments: null,
      assertEqual: function() {
        this.assertEqualArguments = this.assertEqual.arguments;
      },
      buildMessage: function() {
        return 'mock test case';
      }
    };
    
    Object.extend(this, MockTestCaseAssertions);
  },
  
  teardown: function() {
    Moksi.revert();
  },
  
  testStub: function() {
    this.assertEqual('Bob', Person.name());
    this.assertEqual(28, Person.age());
  },
  
  testRevert: function() {
    Moksi.revert();
    this.assertEqual('Alice', Person.name());
    this.assertEqual(21, Person.age());
  },
  
  testUnstub: function() {
    Moksi.unstub(Person, 'name');
    this.assertEqual('Alice', Person.name());
    this.assertEqual(28, Person.age());
  },
  
  testExpects: function() {
    Moksi.expects(Person, 'name');
    this.assertEqual(null, Person.name());
  },
  
  testAssertExpectationsSucceeds: function() {
    Moksi.expects(Person, 'name');
    Person.name();    
    Moksi.assertExpectations(this);
  },
  
  testAssertExpectationsNotCalled: function() {
    Moksi.expects(Person, 'name');
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(1, 0);
  },
  
  testAssertExpectationsCalledTooOften: function() {
    Moksi.expects(Person, 'name');
    
    Person.name();
    Person.name();
    Person.name();
    
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(1, 3);
  },
  
  testAssertExpectationsCalledWithArgument: function() {
    Moksi.expects(Person, 'name');
    Person.name('Kari');
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(1, 0);
  },
  
  testAssertExpectationsWithRequiredArguments: function() {
    Moksi.expects(Person, 'name', {with: ['Kari']});
    Person.name('Kari');
    Moksi.assertExpectations(this);
  },
  
  testAssertExpectationsWithRequiredArgumentsNotCalled: function() {
    Moksi.expects(Person, 'name', {with: ['Kari']});
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(1, 0);
  },
  
  testAssertExpectationsWithRequiredArgumentsCalledTooOften: function() {
    Moksi.expects(Person, 'name', {with: ['Kari']});
    
    Person.name('Kari');
    Person.name('Kari');
    Person.name('Kari');
    
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(1, 3);
  },
  
  testAssertExpectationsWithRequiredArgumentsCalledWithoutArguments: function() {
    Moksi.expects(Person, 'name', {with: ['Kari']});
    Person.name();
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(1, 0);
  },
  
  testAssertExpectationsWithRequiredArgumentsCalledWithWrongArguments: function() {
    Moksi.expects(Person, 'name', {with: ['Kari']});
    Person.name('Jane');
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(1, 0);
  }
});
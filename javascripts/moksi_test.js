var Person = {
  name: function() {
    return 'Alice';
  },
  age: function() {
    return 21;
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
    var mockTestCase = {
      assertEqualArguments: null,
      assertEqual: function() {
        this.assertEqualArguments = this.assertEqual.arguments;
      },
      buildMessage: function() {
        return 'built message';
      }
    };
    
    Moksi.expects(Person, 'name');
    
    Moksi.assertExpectations(mockTestCase);
    
    this.assertEqual(1, mockTestCase.assertEqualArguments[0]);
    this.assertEqual(0, mockTestCase.assertEqualArguments[1]);
    this.assertEqual('built message', mockTestCase.assertEqualArguments[2]);
  },
  
  testAssertExpectationsCalledTooOften: function() {
    var mockTestCase = {
      assertEqualArguments: null,
      assertEqual: function() {
        this.assertEqualArguments = this.assertEqual.arguments;
      },
      buildMessage: function() {
        return 'built message';
      }
    };
    
    Moksi.expects(Person, 'name');
    
    Person.name();
    Person.name();
    Person.name();
    
    Moksi.assertExpectations(mockTestCase);
    
    this.assertEqual(1, mockTestCase.assertEqualArguments[0]);
    this.assertEqual(3, mockTestCase.assertEqualArguments[1]);
    this.assertEqual('built message', mockTestCase.assertEqualArguments[2]);
  }
});
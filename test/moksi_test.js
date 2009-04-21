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
  
  testSameArgumentsWithNoArguments: function() {
    this.assert(Moksi.sameArguments([], []));
  },
  
  testSameArgumentsWithBasicTypes: function() {
    this.assert(Moksi.sameArguments([1], [1]));
    this.assert(Moksi.sameArguments([1, 2], [1, 2]));
    this.assert(Moksi.sameArguments([1, 2, 3], [1, 2, 3]));
    
    this.assert(!Moksi.sameArguments([1], []));
    this.assert(!Moksi.sameArguments([], [1]));
    this.assert(!Moksi.sameArguments([1, 3, 2], [1, 2, 3]));
  },
  
  testSameArgumentsWithObjects: function() {
    this.assert(Moksi.sameArguments([{}], [{}]));
    this.assert(Moksi.sameArguments([{a: 1}], [{a: 1}]));
    this.assert(Moksi.sameArguments([{a: 2, 'b': 3}], [{a: 2, 'b': 3}]));
    
    var left = {a: 1};
    left.b = {};
    var right = {a: 1};
    right.b = {};
    this.assert(Moksi.sameArguments([left], [right]));
    
    this.assert(!Moksi.sameArguments([{a: 1}], [{a: 2}]));
    this.assert(!Moksi.sameArguments([{a: 1, b: 3}], [{a: 1, b: 2}]));
    this.assert(!Moksi.sameArguments([{a: 1, b: 3}], [{a: 1}]));
    this.assert(!Moksi.sameArguments([{a: 1}], [{a: 1, c: 5}]));
    
    var left = {a: 1};
    left.b = {b: 2};
    var right = {a: 1};
    right.b = {b: 3};
    this.assert(!Moksi.sameArguments([left], [right]));
  },
  
  testSameArgumentsWithObjectsThatContainFunctions: function() {
    var f = function() { document.write('Nuff sed') };
    var g = function() { document.write('Word…') };
    
    var left = { onSuccess: f };
    var right = { onSuccess: f };
    this.assert(Moksi.sameArguments([left], [right]));
    
    var left = { onSuccess: f };
    var right = { onSuccess: g };
    this.assert(!Moksi.sameArguments([left], [right]));
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
  
  testAssertExpectationsCalledWithNotRequiredArgument: function() {
    Moksi.expects(Person, 'name');
    Person.name('Kari');
    Moksi.assertExpectations(this);
  },
  
  testAssertExpectationsWithRequiredArguments: function() {
    Moksi.expects(Person, 'name', { 'with': ['Kari'] });
    Person.name('Kari');
    Moksi.assertExpectations(this);
  },
  
  testAssertExpectationsWithRequiredArgumentsNotCalled: function() {
    Moksi.expects(Person, 'name', { 'with': ['Kari']});
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(1, 0);
  },
  
  testAssertExpectationsWithRequiredArgumentsCalledTooOften: function() {
    Moksi.expects(Person, 'name', { 'with': ['Kari']});
    
    Person.name('Kari');
    Person.name('Kari');
    Person.name('Kari');
    
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(1, 3);
  },
  
  testAssertExpectationsWithRequiredArgumentsCalledWithoutArguments: function() {
    Moksi.expects(Person, 'name', { 'with': ['Kari']});
    Person.name();
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(1, 0);
  },
  
  testAssertExpectationsWithRequiredArgumentsCalledWithWrongArguments: function() {
    Moksi.expects(Person, 'name', { 'with': ['Kari']});
    Person.name('Jane');
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(1, 0);
  },
  
  testAssertExpectationExpectedZeroTimes: function() {
    Moksi.expects(Person, 'name', {times: 0});
    Moksi.assertExpectations(this);
  },
  
  testAssertExpectationExpectedOnce: function() {
    Moksi.expects(Person, 'name', {times: 1});
    
    Person.name();
    
    Moksi.assertExpectations(this);
  },
  
  testAssertExpectationExpectedMoreThanOnce: function() {
    Moksi.expects(Person, 'name', {times: 2});
    
    Person.name();
    Person.name();
    
    Moksi.assertExpectations(this);
  },
  
  testAssertExpectationExpectedZeroTimesButCalled: function() {
    Moksi.expects(Person, 'name', {times: 0});
    
    Person.name();
    
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(0, 1);
  },
  
  testAssertExpectationExpectedOnceButCalledMultipleTimes: function() {
    Moksi.expects(Person, 'name', {times: 1});
    
    Person.name();
    Person.name();
    
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(1, 2);
  },
  
  testRejects: function() {
    Moksi.rejects(Person, 'name');
    Moksi.assertExpectations(this);
  },
  
  testRejectsButIsCalled: function() {
    Moksi.rejects(Person, 'name');
    
    Person.name();
    
    Moksi.assertExpectations(this.mockTestCase);
    this.assertActualCalls(0, 1);
  }
});
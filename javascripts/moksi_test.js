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
  
  testUnStub: function() {
    Moksi.unstub(Person, 'name');
    this.assertEqual('Alice', Person.name());
    this.assertEqual(28, Person.age());
  }
});
var Person;

Moksi.describe('Moksi, concerning stubbing', {
  setup: function() {
    Person = {
      name: 'Alice',
      age: function() {
        return 21;
      }
    };
  },
  
  'stubs values': function() {
    Moksi.stubs(Person, 'name', 'Berend');
    expects(Person.name).equals('Berend');
  },
  
  'stubs methods': function() {
    Moksi.stubs(Person, 'age', function() {
      return 30;
    });
    expects(Person.age()).equals(30);
  },
  
  'unstubs values': function() {
    Moksi.stubs(Person, 'name', 'Berend');
    Moksi.unstub(Person, 'name');
    expects(Person.name).equals('Alice');
  },
  
  'unstubs methods': function() {
    Moksi.stubs(Person, 'age', function() {
      return 30;
    });
    Moksi.unstub(Person, 'age');
    expects(Person.age()).equals(21);
  },
  
  'unstubs all stubs': function() {
    Moksi.stubs(Person, 'name', 'Berend');
    Moksi.stubs(Person, 'age', function() {
      return 30;
    });
    Moksi.unstubAll();
    expects(Person.name).equals('Alice');
    expects(Person.age()).equals(21);
  }
});

Person = { name: 'Alice' };

var context = Moksi.describe('Example', {
  'stubs a value': function() {
    Moksi.stubs(Person, 'name', 'Berend');
  }
}, { reporter: Fake.Reporter });

Moksi.describe('Moksi, concerning automatic unstubbing', {
  'should automatically unstub after running tests': function() {
    expects(Person.name).equals('Alice');
  }
});
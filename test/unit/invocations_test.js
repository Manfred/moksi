var Person = {
  name: 'Alice',
  lastName: 'Jansen'
};
var OtherPerson = {
  name: 'Mary',
  lastName: 'Roelofsen'
};

Moksi.describe('Moksi, concerning invocations of functions on objects', {
  setup: function() {
    Moksi.Invocations.reset();
  },
  
  'has no invocations by default': function() {
    expects(Moksi.Invocations.invoked).empty();
  },
  
  'registers invocations': function() {
    Moksi.Invocations.register(Person, 'name');
    Moksi.Invocations.register(Person, 'lastName');
    Moksi.Invocations.register(Person, 'hasLength', [3]);
    Moksi.Invocations.register(Person, 'name', [{full: true}]);
    
    expects(Moksi.Invocations.isCalled(Person, 'name')).truthy();
    expects(Moksi.Invocations.isCalled(Person, 'lastName', [])).truthy();
    expects(Moksi.Invocations.isCalled(Person, 'lastName')).truthy();
    expects(Moksi.Invocations.isCalled(Person, 'hasLength', [3])).truthy();
    expects(Moksi.Invocations.isCalled(Person, 'name', [{full: true}])).truthy();
    
    rejects(Moksi.Invocations.isCalled(Person, 'names')).truthy();
    rejects(Moksi.Invocations.isCalled(Person, 'lastName', [true])).truthy();
    rejects(Moksi.Invocations.isCalled(Person, 'hasLength', [4])).truthy();
    rejects(Moksi.Invocations.isCalled(Person, 'name', [{full: false}])).truthy();
    
    rejects(Moksi.Invocations.isCalled(OtherPerson, 'name')).truthy();
    rejects(Moksi.Invocations.isCalled(OtherPerson, 'hasLength', [3])).truthy();
    rejects(Moksi.Invocations.isCalled(OtherPerson, 'name', [{full: true}])).truthy();
  },
  
  'resets registered invocations': function() {
    Moksi.Invocations.register(Person, 'name');
    rejects(Moksi.Invocations.invoked).empty();
    Moksi.Invocations.reset();
    expects(Moksi.Invocations.invoked).empty();
  }
});
# Moksi

Moksi is a stubbing and mocking library for JavaScript.

<pre><code>var Person {
  name: function() {
    return 'Alice';
  },
  age: function() {
    return 28;
  }
}

// Stub the person's name.
Moksi.stub(Person, 'name', function() {
  return 'Bob';
});
Person.name() == 'Bob';

// Expect age to be called
Moksi.expects(Person, 'age');
Person.age();
Moksi.assertExpectations(this);

// Revert all stubs and expectations
Moksi.revert(); 
Person.name() == 'Alice';</code></pre>
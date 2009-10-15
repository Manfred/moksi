var context = Moksi.describe('Example', {
}, { reporter: Fake.Reporter });

Moksi.describe('Moksi', {
  'describe should return the context instance': function() {
    expects(context.subject).equals('Example');
  }
});
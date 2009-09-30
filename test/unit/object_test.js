Moksi.describe('Moksi.Object', {
  helpers: {
    expectEqual: function(examples) {
      console.log(examples);
      examples.each(function(example) {
        console.log(example[0]);
        expects(Moksi.Object.isEqual(example[0], example[1])).truthy();
      }, this);
    }
  },
  
  'tests base object equality': function() {
    var examples = [[1, 1], [2, 2], ['one', 'one'], [2.0, 2.0]];
    expectEqual(examples);
  }
});
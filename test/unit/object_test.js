Moksi.describe('Moksi.Object', {
  helpers: {
    expectEqual: function(examples) {
      examples.each(function(example) {
        expects(Moksi.Object.isEqual(example[0], example[1])).truthy();
      }, this);
    },
    expectNotEqual: function(examples) {
      examples.each(function(example) {
        expects(Moksi.Object.isEqual(example[0], example[1])).falsy();
      }, this);
    }
  },
  
  'tests base object equality': function() {
    var examples = [[1, 1], [2, 2], ['one', 'one'], [2.0, 2.0]];
    expectEqual(examples);
  },
  
  'tests base object inequality': function() {
    var examples = [[1, 2], [2, 1], ['one', 'two'], [2.0, 1.0]];
    expectNotEqual(examples);
  }
});
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
    expectEqual([[1, 1], [2, 2], ['one', 'one'], [2.0, 2.0]]);
  },
  
  'tests base object inequality': function() {
    expectNotEqual([[1, 2], [2, 1], ['one', 'two'], [2.0, 1.0]]);
  },
  
  'tests enumerable object equality': function() {
    expectEqual([
      [[],[]],
      [[1],[1]],
      [[1,2],[1,2]],
      [[1,2,3],[1,2,3]],
      [[[1],[2],[3,4]],[[1],[2],[3,4]]],
      [['a'],['a']],
      [[0],[0]],
    ]);
  },
  
  'test enumerable object inequality': function() {
    expectNotEqual([
      [[1],[2]],
      [[1],[]],
      [[],[1]],
      [[1,2],[1,2,3]],
      [[1,2,3],[1,2]],
      [[1,3,2],[1,2,3]],
      [[[1],[2],[3,4]],[[1],[2],[3]]],
      [['a'],['a','b']],
      [[0, 0],[0]]
    ]);
  }
});
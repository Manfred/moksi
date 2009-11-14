Moksi.describe('Moksi.Object', {
  helpers: {
    expectEqual: function(examples) {
      examples.each(function(example) {
        expects(Moksi.Object.isEqual(example[0], example[1])).truthy();
      }, this);
    },
    expectNotEqual: function(examples) {
      examples.each(function(example) {
        rejects(Moksi.Object.isEqual(example[0], example[1])).truthy();
      }, this);
    }
  },
  
  'tests if object is empty': function() {
    [{}, [], (new Object), (new Array)].each(function(example) {
      expects(Moksi.Object.isEmpty(example)).truthy();
    });
  },
  
  'test if object is not empty': function() {
    [{a:1}, ['a'], (new Array(1,2,3)), (new Object({a:1})), 'a'].each(function(example) {
      rejects(Moksi.Object.isEmpty(example)).truthy();
    });
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
  },
  
  'test complex object equality': function() {
    var f = function() { document.write('Nuff sed') };
    var g = function() { document.write('Word…') };
    
    var left = {a: 1};
    left.b = {};
    var right = {a: 1};
    right.b = {};
    
    expectEqual([
      [{},{}],
      [{a: 1}, {a: 1}],
      [{a: 2, 'b': 3}, {a: 2, 'b': 3}],
      [{f: f}, {f: f}],
      [{a: 1, name: g, other: f}, {a: 1, name: g, other: f}],
      [left, right]
    ]);
  },
  
  'test complex object inequality': function() {
    var f = function() { document.write('Nuff sed') };
    var g = function() { document.write('Word…') };

    var left = {a: 1};
    left.b = {b: 2};
    var right = {a: 1};
    right.b = {b: 3};
    
    expectNotEqual([
      [{a: 1}, {a: 2}],
      [{a: 1, b: 3}, {a: 1, b: 2}],
      [{a: 1, b: 3}, {a: 1}],
      [{a: 1}, {a: 1, c: 5}],
      [{f: f}, {f: g}],
      [{a: 1, name: f, other: g}, {a: 1, name: g, other: f}],
      [left, right]
    ]);
  }
});
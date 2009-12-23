Moksi.describe('Moksi.Object, concerning object definition', {
  'tests if object is undefined': function() {
    expects(Moksi.Object.isUndefined((function() {})())).truthy();
  },
  
  'tests if object is not undefined': function() {
    rejects(Moksi.Object.isUndefined(1)).truthy();
  }
});

Moksi.describe('Moksi.Object, concerning object contents', {
  'tests if object is empty': function() {
    [{}, [], (new Object), (new Array)].each(function(example) {
      expects(Moksi.Object.isEmpty(example)).truthy();
    });
  },
  
  'tests if object is not empty': function() {
    [{a:1}, ['a'], (new Array(1,2,3)), (new Object({a:1})), 'a'].each(function(example) {
      rejects(Moksi.Object.isEmpty(example)).truthy();
    });
  }
});

Moksi.describe('Moksi.Object, concerning general object equality', {
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
  
  'tests base object equality': function() {
    expectEqual([[1, 1], [2, 2], ['one', 'one'], [2.0, 2.0]]);
  },
  
  'tests base object inequality': function() {
    expectNotEqual([[1, 2], [2, 1], ['one', 'two'], [2.0, 1.0]]);
  },
  
  'tests undefined or empty value equality': function() {
    var undef = (function() {})();
    expectEqual([
      [undef, undef],
      [null, null]
    ]);
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
  
  'tests enumerable object inequality': function() {
    var undef = (function() {})();
    expectNotEqual([
      [[], undef],
      [undef, []],
      [[], null],
      [null, []],
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
  
  'tests complex object equality': function() {
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
  
  'tests complex object inequality': function() {
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

Moksi.describe('Moksi.Object, concerning enumerable equality', {
  'tests if objects are equal': function() {
    [
      [[], []],
      [[1], [1]],
      [[{a:1}], [{a:1}]]
    ].each(function(pair) {
      expects(Moksi.Object.isEqualEnumerable(pair[0], pair[1])).truthy();
    });
  },
  
  'tests if objects are inequal': function() {
    var undef = (function() {})();
    [
      [null, null],
      [undef, undef],
      [[], undef],
      [undef, []],
      [[], null],
      [null, []],
      [[1],[2]],
      [[1],[]],
      [[],[1]],
      [[1,2],[1,2,3]],
      [[1,2,3],[1,2]],
      [[1,3,2],[1,2,3]],
      [[[1],[2],[3,4]],[[1],[2],[3]]],
      [['a'],['a','b']],
      [[0, 0],[0]]
    ].each(function(pair) {
      rejects(Moksi.Object.isEqualEnumerable(pair[0], pair[1])).truthy();
    });
  }
});
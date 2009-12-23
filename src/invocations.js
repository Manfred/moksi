if (typeof Moksi == 'undefined') Moksi = {};

Moksi.Invocations = {
  invoked: [],
  
  register: function() {
    this.invoked.push(arguments);
  },
  
  isEqualCall: function(one, other) {
    // Object, method, and arguments are equal
    if (Moksi.Object.isEqualEnumerable(one, other)) return true;
    // Object and method are equal, and the arguments are empty
    if (
      Moksi.Object.isEqual(one[0], other[0]) &&
      Moksi.Object.isEqual(one[1], other[1]) &&
      Moksi.Object.isEmpty(one[2]) &&
      Moksi.Object.isEmpty(other[2])
    ) return true;
    return false;
  },
  
  isCalled: function() {
    var i = this.invoked.length;
    if (!i) return false;
    while(i--) {
      if (Moksi.Invocations.isEqualCall(arguments, this.invoked[i])) return true;
    }
    return false;
  },
  
  callCount: function() {
    var i = this.invoked.length, count = 0;
    if (!i) return false;
    while(i--) {
      if (Moksi.Invocations.isEqualCall(arguments, this.invoked[i])) count += 1
    }
    return count;
  },
  
  reset: function() {
    this.invoked = [];
  }
};
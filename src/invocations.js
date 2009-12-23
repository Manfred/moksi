if (typeof Moksi == 'undefined') Moksi = {};

Moksi.Invocations = {
  invoked: [],
  
  register: function() {
    this.invoked.push(arguments);
  },
  
  isCalled: function() {
    var i = this.invoked.length;
    if (!i) return false;
    while(i--) {
      // Object, method, and arguments are equal
      if (Moksi.Object.isEqualEnumerable(arguments, this.invoked[i])) return true;
      // Object and method are equal, and the arguments are empty
      if (
        Moksi.Object.isEqual(arguments[0], this.invoked[i][0]) &&
        Moksi.Object.isEqual(arguments[1], this.invoked[i][1]) &&
        Moksi.Object.isEmpty(arguments[2]) &&
        Moksi.Object.isEmpty(this.invoked[i][2])
      ) return true;
    }
    return false;
  },
  
  reset: function() {
    this.invoked = [];
  }
};
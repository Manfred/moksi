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
      if (Moksi.Object.isEqualEnumerable(arguments, this.invoked[i])) return true;
    }
    return false;
  },
  
  reset: function() {
    this.invoked = [];
  }
};
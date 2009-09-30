Moksi.Object = {
  isEqual: function(one, other) {
    var type = typeof one;
    switch(type) {
      case 'object':
        return isEqualObject(one, other);
      default:
        return one == other;
    }
  },
  
  isEqualObject: function(one, other) {
    return one == other;
  }
};
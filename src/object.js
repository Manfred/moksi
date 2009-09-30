Moksi.Object = {
  isEqual: function(left, right) {
    if (typeof left.length == 'number' && typeof left != 'string') {
      return Moksi.Object.isEqualEnumerable(left, right);
    } else if (typeof left == 'object') {
      return Moksi.Object.isEqualObject(left, right);
    } else {
      return left == right;
    }
  },
  
  isEqualEnumerable: function(left, right) {
    if (left.length != right.length) return false;
    
    for(i=0; i < left.length; i++) {
      if (!this.isEqual(left[i], right[i])) return false;
    }
    
    return true;
  },
  
  isEqualObject: function(left, right) {
    return left == right;
  }
};
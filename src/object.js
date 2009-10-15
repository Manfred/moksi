Moksi.Object = {
  isEqual: function(left, right) {
    if (left && (typeof left == 'function')) {
      return left == right;
    } else if (left && (typeof left.length == 'number') && (typeof left != 'string')) {
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
    for (var key in left) {
      if (!this.isEqual(left[key], right[key])) return false;
    }
    for (var key in right) {
      if (!this.isEqual(left[key], right[key])) return false;
    }
    return true;
  }
};
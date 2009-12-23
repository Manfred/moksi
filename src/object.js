Moksi.Object = {
  isUndefined: function(object) {
    return typeof object === "undefined";
  },
  
  isEmpty: function(object) {
    if (Moksi.Object.isUndefined(object)) return true;
    if (object == null) return true;
    
    if (object.length > 0) {
      return false;
    } else {
      for (property in object) { if (object.hasOwnProperty(property)) {
        return false;
      } }
    }
    return true;
  },
  
  isEqual: function(left, right) {
    if (left == null && right == null) return true;
    
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
    if (Moksi.Object.isUndefined(left) || Moksi.Object.isUndefined(right)) return false;
    if (left == null || right == null) return false;
    
    if (left.length != right.length) return false;
    var i = left.length;
    while(i--) {
      if (!this.isEqual(left[i], right[i])) return false;
    }
    return true;
  },
  
  isEqualObject: function(left, right) {
    if (Moksi.Object.isUndefined(left) || Moksi.Object.isUndefined(right)) return false;
    if (left == null || right == null) return false;
    
    for (var key in left) {
      if (!this.isEqual(left[key], right[key])) return false;
    }
    for (var key in right) {
      if (!this.isEqual(left[key], right[key])) return false;
    }
    return true;
  }
};
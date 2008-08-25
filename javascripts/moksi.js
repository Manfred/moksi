var Moksi = {
  stubbed: [],
  originalMethodRegexp: /^__before_stub_(.*)$/,
  
  temporaryNameFor: function(functionName) {
    return "__before_stub_" + functionName;
  },
  
  stub: function(object, functionName, definition) {
    var temporaryName = this.temporaryNameFor(functionName);
    
    object[temporaryName] = object[functionName];
    object[functionName] = definition;
    
    if (this.stubbed.indexOf(object) == -1) {
      this.stubbed.push(object);
    }
  },
  
  unstub: function(object, functionName, temporaryName) {
    if (!temporaryName) temporaryName = this.temporaryNameFor(functionName);
    object[functionName] = object[temporaryName];
    delete object[temporaryName];
  },
  
  revert: function() {
    var object;
    while(object = this.stubbed.pop()) {
      var keys = Object.keys(object);
      for (i=0; i < keys.length; i++) {
        var name = keys[i];
        var match;
        if (match = name.match(this.originalMethodRegexp)) {
          object[match[1]] = object[name];
          delete object[name];
        }
      }
    }
  }
};
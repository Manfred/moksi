Moksi.Stubber = {
  stubbed: [],
  
  beforeStubPrefix: "__before_stub_",
  beforeStubRegexp: /^__before_stub_(.*)$/,
  
  stubbedName: function(name) {
    return this.beforeStubPrefix + name;
  },
  
  stub: function(object, name, definition) {
    var temporaryName = this.stubbedName(name);
    
    object[temporaryName] = object[name];
    object[name] = definition;
    
    if (this.stubbed.indexOf(object) == -1) {
      this.stubbed.push(object);
    }
  },
  
  unstub: function(object, name) {
    var temporaryName = this.stubbedName(name);
    object[name] = object[temporaryName];
    delete object[temporaryName];
  },
  
  unstubAll: function() {
    var object;
    while(object = this.stubbed.pop()) {
      for (var property in object) { if (object.hasOwnProperty(property)) {
        var match;
        if (match = property.match(this.beforeStubRegexp)) {
          this.unstub(object, match[1], property);
        }
      }}
    }
  }
};

Object.extend(Moksi, {
  stubber: Moksi.Stubber,
  
  stubs: function(object, name, definition) {
    this.stubber.stub(object, name, definition);
  },
  
  unstub: function(object, name) {
    this.stubber.unstub(object, name);
  },
  
  unstubAll: function() {
    this.stubber.unstubAll();
  }
});
var More = {
  name: function() {
    return 'More';
  }
};

Moksi.describe('More', {
  'should return its name': function() {
    document.body.innerHTML = '<strong>A description in a context successfully ran.</strong>';
  }
});
Moksi.describe('Moksi', {
  'should return its version': function() {
    this.expects(Moksi.VERSION).equals('0.1.0');
  },
  
  'should fail': function() {
    this.expects(Moksi.VERSION).equals('0');
    this.expects(Moksi.VERSION).equals('1');
    this.expects(Moksi.VERSION).equals('2');
    this.expects(Moksi.VERSION).equals('3');
  }
});
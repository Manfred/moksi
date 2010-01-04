var Ajax = {
  get: function(uri) { }
};

var Updater = Class.create({
  initialize: function(bookId) {
    this.bookId = bookId;
    setSample('<div id="title"></div>');
  },
  
  run: function() {
    var book = Ajax.get('http://example.com/books/'+this.bookId+'.json');
    var title = book.title;
    $('title').innerHTML = book.title;
  }
});

Moksi.describe('Updater', {
  setup: function() {
    this.suite.updater = new Updater(12);
  },
  
  'fetches book information from the correct URL': function() {
    expects(Ajax).receives('get', {
      withArguments: ['http://example.com/books/12.json'],
      returns: { title: 'The Haunter of the Dark' }
    });
    this.suite.updater.run();
  }
});
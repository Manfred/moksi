Moksi.describe('Moksi.Helpers.Sample, concerning setting multiple samples', {
  setup: function() {
    addSample('<span id="fromSetup">fromSetup</span>');
  },
  
  'addSample sets an HTML sample from the setup': function() {
    expects($('fromSetup').innerHTML).equals('fromSetup');
  },
  
  'addSample sets an HTML sample in a test': function() {
    addSample('<span id="fromTest">fromTest</span>');
    expects($('fromTest').innerHTML).equals('fromTest');
  },
  
  'clearSamples clears all current samples': function() {
    clearSamples();
    expects($('fromSetup')).equals(null);
    expects($('fromTest')).equals(null);
  }
});

Moksi.describe('Moksi.Helpers.Sample, concerning just one sample', {
  setup: function() {
    setSample('<div class="bunny">Bunny</div>');
  },
  
  'setSample sets the sample before every test': function() {
    var bunnies = $$('.bunny');
    expects(bunnies.length).equals(1);
  },
  
  'setSample sets the sample before every test (2)': function() {
    var bunnies = $$('.bunny');
    expects(bunnies.length).equals(1);
  }
});
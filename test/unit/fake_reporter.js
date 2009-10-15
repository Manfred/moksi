Fake = {};
Fake.Reporter = {
  plan: function(description, count) {
    Fake.Reporter.description = description;
    Fake.Reporter.count       = count;
    Fake.Reporter.results     = [];
  },
  
  report: function(result, report) {
    Fake.Reporter.results.push([result, report]);
    return [];
  }
};
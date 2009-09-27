// Moksi.Expectations.Collection = {
//   results: [],
//   
//   capture: function(result, message) {
//     Moksi.Expectations.Collection.results.push({result: result, message: message});
//   },
//   
//   flush: function() {
//     var results = Moksi.Expectations.Collection.results;
//     Moksi.Expectations.Collection.results = [];
//     return results;
//   },
//   
//   report: function() {
//     var expectations = Moksi.Expectations.Collection.flush();
//     var report = {result: 'ok', contents: [], expectationCount: 0};
//     
//     expectations.each(function(expectation) {
//       report.expectationCount += 1;
//       if (expectation.result == 'not ok') {
//         report.result = 'not ok';
//         report.contents.push(expectation.message);
//       }
//     });
//     
//     return report;
//   }
// };

Moksi.describe('Moksi.Expectations.Collection', {
  'captures expectation results': function() {    
  },
  
  'flushes expectations results': function() {
  },
  
  'flushes expectation results and returns a report based on them': function() {
  }
});
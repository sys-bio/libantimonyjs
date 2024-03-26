// For use in nodejs environment.
// Test antimony_wrap javascript  

const libantimony = require( './libantimony.js'); // libantimony.js in local dir
var antimonyWrapper = require( './antimony_wrap.js');  // in local dir

console.log('Starting Test antimony_wrap script...');

var ant_wrap;

runAntimonyWrapCheck();

/**
 * Loads libantimony module and then executes myCallback function.
 * @param {function} myCallback: function that runs tests 
 */
function loadAntimonyLib(myCallback) {
  try {
    libantimony().then((libantimony) => {
      ant_wrap = new antimonyWrapper(libantimony);
      console.log('libantimony loaded');
      myCallback();
    });
   }
  catch(err) {
    console.log('Load libantimony Error: ', err);
   }

}

/**
 * Test basic functionality of Antimony wrapper
 * @returns returns 1 if no errors
 */ 
function runAntimonyWrapCheck() {
  loadAntimonyLib(runTests);
}

function runTests() {
  var pass = 0; //Keep track of number of tests that pass
  var fail = 0;
  var antString = "model example1; S1 -> S2; k1*S ; S1 = 550; S2 = 0;  k1 = 0.1; end"
  var antCode;
  var sbmlCode;
  var sbmlResult = 'None';
  var antResult = 'None'; 
  var result;
  // ****************************************************
  var testCase = "Test 1: convertAntimonyToSBML(ant model)";
  result = ant_wrap.convertAntimonyToSBML(antString);
  if(result.isSuccess()) {
    sbmlCode = result.getResult()
    if(sbmlCode.includes('species id="S1" compartment="default_compartment" initialConcentration="550"')) {
      console.log('Pass:', testCase);
      pass++;
    }
    else {
      fail++;
      console.log('FAIL:', testCase);
    }
  }
  else {
    fail++;
    console.log('FAIL:', testCase);
  }
  // *******************************************************
  var testCase = "Test 2: convertSBMLToAntimony(SBML model)";
  result = ant_wrap.convertSBMLToAntimony(sbmlCode);
  if(result.isSuccess()) {
    antCode = result.getResult()
    if(antCode.includes('_J0: S1 -> S2; k1*S;')) {
      console.log('Pass:', testCase);
      pass++;
    }
    else {
      fail++;
      console.log('FAIL:', testCase);
    }
  }
  else {
    fail++;
    console.log('FAIL:', testCase);
  }

  // ******************************************************
  var testCase = "Test 3: convertAntimonyToSBML(ant model) error";
  antString = "model example1; S1 -> S2; k1S ; S1  550; S2 = 0;  k1 = 0.1; end"
  result = ant_wrap.convertAntimonyToSBML(antString);
  sbmlCode = result.getResult()
  //console.log(sbmlCode);
  if(result.isSuccess()) {
    console.log('FAIL:', testCase);
    fail++;   
  }
  else {
    if(sbmlCode.includes('Error in model string, line 1:  syntax error, unexpected number')) {
      console.log('Pass:', testCase);
      pass++;
      
    }
    else {
      console.log('FAIL:', testCase);
      fail++; 
    }
  }

   // ******************************************************
   var testCase = "Test 4: convertAntimonyToSBML(ant model) warning";
   antString = "model example1; S1 -> S2; k1S ; S1 = 550; S2 = 0;  k1 = 0.1; end"
   result = ant_wrap.convertAntimonyToSBML(antString);
   var warning = result.getWarnings();
   sbmlCode = result.getResult()
   var warning = result.getWarnings();
  // console.log(warning);
   if(result.isSuccess()) {
    if(warning.includes(" with the id 'k1S' does not have 'value' attribute")) {
      console.log('Pass:', testCase);
      pass++;
        
   }
   else {
    console.log('FAIL:', testCase);
    fail++;
       
     }
   }
  console.log('Pass-', pass,', Fail-', fail);
  if (fail == 0){ 
    return 1;
  } else { return 0;} // fail
}


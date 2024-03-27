
# Using libantimonyjs in your project.
Note: The examples described below work with version v2.14b and later. If using an earlier version then you must remember to add libantimony.wasm to your project as the libantimony.js and libantimony.wasm were not combined into one file. 

## In a webpage
- For use in a webpage just copy the contents (3 files) of the `../release/v#####` into a suitable subdirectory in your website.
- In the webpage where you want to load the libantimony library just insert the following lines into the page so that your code can find the library:
  
  ```
  <script src="/your_location/libantimony.js" type="text/javascript"></script>
  <script src="/your_location/antimony_wrap.js" type="text/javascript"></script>
  ```
  
- Next write the javascript code to load the library:
  ```
  <script type="text/javascript">
  // Load library (asynchronous call):
  var antimonyLibrary; // Holds libantimony
  try {
   libantimony().then((libantimony) => {
    antimonyLibrary = new AntimonyWrapper(libantimony); // instantiates The AntimonyWrapper class with the libantimony library.
   });
  }
  catch(err) {
    console.log("Load libantimony error: ", err);
  }
  </script>
  ```
- Now you can call the Antimony instance to translate Antimony string to SBML string or translate an SBML string to Antimony string.
- Example page can be found in `../docs/demo/index.html`   
  
## Using node.js 
- To use in a node.js project just copy the contents (3 files) of the `../release/v#####` into a suitable subdirectory in your project.
- Next insert the following javascript code into an appropriate place:
- ```
  const libantimony = require( './your_location/libantimony.js'); 
  var antimonyWrapper = require( './your_location/antimony_wrap.js'); 
  ```
- Load the libantimony library the same way as in a webpage:
- ```
    // Load library (asynchronous call):
  var antimonyLibrary; // Holds libantimony
  try {
   libantimony().then((libantimony) => {
    antimonyLibrary = new AntimonyWrapper(libantimony); // instantiates The AntimonyWrapper class with the libantimony library.
   });
  }
  catch(err) {
    console.log("Load libantimony error: ", err);
  }
  ```
- Now you can call the Antimony instance to translate Antimony string to SBML string or translate an SBML string to Antimony string.
- An example is ```../test/test_wrap_antimony.js```
  
## The basic APIs:
Below are the two basic methods of the AntimonyWrapper class used to get the translations:
- Convert Antimony to SBML:
   ```
  var conversionResult =  antimonyLibrary.convertAntimonyToSBML( antimonyString ) ;
  if(conversionResult.isSuccess()) {
    sbmlResult = conversionResult.getResult(); }
  ```
  or convert SBML to Antimony:
  ```
  conversionResult = antimonyLibrary.convertSBMLToAntimony( sbmlString );
  if(conversionResult.isSuccess()) {
    sbmlResult = conversionResult.getResult(); }
  ```  
- Both of these methods return a Result object which has three methods:
1. `conversionResult.getResult()`: returns the translated string or the error message if isSuccess() is false.
2. `conversionResult.isSuccess()`: returns true if successfully translated model, false if error(s).
3. `conversionRresult.getWarnings()` : returns any warnings generated from the translation (Note: isSuccess() will often return true if there are only warnings.)


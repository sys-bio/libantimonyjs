
# Using libantimonyjs in your project.

## In a webpage
- For use in a webpage just copy the contents of the ../release/v##### into a suitable directory in your website.
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
    antimonyLibrary = new AntimonyWrapper(libantimony); // instantiates The AntimonyWrapper class 
   });
  }
  catch(err) {
    console.log("Load libantimony error: ", err);
  }
  </script>
  ```
- Now you can call the Antimony instance to translate Antimony string to SBML string or translate an SBML string to Antimony string:
  ```
  var result =  antimonyLibrary.convertAntimonyToSBML( antimonyString ) ;
  if(result.isSuccess()) {
    sbmlResult = result.getResult(); }
  ```
  or:
  ```
  result = antimonyLibrary.convertSBMLToAntimony( sbmlString );
  if(result.isSuccess()) {
    sbmlResult = result.getResult(); }
  ```  
- Both of these methods returns a Result object which has three methods:
- `result.getResult()`: Returns the translated string or the error message if isSuccess() is false.
- `result.isSuccess()`: 
- `result.getWarnings()` : returns any warnings generated from the translation (Note: isSuccess will often return true if there are warnings.)
- dsf
## In node.js 

## The basic APIs:
- 


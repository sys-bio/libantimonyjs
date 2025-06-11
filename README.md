
# libantimonyjs

This repository hosts the build instructions and scripts for the JavaScript wrapper for the C++ library <strong>Antimony</strong> (https://github.com/sys-bio/antimony). Antimony is a modular model definition language used in Systems Biology for modeling chemical networks. This library allows the user to easily convert Antimony models to SBML models [SBML site](https://sbml.org) and vice-versa.   
- View library in action: https://sys-bio.github.io/makesbml/
- Very simple webpage example: https://sys-bio.github.io/libantimonyjs/demo/

## Project structure
- `docs` directory: Demo page and information for incorporating libantimonyjs in a javascript project.
- `test` directory: Test models and test web page
- `scripts` directory: Contains libantimonyjs wrapper for simple translating of Antimony and SBML models.
- `third-party` directory:  Contains submodules for the particular versions of Antimony and its dependencies being used.
-- `build` subdirectory: script for manually building libantimonyjs, normally it is built through GitHub actions.
- `.github/workflows` directory: Actions for building libantimony.js on GitHub

## Using libantimonyjs
- See  https://sys-bio.github.io/libantimonyjs ( `../docs/readme.md` ) for information about using libantimonyjs in your webpage or node.js project.

## Building libantimonyjs
It is currently possible to build libantimonyjs on Linux, MacOS and MS Windows Subsystem for Linux (WSL). Briefly, Emscripten (https://emscripten.org/) is used to compile all C/C++ source code into a .wasm (https://webassembly.org/) file and generate javascript wrappers around each Antimony API call.

The software requirements:
1. CMake (https://cmake.org/).
2. Source code from third-party/ submodules

Refer to [Build libantimonyjs on GitHub](https://github.com/sys-bio/libantimonyjs#build-libantimonyjs-on-github-using-workflow-actions) for building libantimony with GitHub Actions.  

### Build setup
1. From a terminal (BASH) window set the environment variable `LIBANTIMONYJS_DIR` to the root directory of the build 
   - (ex: `export LIBANTIMONYJS_DIR=~/build_antjs/libantimonyjs`). 
2. Next `mkdir $LIBANTIMONYJS_DIR/install`, this will be where all of the final files will be located.
3. Set up EMSDK environment
   - Ex: ``` source "/home/user/emsdk_install_dir/emsdk_env.sh" ```
   - Check by typing `emcc -v` in your home directory.
   
### Build steps
- Either use script 'buildLibAntjs' in ../scripts/ or follow the instructions below to build libantimony.js and libantimony.wasm.

1. Build expat library:
   - In the third-party/libexpat/expat directory `mkdir build` and `cd` into this directory.
   - Compile libexpat using emscripten tool emcmake:
     `emcmake cmake .. -DCMAKE_INSTALL_PREFIX=$LIBANTIMONYJS_DIR/install/expat`
   - Next: `emmake make`
   - Finally: `emmake make install`, libexapt.a should be in the `$LIBANTIMONYJS_DIR/install/expat/lib` directory 
2. Build SBML library:
   - In the third-party/libsbml directory `mkdir build` and `cd` into this directory.
   - Compile libsbml using emscripten tool emcmake:
     `emcmake cmake .. -DCMAKE_INSTALL_PREFIX=$LIBANTIMONYJS_DIR/install/sbml -DCMAKE_BUILD_TYPE=Release -DWITH_CPP_NAMESPACE=ON -DWITH_EXPAT=ON -DWITH_LIBXML=OFF -DLIBSBML_SKIP_SHARED_LIBRARY=ON -DENABLE_ARRAYS=ON -DENABLE_COMP=ON -DENABLE_DISTRIB=ON -DENABLE_FBC=ON -DENABLE_GROUPS=ON -DENABLE_MULTI=ON -DENABLE_QUAL=ON -DWITH_STABLE_PACKAGES=ON -DWITH_SWIG=OFF -DEXPAT_INCLUDE_DIR=$LIBANTIMONYJS_DIR/install/expat/include -DEXPAT_LIBRARY=$LIBANTIMONYJS_DIR/install/expat/lib/libexpat.a`
   - Next `emmake make`
   - Finally: `emmake make install`, libsbml-static.a should be in the `$LIBANTIMONYJS_DIR/install/sbml/lib` directory 
3. Build Antimony library:
   - In the third-party/antimony directory `mkdir build` and `cd` into this directory.
   - Compile libantimony using emscripten tool emcmake:
     `emcmake cmake .. -DCMAKE_INSTALL_PREFIX=$LIBANTIMONYJS_DIR/install/antimony -DEXPAT_LIBRARY=$LIBANTIMONYJS_DIR/install/expat/lib/libexpat.a -DCMAKE_BUILD_TYPE=Release -DLIBSBML_INCLUDE_DIR=$LIBANTIMONYJS_DIR/install/sbml/include -DLIBSBML_INSTALL_DIR=$LIBANTIMONYJS_DIR/install/sbml -DLIBSBML_LIBRARY=$LIBANTIMONYJS_DIR/install/sbml/lib/libsbml-static.a -DWITH_CELLML=OFF -DWITH_CHECK=OFF -DWITH_COMP_SBML=ON -DWITH_LIBSBML_COMPRESSION=OFF -DWITH_LIBSBML_EXPAT=ON -DWITH_LIBSBML_LIBXML=OFF -DWITH_LIBSBML_XERCES=OFF -DWITH_PYTHON=OFF -DWITH_QTANTIMONY=OFF -DWITH_SBML=ON -DWITH_STATIC_SBML=ON -DWITH_SWIG=OFF`
   - Next 'emmake make'
   - Finally `emmake make install`, libantimony.a should be in the `$LIBANTIMONYJS_DIR/install/antimony/lib` directory
4. Generate javascript wrapper for antimony library:
   - Once all of the static libraries are built using Emscripten (libexpat.a, libantimony.a, libsbml.a) the javascript wrapper and associated wasm file are generated:
   - From the `$LIBANTIMONYJS_DIR\install` directory, generate the wrapper files:
     `emcc -Oz -sDISABLE_EXCEPTION_CATCHING=0 -sMODULARIZE=1 -sSINGLE_FILE=1 -sEXPORT_NAME=libantimony -sALLOW_MEMORY_GROWTH=1 -I$LIBANTIMONYJS_DIR/install/antimony/include -I$LIBANTIMONYJS_DIR/install/sbml/include -I$LIBANTIMONYJS_DIR/install/expat/include $LIBANTIMONYJS_DIR/install/antimony/lib/libantimony.a $LIBANTIMONYJS_DIR/install/sbml/lib/libsbml-static.a $LIBANTIMONYJS_DIR/install/expat/lib/libexpat.a -o libantimony.js -sEXPORTED_FUNCTIONS=_loadString,_loadAntimonyString,_loadSBMLString,_clearPreviousLoads,_getAntimonyString,_getSBMLString,_getCompSBMLString,_getLastError,_getWarnings,_getSBMLInfoMessages,_getSBMLWarnings,_freeAll,_malloc,_free -sEXPORTED_RUNTIME_METHODS=ccall,cwrap,allocateUTF8,UTF8ToString`
   - The `sEXPORTED_FUNCTIONS=` lists all of the Antimony function calls with javascript wrappers.  
     
## Add/subtract wrapped Antimony API calls.
It is straightforward to add wrappers for Antimony functions currently not included (Only ~10% of the functions currently have javascript wrappers). Refer to `../antimony/src/antimony_api.h` for available function calls.

## Build Libantimonyjs on GitHub using workflow actions.
Workflow is currently initiated manually.
- Go to Actions page of repository and pick 'build-libantimonyjs-github-actions' on leftside of page.
- Click the 'Run workflow' drop-down button.
- Enter the Antimony and LibSBML version you wish to use for the build.
- Click the 'Run workflow' button and the build should start.

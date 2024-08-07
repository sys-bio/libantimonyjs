
# libantimonyjs

This repository hosts the build instructions and scripts for the JavaScript wrapper for the C++ library <strong>Antimony</strong> (https://github.com/sys-bio/antimony). Antimony is a modular model definition language used in Systems Biology for modeling chemical networks. This library allows the user to easily convert Antimony models to SBML models [SBML site](https://sbml.org) and vice-versa.   
- View library in action: https://sys-bio.github.io/makesbml/
- Very simple webpage example: https://sys-bio.github.io/libantimonyjs/demo/

## Project structure
- `docs` directory: Demo page and information for incorporating libantimonyjs in a javascript project.
- `test` directory: Test models and test web page
- `scripts` directory: Contains libantimonyjs wrapper for simple translating of Antimony and SBML models.
-- `build` subdirectory: script for manually building libantimonyjs, normally it is built through GitHub actions.
- `release` directory: Released javascript wrapper and associated wasm files (libantimony.js and libantimony.wasm) built from instructions below.
- `.github/workflows` directory: Actions for building libantimony.js on GitHub

## Using libantimonyjs
- See  https://sys-bio.github.io/libantimonyjs ( `../docs/readme.md` ) for information about using libantimonyjs in your webpage or node.js project.

## Building libantimonyjs
It is currently possible to build libantimonyjs on Linux, MacOS and MS Windows Subsystem for Linux (WSL). Briefly, Emscripten (https://emscripten.org/) is used to compile all C/C++ source code into a .wasm (https://webassembly.org/) file and generate javascript wrappers around each Antimony API call.

The software requirements:
1. CMake (https://cmake.org/).
2. Expat source code (2.2.6 or greater) (https://libexpat.github.io/).
3. LibSBML source code:
   * a. LibSBML source code version 5.19.0 (https://sourceforge.net/projects/sbml/files/libsbml/). 
   * b. LibSBML source code version 5.20.0 (https://github.com/sbmlteam/libsbml) .
5. Antimony source code (2.13.3 or greater)(https://github.com/sys-bio/antimony).
6. Emscripten (3.1.20) (https://emscripten.org/docs/getting_started/downloads.html). Do not install latest version, use 3.1.20.
   - After installing Emscripten, remember to set up the EMSDK environment: 
   - Ex: ``` source "/home/user/emsdk_install_dir/emsdk_env.sh" ```
   - Check by typing `emcc -v` in your home directory.
   
Refer to [Build libantimonyjs on GitHub](https://github.com/sys-bio/libantimonyjs#build-libantimonyjs-on-github-using-workflow-actions) for building libantimony with GitHub Actions.  

### Build steps
After installing this project locally, from a terminal (BASH) window set the environment variable `LIBANTIMONYJS_DIR` to the root directory of the build (ex: `export LIBANTIMONYJS_DIR=~/build_antjs/libantimonyjs`). Next `mkdir $LIBANTIMONYJS_DIR/install`, this will be where all of the final files will be located.

- Either use script 'buildLibAntjs' in ../scripts/ or follow the instructions below to build libantimony.js and libantimony.wasm.

1. Build expat library:
   - Install libexpat src code into directory `$LIBANTIMONYJS_DIR` and rename it `expat`
   - In the expat directory `mkdir build` and `cd` into this directory.
   - Compile libexpat using emscripten tool emcmake:
     `emcmake cmake .. -DCMAKE_INSTALL_PREFIX=$LIBANTIMONYJS_DIR/install/expat`
   - Next: `emmake make`
   - Finally: `emmake make install`, libexapt.a should be in the `$LIBANTIMONYJS_DIR/install/expat/lib` directory 
2. Build SBML library:
   - Install libsbml src code into directory `$LIBANTIMONYJS_DIR` and rename it `libsbml`
     Ex: `mv libsbml-development sbml`
   - In the sbml directory `mkdir build` and `cd` into this directory.
   - Compile libsbml using emscripten tool emcmake:
     `emcmake cmake .. -DCMAKE_INSTALL_PREFIX=$LIBANTIMONYJS_DIR/install/sbml -DCMAKE_BUILD_TYPE=Release -DWITH_CPP_NAMESPACE=ON -DWITH_EXPAT=ON -DWITH_LIBXML=OFF -DLIBSBML_SKIP_SHARED_LIBRARY=ON -DENABLE_ARRAYS=ON -DENABLE_COMP=ON -DENABLE_DISTRIB=ON -DENABLE_FBC=ON -DENABLE_GROUPS=ON -DENABLE_MULTI=ON -DENABLE_QUAL=ON -DWITH_STABLE_PACKAGES=ON -DWITH_SWIG=OFF -DEXPAT_INCLUDE_DIR=$LIBANTIMONYJS_DIR/install/expat/include -DEXPAT_LIBRARY=$LIBANTIMONYJS_DIR/install/expat/lib/libexpat.a`
   - Next `emmake make`
   - Finally: `emmake make install`, libsbml-static.a should be in the `$LIBANTIMONYJS_DIR/install/sbml/lib` directory 
3. Build Antimony library:
   - Install antimony src code into directory `LIBANTIMONYJS_DIR` and rename it `antimony`
   - In the antimony directory `mkdir build` and `cd` into this directory.
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


# libantimonyjs

This repository hosts the build instructions and scripts for the JavaScript wrapper for the C++ library <strong>Antimony</strong> (https://github.com/sys-bio/antimony). Antimony is a modular model definition language used in Systems Biology for modeling chemical networks. This library allows the user to easily convert Antimony models to SBML models [SBML site](https://sbml.org) and vice-versa. 

## Project structure
- `docs` directory: Demo page and information for incorporating libantimonyjs in a javascript project.
- `test` directory: Test models and test web page
- `release` directory: Released javascript wrapper and associated wasm files (libantimony.js and libantimony.wasm) built from instructions below.

## Building libantimonyjs
It is currently possible to build libantimonyjs on Linux, MacOS and MS Windows Subsystem for Linux (WSL). Briefly, Emscripten (https://emscripten.org/) is used to compile all C/C++ source code into a .wasm (https://webassembly.org/) file and generate javascript wrappers around each Antimony API call.

The software requirements:
1. CMake (https://cmake.org/).
2. Expat source code (2.2.6 or greater) (https://libexpat.github.io/).
3. LibSBML source code (development branch) (https://github.com/sbmlteam/libsbml). Using Version 5.19.0 produces compiler errors with deprecated Standard Library ptr_fun().
4. Antimony source code (2.13.3 or greater)(https://github.com/sys-bio/antimony).
5. Emscripten (1.38.48 or greater) (https://emscripten.org/docs/getting_started/downloads.html).
   - After installing Emscripten, remember to set up the EMSDK environment: 
   - Ex: ``` source "/home/user/emsdk_install_dir/emsdk_env.sh" ```
   - Check by typing `emcc -v` in your home directory.


### Build steps
After installing this project locally, from a terminal (BASH) window set the environment variable `LIBANTIMONYJS_DIR` to the root directory of the build (ex: `export LIBANTIMONYJS_DIR=~/build_antjs/libantimonyjs`). Next `mkdir $LIBANTIMONYJS_DIR/install`, this will be where all of the final files will be located.

1. Build expat library:
   - Install libexpat into directory `$LIBANTIMONYJS_DIR` and rename it `expat`
   - In the expat directory `mkdir build` and `cd` into this directory.
   - Compile libexpat using emscripten tool emcmake:
     `emcmake cmake .. -DCMAKE_INSTALL_PREFIX=$LIBANTIMONYJS_DIR/install/expat`
   - Next: `emmake make`
   - Finally: `emmake make install`, libexapt.a should be in the `$LIBANTIMONYJS_DIR/install/expat/lib` directory 
2. Build SBML library:
   - Install libsbml into directory `$LIBANTIMONYJS_DIR` and rename it `sbml`
   - In the sbml directory `mkdir build` and `cd` into this directory.
   - Compile libsbml using emscripten tool emcmake:
     `emcmake cmake .. -DCMAKE_INSTALL_PREFIX=$LIBANTIMONYJS_DIR/install/sbml -DCMAKE_BUILD_TYPE=Release -DWITH_CPP_NAMESPACE=ON -DWITH_EXPAT=ON -DWITH_LIBXML=OFF -DENABLE_ARRAYS=ON -DENABLE_COMP=ON -DENABLE_DISTRIB=ON -DENABLE_FBC=ON -DENABLE_GROUPS=ON  -DENABLE_MULTI=ON -DENABLE_QUAL=ON  -DWITH_STABLE_PACKAGES=ON  -DWITH_SWIG=OFF -DEXPAT_INCLUDE_DIR=$LIBANTIMONYJS_DIR/install/expat/include -DEXPAT_LIBRARY=$LIBANTIMONYJS_DIR/install/expat/lib/libexpat.a`
   - Next `emmake make`
   - Finally: `emmake make install`, libsbml.a should be in the `$LIBANTIMONYJS_DIR/install/sbml/lib` directory 
3. Build Antimony library:
5. Generate javascript wrapper for antimony library:


# libantimonyjs

This repository hosts the build instructions and scripts for the JavaScript wrapper for the C++ library <strong>Antimony</strong> (https://github.com/sys-bio/antimony). Antimony is a human-readable, human-writable modular model definition language used in Systems Biology for modeling chemical networks. This library allows the user to easily convert Antimony models to SBML models [SBML site](https://sbml.org) and vice-versa. 

## Project structure
- `docs` directory: Demo page and information for incorporating libantimonyjs in a javascript project.
- `test` directory: Test models and test web page
- `release` directory: Released javascript wrapper and associated wasm files (libantimony.js and libantimony.wasm) built from instructions below.

## Building libantimonyjs
It is currently possible to build libantimonyjs on Linux, MacOS and MS Windows Subsystem for Linux (WSL). Briefly, Emscripten (https://emscripten.org/) is used to compile all C/C++ source code into a .wasm (https://webassembly.org/) file and generate javascript wrappers around each Antimony API call.

The software requirements:
1. CMake
2. Expat source code.
3. LibSBML source code.
4. Antimony source code.
5. Emscripten


# Shalldn project

The goal of the project is to create specifications of a formal language for creating requirements and set of tools for working with projects using the language. The language is named Shalldn in reference to pivotal keyword "shall" and Markdown ancestry of the language.

The project is work in progress. The formal specifications of Shalldn are being defined through requirements for its parser. Requirements for parser and other tools are written in Shalldn itself and are located in top level directory of project in files with name extension .shalldn.

The tools are implemented as a language server extension for [VisualStudio Code](https://code.visualstudio.com/) editor. The source code of the extension is in directory shalldn-ls.

The current state of the project is best reviewed by examining this repository as a workspace in [VisualStudio Code](https://code.visualstudio.com/) with the Shalldn language server extension installed. This will allow to highlight specifications in .shalldn files that have not been implemented yet and navigate to implementation of specifications that presently do have one.
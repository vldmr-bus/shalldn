# Shalldn language server

Shalldn is a formal language for creating requirements. The Shalldn language server extension provides functionalities to create and manage projects based on requirements written in Shalldn.

The extension is part of the [Shalldn project](http://shalldn.net), which also includes specifications for the Shalldn language. Both the extension and language specifications are work in progress.

## Short introduction to Shalldn language

The Shalldn language is defined by collection of restrictions on the natural **English** language and as such is a subset of the natural English language. Additionally, Shalldn uses punctuation rules based on Markdown to attach a special meanings to parts of the text.

In order for tools to recognize a Markdown text as a Shalldn document the file has to have name extension shalldn.

The formal requirement in Shalldn is a one-sentence statement with the subject of the requirements document followed by bolded word **shall**. Bolded in Markdown means surrounded with double asterisks: ```**shall**```. It is an error to have multiple bolded **shall**'s in a single sentence, or have **shall** after text that is not the subject of the document.

The subject of the document is a single *italicized* group of words in the first line of the document. Italicizing is marked by surrounding words with single asterisks: ```*subject*```. The first line is usually a title with a heading markup: starting a line with sharp '#'. It is an error to have a .shalldn document without valid subject definition.

Each requirement must have a unique identifier, that may contain alpha-numeric characters and dots. the identifier must immediately precede the requirement sentence and be bolded. It is an error to have a requirement sentence without identifier or with non-unique identifier.

The requirement identifiers are used to link requirements on different levels of design be that lower level requirements, implementing code or test cases. In Shalldn documents linkage is established with *implementation clause*: a bulleted line after a requirement starting with the word 'Implements' followed by one or more bolded requirement identifiers, separated by commas. Bulleting is marked by starting the line with an asterisk. In any other file the clause is usually put in a comment starting with keyword '$$Implements' followed by comma-separated list of requirement identifiers.

With the above description in mind, here is a complete valid Shalldn document:

|Source|Rendered Markdown|
|------|------|
|<code># An example *document*<br><br>`**Example.CNTNT**`  <br>An example document `**shall**` contain at least one instance of text illustrating the example.<br>* Implements `**COMMON_SENSE**`</code>|<H2>An example *document*</H2><br>**Example.CNTNT**  <br>An example document **shall** contain at least one instance of text illustrating the example.<br><ul><li> Implements **COMMON_SENSE**|

## Extension functionality

The language server currently provides the following features:

### Navigation 
The extension provides navigation through requirement IDs. Control-click on id to open defining requirement or jump upper level (justification) or lower level (implementation) requirements,  to implementation or test for that requirement. 

![navigation demo](media/nav.gif)

### Problem highlights
The extension highlights Shalldn problems with squiggly lines in text and lists them in "Problems" window, similar to compile errors for programming languages.

For .shalldn files problems include language syntax violations and project-wide problems, such as missing implementation for a requirement. For all other types of files in the project problems are limited to invalid *implementation clause*s such as including an identifier for non-existent requirement.

![problems demo](media/problems.gif)

### Editing completion
The extension provides typing completions for keywords and requirement IDs both in .shalldn requirements files and other language files.

![completions demo](media/completions.gif)

### Refactoring
The extension assist in renaming requirement IDs in definitions and all references.

![refactor demo](media/refactor.gif)

### Tagging
The extension support tagging individual requirements for various tracking purposes, such as status or change requests. Navigator window allows quick overview of tageed requirements.

![tags demo](media/tags.gif)

### Coverage report

Press F1 key and start typing "Shalldn" into command input, then select "Create coverage report" command. Below is an example report created from the Shalldn project requirements. Note that the report is interactive and allows drilling down the namespace by clicking on expanding triangle.
<div style="max-height:20em; overflow-y:auto;border:1px solid black;padding:1em">
<style>ul {list-style-type:none;}</style>
		<h1>Requirements coverage report</h1>
		<h3>Workspace: shalldn (main)</h3>
		<h6>Created on 6/1/2024, 1:47:46 PM</h6>
	<details><summary><b>Analyzer</b>: 100% implemented (20/20, 1.4 average per requirement)  45% tested (9/20, 1.8 average per requirement)</summary><ul><li><b>Analyzer.ERR</b>: 100% implemented (4/4, 1.5 average per requirement)  75% tested (3/4, 1.3 average per requirement)<br></li><li><b>Analyzer.TEST</b>: 100% implemented (4/4, 1.3 average per requirement)  100% tested (4/4, 2.3 average per requirement)<br></li></ul></details><details><summary><b>Editor</b>: 91.7% implemented (22/24, 1.4 average per requirement)  58.3% tested (14/24, 1.5 average per requirement)</summary><ul><li><b>Editor.CMPL</b>: 100% implemented (8/8, 1.3 average per requirement)  100% tested (8/8, 1.3 average per requirement)<br></li><li><b>Editor.ERR</b>: 100% implemented (3/3, 1.7 average per requirement)  33.3% tested (1/3, 1 average per requirement)<br></li><li><b>Editor.INFO</b>: 100% implemented (2/2, 1 average per requirement)  100% tested (2/2, 3 average per requirement)<br></li><li><b>Editor.NAV</b>: 100% implemented (4/4, 1.3 average per requirement)  0% tested (0/4)<br></li></ul></details><details><summary><b>Parser</b>: 100% implemented (24/24, 1 average per requirement)  37.5% tested (9/24, 1.4 average per requirement)</summary><ul><li><b>Parser.ERR</b>: 100% implemented (9/9, 1 average per requirement)  22.2% tested (2/9, 2.5 average per requirement)<br></li><li><b>Parser.IMPLMNT</b>: 100% implemented (3/3, 1 average per requirement)  66.7% tested (2/3, 1 average per requirement)<br></li></ul></details><b>Unscoped requirements</b>: 100% implemented (3/3, 1 average per requirement)  0% tested (0/3)<br>
</div>

## Complete example
In order to test all available features of the extension you can download the [source code of Shalldn project from GitHub](https://github.com/vldmr-bus/shalldn), which contains a set of Shalldn specification traceable to source code of the extension.

## List of commands available through command palette

Press F1 key to open command palette. Start typing word shalldn to filter available commands.

### Create coverage report

Generate HTML file with coverage report for current project (see [example](#coverage-report)).

### Export project as HTML files collection

Generate collection of static HTML files with rendered markdown and cross referencing of requirements, suitable for sharing the project without needing to have VS code with the extension installed.

### Toggle showing errors as warnings

Allows to demote shalldn errors to warning as having errors might interfere with launching the project for debugging in some languages.

## Toggle warnings for requirements without tests in this file

Normally requirements without tests are not highlighted. This command allows discovering such requirements in active file.

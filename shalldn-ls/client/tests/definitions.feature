Feature: Definitions

	Scenario: Parser.DEF_SECT lookup
	# happy path
	Given the test file named "test-definitions.shalldn" is opened
	When list of definitions is obtained for the word "term" in following text:
	"""
	But it can have reference to *term 1* definition.
	"""
	Then the list shall contains definition in file "test-definitions.shalldn" with text:
	"""
	The first term in definitions section.
	"""

	Scenario: Parser.DEF_SECT second section
	# Term is defined in second definitions section and is the last in the file
	Given the test file named "test-definitions.shalldn" is opened
	When list of definitions is obtained for the word "term" in following text:
	"""
	We can reference *term 3* which is defined later.
	"""
	Then the list shall contains definition in file "test-definitions.shalldn" with text:
	"""
	The third term in second definitions section.
	"""

	Scenario: Parsers.INLN_DEF_DRCT
	Given the test file named "test-definitions.shalldn" is opened
	When list of definitions is obtained for the word "DID" in following text:
	"""
	Here is reference to *DID*.
	"""
	Then the list shall contains definition in file "test-definitions.shalldn" with text:
	"""
	Direct Inline Definition
	"""

	Scenario: Parsers.INLN_DEF_REV
	Given the test file named "test-definitions.shalldn" is opened
	When list of definitions is obtained for the word "RID" in following text:
	"""
	Here is reference to *RID*.
	"""
	Then the list shall contains definition in file "test-definitions.shalldn" with text:
	"""
	Reverse Inline Definition
	"""

	Scenario: Parsers.INLN_DEF_IMP
	Given the test file named "test-definitions.shalldn" is opened
	When list of definitions is obtained for the word "IIB" in following text:
	"""
	Here is reference to _IIB_.
	"""
	Then the list shall contains definition in file "test-definitions.shalldn" with text:
	"""
	Here is an example of Implicit Inline Definition *IIB* *(n.b.)*.
	"""

	Scenario: Analyzer.ERR_DEFS_DUPS
	Given the test file named "test-definitions.shalldn" is opened
	Then editor problems shall include error for the words "Term 2" with the text:
	"""
	The term "Term 2" has multiple definitions
	"""

	
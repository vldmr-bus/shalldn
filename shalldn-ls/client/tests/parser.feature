Feature: Parser

	Scenario: Parser.IMPLMNT.GRP uplink
	# verify uplink from group *implementation clause*
	Given the test file named "tests.shalldn" is opened
	When list of definitions is obtained for the word "informal" in following text:
	"""
	* Implements **section of informal requirements**
	"""
	Then the list shall contains definition in file "test-informal.shalldn" with text:
	"""
	This section is an example of informal requirement, which can be implemented by formal requirements in other files.
	"""

	Scenario: Parser.IMPLMNT.INDVDL uplink
	# verify uplink from individual *implementation clause*
	Given the test file named "tests.shalldn" is opened
	When list of definitions is obtained for the word "informal" in following text:
	"""
	* Implements **sub-section of informal requirements**
	"""
	Then the list shall contains definition in file "test-informal.shalldn" with text:
	"""
	This sub-section is an example of informal requirement, which can be implemented by formal requirements in other files.
	"""

	Scenario: Parser.ERR.NO_JSTFCTN with existing file
	# Existing file having requirement without implementation generates "Not implemented" error
	Given the test file named "tests.shalldn" with requirement id "Test.Editor.INFO_NOIMPL"
	Then editor problems shall include error with the text:
	"""
	Requirement Test.Editor.INFO_NOIMPL does not have any justification
	"""

	Scenario: Parser.WARN_RTNL with existing file
	# Existing file having requirement without implementation generates "Not implemented" error
	Given the test file named "tests.shalldn" with requirement id "Parser.WARN_RTNL"
	Then editor problems shall include warning with the text:
	"""
	Requirement Test.Parser.WARN_RTNL is justified only by its rationale and by none of higher level requirements
	"""

	Scenario: Parser.ERR.WORDS for TBD
	Given the test file named "tests.shalldn" with requirement id "Test.Parser.TBD_test"
	Then editor problems shall include error with the text:
	"""
	Requirement Test.Parser.TBD_test contains TBD
	"""

	Scenario: Parser.ERR.WORDS for TODO
	Given the test file named "tests.shalldn" with requirement id "Test.Parser.TODO_test"
	Then editor problems shall include error with the text:
	"""
	Requirement Test.Parser.TODO_test contains TODO
	"""

	Scenario: Parser.ERR.WORDS for FIXME
	Given the test file named "tests.shalldn" with requirement id "Test.Parser.FIXME_test"
	Then editor problems shall include error with the text:
	"""
	Requirement Test.Parser.FIXME_test contains FIXME
	"""

	Scenario: Parser.ERR.WORDS for non-requirement
	Given the test file named "lower-level.shalldn" is opened
	Then editor problems shall not include a problem with the text: 
	"""
	TBD
	"""


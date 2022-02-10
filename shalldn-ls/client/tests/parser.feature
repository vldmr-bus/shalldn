Feature: Parser

	Scenario: Parser.IMPLMNT_GRP uplink
	# verify uplink from group *implementation clause*
	Given the test file named "tests.shalldn" is opened
	When list of definitions is obtained for the word "informal" in following text:
	"""
	* Implements **section of informal requirements**
	"""
	Then the list shall contains definition in file "test-informal.shalldn" with text:
	"""
	section of informal requirements
	"""

	Scenario: Parser.IMPLMNT_INDVDL uplink
	# verify uplink from individual *implementation clause*
	Given the test file named "tests.shalldn" is opened
	When list of definitions is obtained for the word "informal" in following text:
	"""
	* Implements **sub-section of informal requirements**
	"""
	Then the list shall contains definition in file "test-informal.shalldn" with text:
	"""
	sub-section of informal requirements
	"""

	Scenario: Parser.ERR_NO_JSTFCTN with existing file
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


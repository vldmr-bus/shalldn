Feature: Editor

    Tests for the Shalldn editor requirements

    @discard_changes @en_only
    Scenario: Editor.INFO.NOIMPL with typing
    # Typing in new requirement with unique ID generates "Not implemented" error
    Given the test file named "tests.shalldn" is opened
    When the text below is appended to the end of the file
    """
    **{unique_id}**  
    This id of this requirement **shall** generate "Not implemented" error.
    """
    Then editor problems shall include info with the text:
    """
    Requirement {that_id} does not have implementation
    """

    @en_only
    Scenario: Editor.INFO.NOIMPL with existing file
    # Existing file having requirement without implementation generates "Not implemented" error
    Given the test file named "tests.shalldn" with requirement id "Test.Editor.INFO_NOIMPL"
    Then editor problems shall include info with the text:
    """
    Requirement Test.Editor.INFO_NOIMPL does not have implementation
    """

    @en_only
    Scenario: Editor.INFO.NOIMPL_DOC with existing file
    # Existing file having requirement without implementation generates "Not implemented" error
    Given the test file named "tests.shalldn" is opened
    Then editor problems shall not include a problem with the text:
    """
    No requirement in the document has implementation
    """

    @discard_changes @en_only
    Scenario: Editor.ERR.NO_IMPLMNT_TGT with typing
    # Typing in *implementation clause* for unique ID generates "Non existent requirement" error
    Given the test file named "tests.shalldn" is opened
    When the text below is appended to the end of the file
    """
    * Implements **{unique_id}**
    """
    Then editor problems shall include error with the text:
    """
    Implementation of non-existing requirement {that_id}
    """

    @discard_changes @en_only
    Scenario: Editor.INFO.NOIMPL with typing in new file
    Given a new file with name "{unique_filename}.shalldn" is created
    When the text below is appended to the end of the file
    """
    # File with *requirement* tests
    **{unique_id}**  
    The id of this requirement **shall** be free from "Not implemented" error.
    """
    Then editor problems shall not include a problem with the text:
    """
    Requirement {that_id} does not have implementation
    """

    @discard_changes
    Scenario: Editor.INFO.NOIMPL_DOC with typing in new file
    Given a new file with name "{unique_filename}.shalldn" is created
    When the text below is appended to the end of the file
    """
    # File with *requirement* tests
    **{unique_id}**  
    The id of this requirement **shall** be free from "Not implemented" error.
    """
    Then editor problems shall not include a problem with the text:
    """
    No requirement in the document has implementation
    """

    @en_only
    Scenario: Editor.INFO.NOIMPL_DOC with existing file file
    Given the test file named "lower-level.shalldn" is opened
    Then editor problems shall include info with the text:
    """
    No requirement in the document has implementation
    """

    @repeat_that_command_after_test @en_only
    Scenario: Editor.TESTS with triggered warnings
    Given the test file named "tests.shalldn" with requirement id "Test.Parser.IMPLMNT_GRP.Link"
    And command 'Toggle warnings for requirements without tests in this file' was issued
    Then editor problems shall include warning with the text:
    """
    Requirement Test.Parser.IMPLMNT_GRP.Link does not have tests
    """

    @en_only
    Scenario: Editor.TESTS without triggered warnings
    Given the test file named "tests.shalldn" with requirement id "Test.Parser.IMPLMNT_GRP.Link"
    Then editor problems shall not include a problem with the text:
    """
    Requirement Test.Parser.IMPLMNT_GRP.Link does not have tests
    """

    @discard_changes
    Scenario: Editor.CMPL.SUBJ
    Given the test file named "lower-level.shalldn" is opened
    When the text below is appended to the end of the file
    """
    A low
    """
    And the list of completion proposals is requested for current position
    Then the list of proposals shall include the following entries:
    """
    lower-level requirement
    """

    @discard_changes
    Scenario: Editor.CMPL.KW_REQ Implements
    Given the test file named "lower-level.shalldn" is opened
    When the text below is appended to the end of the file
    """
    * I
    """
    And the list of completion proposals is requested for current position
    Then the list of proposals shall include the following entries:
    """
    * Implements
    """

    @discard_changes
    Scenario: Editor.CMPL.KW_REQ shall
    Given the test file named "lower-level.shalldn" is opened
    When the text below is appended to the end of the file
    """
    A lower-level requirement **s
    """
    And the list of completion proposals is requested for current position
    Then the list of proposals shall include the following entries:
    """
    **shall**
    """

    @discard_changes
    Scenario: Editor.CMPL.KW_NREQ
    Given the test file named "non-requirement.txt" is opened
    When the text below is appended to the end of the file
    """
    -- $$I
    """
    And the list of completion proposals is requested for current position
    Then the list of proposals shall include the following entries:
    """
    $$Implements
    """

    @discard_changes
    Scenario: Editor.CMPL.IMPL_NREQ
    Given the test file named "non-requirement.txt" is opened
    When the text below is appended to the end of the file
    """
    -- $\$Implements this.and.that, T
    """
    And the list of completion proposals is requested for current position
    Then the list of proposals shall include the following entries:
    """
    Test.
    Test.Parser.
    Test.Parser.IMPLMNT_GRP.
    Test.Analyzer.CMNT_IMPLMNT
    Test.Parser.WARN_RTNL
    """

    @discard_changes
    Scenario: Editor.CMPL.IMPL_REQ
    Given the test file named "lower-level.shalldn" is opened
    When the text below is appended to the end of the file
    """
    * Implements **this.and.that**, **T
    """
    And the list of completion proposals is requested for current position
    Then the list of proposals shall include the following entries:
    """
    Test.
    Test.Parser.
    Test.Parser.IMPLMNT_GRP.
    Test.Analyzer.CMNT_IMPLMNT
    Test.Parser.WARN_RTNL
    """

    @discard_changes
    Scenario: Editor.CMPL.ID_REQ same file
    Given the test file named "tests.shalldn" is opened
    When the text below is appended to the end of the file
    """

    **T
    """
    And the list of completion proposals is requested for current position
    Then the list of proposals shall include the following entries:
    """
    Test.
    Test.Parser.
    Test.Parser.IMPLMNT_GRP.
    Test.Analyzer.CMNT_IMPLMNT
    Test.Parser.WARN_RTNL
    """

    @discard_changes
    Scenario: Editor.CMPL.ID_REQ for other file
    Given the test file named "lower-level.shalldn" is opened
    When the text below is appended to the end of the file
    """

    **T
    """
    And the list of completion proposals is requested for current position
    Then the list of proposals shall not include the following entries:
    """
    Test.
    Test.Parser.
    Test.Parser.IMPLMNT_GRP.
    Test.Analyzer.CMNT_IMPLMNT
    Test.Parser.WARN_RTNL
    """

    @discard_changes
    Scenario: Editor.CMPL.NS_ORD
        Given the test file named "tests.shalldn" is opened
    When the text below is appended to the end of the file
    """

    **T
    """
    And the list of completion proposals is requested for current position
    Then the list of proposals shall include the following entries in given order:
    """
    Test.
    Test.Parser.
    Test.Parser.IMPLMNT_GRP.
    Test.Analyzer.CMNT_IMPLMNT
    Test.Parser.WARN_RTNL
    """

    @discard_changes
    Scenario: Editor.CMPL.DEFS
        Given the test file named "lower-level.shalldn" is opened
    When the text below is appended to the end of the file
    """
    A *T
    """
    And the list of completion proposals is requested for current position
    Then the list of proposals shall include the following entries:
    """
    Term 1
    Term 2
    Term 3
    """

    Scenario: Editor.RENAME
    Given the test file named "tests.shalldn" is opened
    When renaming with the word "ValidId" is requested for the word "Parser" in following text:
    """
    **Test.Parser.IMPLMNT_INDVDL**
    """
    Then total number of edits shall be 6
    And the list of edits shall include 1 in file "lower-level.shalldn"
    And the list of edits shall include 1 in file "non-requirement.txt"
    And the list of edits shall include 2 in file "tests.feature"
    And the list of edits shall include 1 in file "tests.shalldn"
    And the list of edits shall include 1 in file "test-definitions.shalldn"

    Scenario: Editor.RENAME_VALIDATE
    Given the test file named "tests.shalldn" is opened
    When renaming with the word "InvalidId*&^*" is requested for the word "Parser" in following text:
    """
    **Test.Parser.IMPLMNT_INDVDL**
    """
    Then total number of edits shall be 0

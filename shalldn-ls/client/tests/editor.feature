Feature: Editor

    Tests for the Shalldn editor requirements

    @discard_changes
    Scenario: Editor.INFO_NOIMPL with typing
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

    Scenario: Editor.INFO_NOIMPL with existing file
    # Existing file having requirement without implementation generates "Not implemented" error
    Given the test file named "tests.shalldn" with requirement id "Test.Editor.INFO_NOIMPL"
    Then editor problems shall include info with the text:
    """
    Requirement Test.Editor.INFO_NOIMPL does not have implementation
    """

    Scenario: Editor.INFO_NOIMPL_DOC with existing file
    # Existing file having requirement without implementation generates "Not implemented" error
    Given the test file named "tests.shalldn" is opened
    Then editor problems shall not include a problem with the text:
    """
    No requirement in the document has implementation
    """

    @discard_changes
    Scenario: Editor.ERR_NO_IMPLMNT_TGT with typing
    # Typing in *implementation clause* for unique ID generates "Non existent requirement" error
    Given the test file named "tests.shalldn" is opened
    When the text below is appended to the end of the file
    """
    * Implements **{unique_id}**
    """
    Then editor problems shall include error with the text:
    """
    Implementation of non-exisiting requirement {that_id}
    """

    @discard_changes
    Scenario: Editor.INFO_NOIMPL with typing in new file
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
    Scenario: Editor.INFO_NOIMPL_DOC with typing in new file
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

    Scenario: Editor.INFO_NOIMPL_DOC with existing file file
    Given the test file named "lower-level.shalldn" is opened
    Then editor problems shall include info with the text:
    """
    No requirement in the document has implementation
    """
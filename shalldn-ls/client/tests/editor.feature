Feature: Editor

    Tests for the Shalldn editor requirements

    @discard_changes
    Scenario: Editor.ERR_NOIMPL with typing
        # Typing in new requirement with unique ID generates "Not implemented" error
        Given the test file named "tests.shalldn" is opened
        When the text below is appended to the end of the file
            """
            **{unique_id}**  
            This id of this requirement **shall** generate "Not implemented" error.
            """
        Then editor problems shall include problem with the text:
            """
            Requirement {that_id} does not have implementation
            """

    Scenario: Editor.ERR_NOIMPL with existing file
        # Existing file having requirement without implementation generates "Not implemented" error
        Given the test file named "tests.shalldn" with requirement id "Test.Editor.ERR_NOIMPL"
        Then editor problems shall include problem with the text:
            """
            Requirement Test.Editor.ERR_NOIMPL does not have implementation
            """

    @discard_changes
    Scenario: Editor.ERR_NO_IMPLMNT_TGT with typing
        # Typing in *implementation clause* for unique ID generates "Non existent requirement" error
        Given the test file named "tests.shalldn" is opened
        When the text below is appended to the end of the file
            """
            * Implements **{unique_id}**
            """
        Then editor problems shall include problem with the text:
            """
            Implementation of non-exisiting requirement {that_id}
            """

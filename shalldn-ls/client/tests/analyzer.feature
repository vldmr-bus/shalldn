Feature: Analyzer

    Tests for the Shalldn analyzer requirements

    Scenario: Analyzer.IMPLNT for requirements document
    Given the test file named "tests.shalldn" is opened
    When list of references is obtained for the word "Analyzer" in following text:
    """
    **Test.Analyzer.CMNT_IMPLMNT**
    """
    Then the list shall contain reference from the file "lower-level.shalldn" with id "The.lower.level"

    Scenario: Analyzer.IMPLNT for non-requirements document
    Given the test file named "tests.shalldn" is opened
    When list of references is obtained for the word "Analyzer" in following text:
    """
    **Test.Analyzer.CMNT_IMPLMNT**
    """
    Then the list shall contain reference from the file "non-requirement.txt" with id "Test.Analyzer.CMNT_IMPLMNT" that follows the text "$$Implements"

    Scenario: Analyzer.ERR_NOIMPL_TGT for requirements document
    Given the test file named "tests.shalldn" is opened
    Then editor problems shall include error with the text:
    """
    Implementation of non-existing requirement Non.Existing.Requirement
    """

    Scenario: Analyzer.ERR_NOIMPL_TGT for non-requirements document
    Given the test file named "non-requirement.txt" is opened
    Then editor problems shall include error with the text:
    """
    Implementation of non-existing requirement Non.Existing.Requirement
    """

    @discard_changes
    Scenario: Analyzer.IGNORE_NONPROJ
    Given the test file named "../../analyzer.shalldn" is opened
    When list of references is obtained for the word "Analyzer" in following text:
    """
    **Analyzer.IGNORE_NONPROJ**
    """
    Then the list shall be empty

    Scenario: Analyzer.TESTS with inline test clause
    # also $$Tests Analyzer.TEST_CLAUSE
    Given the test file named "tests.shalldn" is opened
    When list of references is obtained for the word "Analyzer" in following text:
    """
    **Test.Analyzer.CMNT_IMPLMNT**
    """
    Then the list shall contain reference from the file "non-requirement.txt" with id "Test.Analyzer.CMNT_IMPLMNT" that follows the text "$$Tests"

    Scenario: Analyzer.TESTS with gherkin scenario test clause
    # also $$Tests Analyzer.TEST_GHERKIN
    Given the test file named "tests.shalldn" is opened
    When list of references is obtained for the word "Test" in following text:
    """
    **Test.Parser.IMPLMNT_INDVDL**
    """
    Then the list shall contain reference from the file "tests.feature" with id "Test.Parser.IMPLMNT_INDVDL" that follows the text "Scenario:"

    Scenario: Analyzer.TESTS_NO_TGT with inline test clause
    # also $$Tests Analyzer.TEST_CLAUSE
    Given the test file named "non-requirement.txt" is opened
    Then editor problems shall include error with the text:
    """
    Test of non-existing requirement Non.Existing.Requirement
    """


    Scenario: Analyzer.TESTS_NO_TGT with gherkin scenario test clause
    # also $$Tests Analyzer.TEST_GHERKIN
    Given the test file named "tests.feature" is opened
    Then editor problems shall include error with the text:
    """
    Test of non-existing requirement Non.Existing.Requirement
    """

    Scenario: Analyzer.TEST_GHERKIN without namespace
        Given the test file named "tests.feature" is opened
    Then editor problems shall not include a problem with the text:
    """
    Test of non-existing requirement NonExistantIdWithoutNameSpace
    """

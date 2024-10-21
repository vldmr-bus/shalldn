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

    @en_only
    Scenario: Analyzer.ERR.NOIMPL_TGT for requirements document
    Given the test file named "tests.shalldn" is opened
    Then editor problems shall include error with the text:
    """
    Implementation of non-existing requirement Non.Existing.Requirement
    """

    @en_only
    Scenario: Analyzer.ERR.NOIMPL_TGT for non-requirements document
    Given the test file named "non-requirement.txt" is opened
    Then editor problems shall include error with the text:
    """
    Implementation of non-existing requirement Non.Existing.Requirement
    """

    @en_only
    Scenario: Analyzer.ERR.XREF_TGT**
    Given the test file named "tests.shalldn" is opened
    Then editor problems shall include error with the text:
    """
    Reference to non-existing requirement Non.Existing.Requirement
    """

    @discard_changes
    Scenario: Analyzer.IGNORE_NONPROJ
    Given the test file named "../../analyzer.shalldn" is opened
    When list of references is obtained for the word "Analyzer" in following text:
    """
    **Analyzer.IGNORE_NONPROJ**
    """
    Then the list shall be empty

    Scenario: Analyzer.TEST.LIST with inline test clause
    # also $$Tests Analyzer.TEST.CLAUSE
    Given the test file named "tests.shalldn" is opened
    When list of references is obtained for the word "Analyzer" in following text:
    """
    **Test.Analyzer.CMNT_IMPLMNT**
    """
    Then the list shall contain reference from the file "non-requirement.txt" with id "Test.Analyzer.CMNT_IMPLMNT" that follows the text "$$Tests"

    Scenario: Analyzer.TEST.LIST with gherkin scenario test clause
    # also $$Tests Analyzer.TEST.GHERKIN
    Given the test file named "tests.shalldn" is opened
    When list of references is obtained for the word "Test" in following text:
    """
    **Test.Parser.IMPLMNT_INDVDL**
    """
    Then the list shall contain reference from the file "tests.feature" with id "Test.Parser.IMPLMNT_INDVDL" that follows the text "Scenario:"
    And the list shall contain reference from the file "tests.feature" with id "Test.Parser.IMPLMNT_INDVDL" that follows the text "Outline:"

    @en_only
    Scenario: Analyzer.TEST.NO_TGT with inline test clause
    # also $$Tests Analyzer.TEST.CLAUSE
    Given the test file named "non-requirement.txt" is opened
    Then editor problems shall include error with the text:
    """
    Test of non-existing requirement Non.Existing.Requirement
    """

    @en_only
    Scenario: Analyzer.TEST.NO_TGT with gherkin scenario test clause
    # also $$Tests Analyzer.TEST.GHERKIN
    Given the test file named "tests.feature" is opened
    Then editor problems shall include error with the text:
    """
    Test of non-existing requirement Non.Existing.Requirement
    """

    @en_only
    Scenario: Analyzer.TEST.NO_TGT with gherkin scenario test clause for scenario outline
    # also $$Tests Analyzer.TEST.GHERKIN
    Given the test file named "tests.feature" is opened
    Then editor problems shall include error with the text:
    """
    Test of non-existing requirement Non.Existing.Requirement.For_Scenario
    """

    Scenario: Analyzer.TEST.GHERKIN without namespace
    Given the test file named "tests.feature" is opened
    Then editor problems shall not include a problem with the text:
    """
    Test of non-existing requirement NonExistantIdWithoutNameSpace
    """

    Scenario: Analyzer.TEST.GHERKIN without namespace for scenario outline
    Given the test file named "tests.feature" is opened
    Then editor problems shall not include a problem with the text:
    """
    Test of non-existing requirement NonExistantIdWithoutNameSpace_For_Scenario
    """

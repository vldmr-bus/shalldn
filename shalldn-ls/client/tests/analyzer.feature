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
    Then the list shall contain reference from the file "non-requirement.txt" with id "Test.Analyzer.CMNT_IMPLMNT"

    @discard_changes
    Scenario: Analyzer.IGNORE_NONPROJ
    Given the test file named "../../analyzer.shalldn" is opened
    When list of references is obtained for the word "Analyzer" in following text:
    """
    **Analyzer.IGNORE_NONPROJ**
    """
    Then the list shall be empty

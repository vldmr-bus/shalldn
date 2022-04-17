Feature: Test fixture

Scenario: Test.Parser.IMPLMNT_INDVDL test fixture
    Given: This scenario has valid requirement id
    Then: That requirement shall have reference to this scenario

Scenario: Non.Existing.Requirement test fixture
    Given: This scenario has invalid requirement id
    Then: It shall be marked with error squiggle

Scenario: NonExistantIdWithoutNameSpace test fixture
    Given: This scenario has invalid requirement id without NonExistantIdWithoutNameSpace
    Then: It shall not be marked with error squiggle
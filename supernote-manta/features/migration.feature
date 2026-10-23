Feature: Leave Supernote Cloud without losing notes

  Scenario: Full export before switching sync
    Given the Manta and Nomad sync to Supernote Cloud
    When I export all notes and documents from each device and from Supernote Cloud
    Then the export holds the same file count and names as the device
    And a copy is stored on hardware we control
    And the export is recorded in results/ with device and firmware build

  Scenario: Export incomplete
    Given an export whose file count does not match the device
    When I review the result
    Then the sync target is not changed
    And Supernote Cloud stays signed in until a complete export exists

Feature: Sideloading is enabled and auditable

  Scenario: Device allows installs from outside the store
    Given the Manta is connected over USB with debugging authorised
    When I run scripts/device_check.sh
    Then the output shows the firmware version
    And sideloading is reported as enabled
    And the firmware version is recorded in results/

  Scenario: Debugging is not authorised
    Given the Manta is connected but USB debugging has not been authorised
    When I run scripts/device_check.sh
    Then it exits non-zero with a message to accept the prompt on the device
    And nothing on the device is changed

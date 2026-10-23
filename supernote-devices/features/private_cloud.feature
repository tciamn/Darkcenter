Feature: Private Cloud keeps notes on my hardware

  Scenario: Sync a note to my own server
    Given the Private Cloud container runs the pinned image tag and digest
    And it is reachable only over my LAN or VPN with TLS
    When I sync a new note from a device (Manta or Nomad)
    Then the file appears on my server
    And no request leaves for Supernote or third-party cloud hosts

  Scenario: Server unreachable
    Given the Private Cloud server is offline
    When I sync from a device (Manta or Nomad)
    Then the note stays on the device and sync reports an error
    And no fallback to a third-party cloud occurs

Feature: WebDAV library access

  Scenario: Browse ebooks from my Nextcloud
    Given a Nextcloud app password exists for the Manta
    And NetVirtualDisk uses the HTTPS WebDAV path
    When I open the network drive from the Manta root
    Then my ebook folder is listed
    And a file can be opened in KOReader

  Scenario: Plain HTTP is refused
    Given a WebDAV URL that uses http://
    When I configure NetVirtualDisk
    Then the setup is stopped and recorded as non-compliant

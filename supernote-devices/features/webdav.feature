Feature: WebDAV library access

  Scenario: Browse ebooks from my Nextcloud
    Given a Nextcloud app password exists for each device
    And NetVirtualDisk uses the HTTPS WebDAV path
    When I open the network drive from the device root
    Then my ebook folder is listed
    And a file can be opened in KOReader

  Scenario: Plain HTTP is refused
    Given a WebDAV URL that uses http://
    When I configure NetVirtualDisk
    Then the setup is stopped and recorded as non-compliant

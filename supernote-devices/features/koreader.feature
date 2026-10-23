Feature: KOReader as the open reading path

  Scenario: Open a DRM-free EPUB
    Given KOReader is installed from F-Droid or a verified release APK
    When I open a DRM-free EPUB from the INBOX or a synced folder
    Then pages turn without persistent ghosting
    And refresh behaviour is recorded as acceptable or not

  Scenario: DRM-protected file
    Given a DRM-protected Kobo purchase
    When I try to open it in KOReader
    Then it does not open and the result notes it must be read in Kobo Books

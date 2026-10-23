Feature: Kobo Books for the existing library

  Scenario: Log in and read one purchased title
    Given Kobo Books is installed from a recorded source and hash
    When I sign in with my Kobo account
    Then the library loads without a blank screen
    And one downloaded title opens and paginates correctly
    And no credentials are written to the repository

  Scenario: Blank screen at login
    Given Kobo Books shows a blank screen after sign-in
    When I record the result
    Then the firmware and app version are logged in results/
    And no reinstall or data wipe is attempted without confirmation

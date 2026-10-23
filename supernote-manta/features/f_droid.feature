Feature: F-Droid installed from a verified source

  Scenario: F-Droid installs and updates apps
    Given the F-Droid APK matches the SHA-256 in manifest/apps.yaml
    When I install it with scripts/install_apk.sh --confirm
    Then F-Droid appears under Settings, Apps
    And it can fetch its repository index over Wi-Fi

  Scenario: APK does not match the manifest
    Given an F-Droid APK whose SHA-256 differs from manifest/apps.yaml
    When I run scripts/install_apk.sh --confirm
    Then verification fails and nothing is installed

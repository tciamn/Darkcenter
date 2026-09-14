# /define — Feature Definition

Produce a BDD feature spec BEFORE any code is written. No implementation until this is complete and accepted.

## Steps

1. **Restate the task** in one sentence — what user need it addresses and who benefits.

2. **Write Gherkin scenarios** (minimum 2 — happy path + at least one edge/error path):

```gherkin
Feature: [name]

  Scenario: [happy path]
    Given [precondition]
    When  [action]
    Then  [outcome]

  Scenario: [edge case or error]
    Given [precondition]
    When  [action]
    Then  [outcome]
```

3. **Acceptance criteria** — testable bullet statements. Each must be verifiable by /qa.

4. **NFRs that apply** — check each against this project list:
   - Accessibility: contrast ≥ 4.5:1, touch targets ≥ 44px, ARIA roles/labels, keyboard nav, prefers-reduced-motion
   - Privacy/sovereignty: no external calls, CSP, no-referrer
   - Offline resilience: zero network dependencies
   - Security: no unsafe innerHTML with user input, no eval
   - Data labelling: correct units, no misleading values

5. **Open questions** — anything that needs a decision before building. Do not assume answers; surface them.

## Output format

Wrap the complete spec in a fenced block labelled `spec`. Example:

```spec
Feature: ...
Scenarios: 2
Acceptance criteria:
  - ...
NFRs: a11y (contrast, touch), offline, CSP
Open questions:
  - ...
```

Stop here. Do not write code. Wait for the operator to confirm the spec before proceeding to /build.

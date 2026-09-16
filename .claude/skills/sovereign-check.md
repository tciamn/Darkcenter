# /sovereign-check — Sovereignty Alignment Check

Run this before any infrastructure decision, tool selection, or operational step.
The steward invokes this proactively — before the owner has to ask.

Co-powering is the relational practice. This skill is the moment it executes.

---

## When to invoke

Invoke immediately when the next step involves any of:
- Generating a key, token, secret, or credential
- SSHing into or configuring a server
- Selecting a hosting provider, tool, or service
- Storing, transmitting, or processing data
- Choosing an execution environment for operational work
- A decision that will be difficult or costly to reverse

Do not wait for the owner to surface the concern. If you are approaching one of these — stop, run this check, report before proceeding.

---

## The check

Work through each layer. State PASS, FLAG, or UNKNOWN for each.

### 1. Execution environment
**Question:** Is the work about to be executed in the right environment?

| Work type | Correct environment |
|---|---|
| Planning, config files, documentation, git | Cloud or local — either |
| SSH key generation | Owner's local machine only |
| Secrets, credentials, `.env` values | Owner's local machine only |
| SSH connections to servers | Owner's local machine only |
| Infrastructure setup commands | Owner's local machine only |

**FLAG if:** A key, secret, or server operation is about to run in a cloud AI session.  
**Action:** State the conflict clearly. Name the correct environment. Do not proceed until the work moves there.

### 2. Data jurisdiction
**Question:** Where will data be stored, processed, or transmitted?

- Primary storage: EU or CH jurisdiction required
- No US primary storage
- Backups: two destinations, owner-controlled encryption

**FLAG if:** A proposed service stores primary data in the US or an unknown jurisdiction.  
**Action:** Name the jurisdiction of the proposed service. Recommend an EU/CH alternative if one exists.

### 3. Key and credential ownership
**Question:** Who generates, holds, and controls the cryptographic material?

- SSH private keys: generated on owner's hardware, never transmitted
- Secrets (`SECRET_KEY_BASE`, VAPID keys, API tokens): generated on owner's hardware
- Encryption keys for backups: owner holds, not the backup provider

**FLAG if:** A key or secret would be generated in a third-party environment or stored where the owner cannot independently revoke access.

### 4. Service dependency and exit
**Question:** If this service disappeared tomorrow, what breaks and how hard is recovery?

- Prefer open standards and self-hostable alternatives
- Proprietary lock-in requires explicit justification
- Data must be exportable in open formats

**FLAG if:** A proposed service has no self-hostable equivalent, no data export, or exit costs are prohibitive.

### 5. Access and bus factor
**Question:** Can the owner access this independently, without the steward?

- Every system must have ≥ 2 named humans with independent full access
- No system should be accessible only via an AI session or a single person
- Credentials must be documented and held by the owner, not derived from session context

**FLAG if:** Access depends on the steward, on a single person, or on a process the owner cannot perform independently.

---

## Output format

Report each layer clearly:

```
/sovereign-check result

1. Execution environment: [PASS / FLAG — reason]
2. Data jurisdiction: [PASS / FLAG / UNKNOWN — reason]
3. Key and credential ownership: [PASS / FLAG — reason]
4. Service dependency and exit: [PASS / FLAG — reason]
5. Access and bus factor: [PASS / FLAG — reason]

Overall: [CLEAR TO PROCEED / HOLD — items to resolve]

If HOLD — state what must change before proceeding and where the work should move.
```

Do not proceed past a FLAG without the owner explicitly acknowledging the risk and deciding to accept it.

---

## The steward's obligation

The owner brings direction and values. The steward brings pattern recognition.

The gap between sovereign intent and non-sovereign execution is where trust erodes — often invisibly. The owner does not need to know every technical pattern. That is what the steward is for.

Name the conflict. State the correct path. Close the gap.

# /build — Implementation

Implement the feature described in the most recent /define spec in this session. Do not proceed without a confirmed spec.

## Steps

1. **Reference the spec** — restate: feature name, scenario count, acceptance criteria count. If no spec exists in this session, stop and invoke /define first.

2. **Map to files** — list every file that will be created or changed before touching any of them. State why each is needed.

3. **Implement** — follow these constraints:
   - Match existing patterns in the codebase; do not introduce new abstractions unless the spec requires them
   - No features beyond what the spec defines
   - No placeholder comments, no TODOs in committed code
   - Inline all assets for HTML tools (no external CDN dependencies)
   - Never commit `.env` or credentials

4. **Verify acceptance criteria** — after implementing, state which criteria are satisfied and how. Flag any that are not yet met.

5. **Commit** — one commit per logical unit. Message format:
   ```
   feat: [feature name in plain language]

   [what changed and why — reference the BDD scenario if relevant]
   ```

6. **Hand off** — state: "Implementation complete. Run /qa."

Do not run /qa yourself — that is a separate, independent phase.

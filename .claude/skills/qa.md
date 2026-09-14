# /qa — Quality Assurance

Run a structured QA pass on the current changes. Work through every dimension below in order. Fix all findings before reporting done.

## Reporting format

Each finding: `[SEVERITY] file:line — description`

Severity levels: CRITICAL · HIGH · MEDIUM · LOW · INFO

## Dimensions (check all, in order)

### 1. Functional correctness
- Do all BDD scenarios from the /define spec pass?
- Are all acceptance criteria met?
- Do edge cases and error paths behave as specified?

### 2. Security
- No raw user input in `innerHTML` — use `escHtml()` or equivalent
- No `eval()`, no dynamic `<script>` injection
- Content-Security-Policy present and restrictive
- No secrets, tokens, or credentials in committed files

### 3. Accessibility (WCAG 2.1 AA)
- Contrast: normal text ≥ 4.5:1, large text ≥ 3:1 (calculate, do not estimate)
- Touch targets: ≥ 44px height/width (Apple HIG)
- ARIA: `role`, `aria-label`, `aria-live`, `aria-expanded` on all interactive and dynamic regions
- Keyboard: all interactive elements reachable by Tab, activated by Enter/Space
- Focus: `:focus-visible` visible; not suppressed by `outline: none`
- Motion: `prefers-reduced-motion` respected for all animations and transitions

### 4. Privacy / Data Sovereignty (TCIA core requirement)
- Zero external network calls (no CDN fonts, no analytics, no tracking pixels)
- `<meta name="referrer" content="no-referrer">` present
- No `localStorage` used for sensitive data
- No third-party scripts

### 5. Offline resilience
- All assets inline or system-native — nothing that requires a network connection
- App functions after iOS/iPadOS cache with no active connection

### 6. Data integrity and labelling
- Units correct and consistent (e.g. million metric tonnes ≠ metric tonnes)
- Numbers match source data; no invented or rounded-without-disclosure values
- State/feature lists accurate — no examples referencing missing data

### 7. Performance and sustainability
- No memory leaks: `setInterval`/`setTimeout` cleared when appropriate, event listeners removed on teardown
- No render-blocking resources
- Efficient DOM updates — full `innerHTML` rewrites acceptable for small datasets, flag for large ones

## After finding and fixing

Re-check each dimension. Then output one of:

```
QA PASS — all dimensions clear. Ready to push.
```

or

```
QA OPEN ITEMS — [n] unresolved:
  - [SEVERITY] file:line — description
```

Do not push to remote until QA PASS is confirmed.

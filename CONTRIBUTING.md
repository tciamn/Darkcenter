# Contributing to the Data Center Impact Tool

Thank you for helping make this tool more accurate, more accessible, and more useful 
to the communities who need it most.

---

## Who This Tool Is For

Working class people. Families living near data centers. People who pay electric bills. 
People breathing the air. People who deserve to know what's happening in their neighborhoods.

Every contribution should serve that audience — not analysts, not investors, not policymakers.
If a change makes the tool harder for a regular person to use, it's not the right change.

---

## Ways to Contribute

### 🗂 Data contributions (no coding required)
- Add or update state-level data in `data/fallback.json`
- Correct factual errors with source citations
- Flag data that appears outdated

**All data changes require a source citation** in the pull request.
Link to the specific row/tab in the FracTracker spreadsheet or name the primary source.
Do not estimate or interpolate figures — if data isn't available from a primary source, omit it.

### 🌐 Translations
The tool currently exists only in English. Spanish translation is a high priority.
Translation files live in `src/i18n/`. See `src/i18n/README.md` for instructions.

### 🐛 Bug reports
Open an issue. Include:
- What you expected to happen
- What actually happened
- Your browser and device type

### 💻 Code contributions
See the development setup below.

---

## Development Setup

```bash
git clone https://github.com/your-org/datacenter-impact-tool.git
cd datacenter-impact-tool
npm install
cp .env.example .env
# Fill in your Google Sheets credentials, or set VITE_FORCE_FALLBACK=true
npm run dev
```

---

## Pull Request Guidelines

1. **One thing per PR.** Data change, bug fix, or feature — not all three.
2. **Plain language.** The tool is for general audiences. Keep jargon out of UI text.
3. **No new dependencies** without discussion in an issue first.
4. **Test on mobile.** Many users are on phones.
5. **Data changes need citations.** No exceptions.

---

## Code of Conduct

This project is community-maintained. We expect:

- Respectful, collaborative communication
- Centering the needs of affected communities over technical preferences
- Transparency about data limitations and uncertainty
- Attribution of research to the organizations who produced it

Harassment, bad-faith contributions, or attempts to minimize the documented impacts 
will result in removal from the project.

---

## Governance

Issues and PRs are reviewed by a rotating group of community maintainers.
No single organization controls merge rights.

Current maintainers are listed in `MAINTAINERS.md`.

---

## Questions?

Open an issue or reach out to the maintainers listed in `MAINTAINERS.md`.

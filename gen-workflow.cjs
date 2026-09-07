const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, convertInchesToTwip
} = require('docx');
const fs = require('fs');

const ACCENT = '2E6B4E';
const AMBER  = 'B87418';
const DARK   = '1A1C18';

const eyebrow = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 16, color: ACCENT, allCaps: true, characterSpacing: 120 })],
  spacing: { before: 400, after: 80 }
});

const h1 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 160 }
});

const h2 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_2,
  spacing: { before: 480, after: 120 }
});

const h3 = (text) => new Paragraph({
  text, heading: HeadingLevel.HEADING_3,
  spacing: { before: 280, after: 80 }
});

const body = (text) => new Paragraph({
  children: [new TextRun({ text, size: 22, color: DARK })],
  spacing: { before: 80, after: 120 },
  alignment: AlignmentType.JUSTIFIED
});

const mono = (text) => new Paragraph({
  children: [new TextRun({ text: text || ' ', size: 18, color: DARK, font: 'Courier New' })],
  spacing: { before: 30, after: 30 },
  indent: { left: convertInchesToTwip(0.4) }
});

const bullet = (text, bold_prefix = null) => new Paragraph({
  indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.2) },
  spacing: { before: 60, after: 60 },
  children: [
    ...(bold_prefix ? [new TextRun({ text: bold_prefix + ' ', bold: true, size: 22 })] : []),
    new TextRun({ text, size: 22, color: DARK })
  ]
});

const callout = (label, text, color = ACCENT) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [200, 9160],
  borders: {
    top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
    insideH: { style: BorderStyle.NONE }, insideV: { style: BorderStyle.NONE }
  },
  rows: [new TableRow({
    children: [
      new TableCell({
        width: { size: 200, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: color === AMBER ? 'FDF3E0' : 'EAF3EE' },
        children: [new Paragraph({ children: [new TextRun({ text: '', size: 22 })] })]
      }),
      new TableCell({
        width: { size: 9160, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: color === AMBER ? 'FDF3E0' : 'EAF3EE' },
        margins: { left: 160, right: 160, top: 100, bottom: 100 },
        children: [new Paragraph({
          children: [
            new TextRun({ text: label + ' ', bold: true, size: 22, color }),
            new TextRun({ text, size: 22, color: DARK })
          ]
        })]
      })
    ]
  })]
});

const divider = () => new Paragraph({
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D4CFC6' } },
  spacing: { before: 320, after: 320 }
});

const simpleTable = (headers, rows, colWidths = null) => {
  const totalWidth = 9360;
  const widths = colWidths || headers.map(() => Math.floor(totalWidth / headers.length));
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => new TableCell({
          width: { size: widths[i], type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: 'EAF3EE' },
          margins: { left: 120, right: 120, top: 80, bottom: 80 },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 18, color: ACCENT })] })]
        }))
      }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((cell, i) => new TableCell({
          width: { size: widths[i], type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: ri % 2 === 0 ? 'FFFFFF' : 'FAFAF8' },
          margins: { left: 120, right: 120, top: 80, bottom: 80 },
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20, color: DARK })] })]
        }))
      }))
    ]
  });
};

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
        run: { bold: true, size: 36, color: DARK, font: 'Calibri' },
        paragraph: { spacing: { before: 0, after: 160 } } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal',
        run: { bold: true, size: 28, color: ACCENT, font: 'Calibri' },
        paragraph: { spacing: { before: 480, after: 120 } } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal',
        run: { bold: true, size: 24, color: DARK, font: 'Calibri' },
        paragraph: { spacing: { before: 280, after: 80 } } }
    ]
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 } } },
    children: [

      // Header
      eyebrow('TCIA / Future Labs · Workflow Reference · BDD + Git + Deploy'),
      h1('Data Center Impact Tool'),
      new Paragraph({
        children: [new TextRun({ text: 'Development Workflow: Git Conventions, BDD Issues, Data Sync, and Deployment Pipeline', size: 24, color: '3D4039', italics: true })],
        spacing: { before: 0, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Owner: ', bold: true, size: 20, color: '6B7069' }),
          new TextRun({ text: 'aasim@tciamn.org', size: 20, color: '6B7069' }),
          new TextRun({ text: '   ·   Updated: ', bold: true, size: 20, color: '6B7069' }),
          new TextRun({ text: '2026-09-07', size: 20, color: '6B7069' })
        ],
        spacing: { before: 0, after: 400 }
      }),
      divider(),

      // Guiding principles
      h2('Guiding Principles'),
      bullet('Review first, reduce tech debt later — never skip QA to ship faster'),
      bullet('Do not act before direction is confirmed — wait for guidance on decisions'),
      bullet('Never commit .env files, API keys, server IPs, or credentials to any branch'),
      bullet('Data sovereignty: primary data in EU or CH jurisdiction — no US-only storage'),
      bullet('Version control everything that matters — including these documents'),
      bullet('Admin bus factor >= 2 — two named individuals hold independent full access at all times'),

      // Git conventions
      h2('Git Branch Conventions'),
      body('All active work follows the pattern below. The main branch is the stable state. Feature and fix work happens on named branches.'),
      simpleTable(
        ['Branch type', 'Naming pattern', 'Example'],
        [
          ['Claude working branch', 'claude/<purpose>-<id>', 'claude/squarespace-page-config-yydjup'],
          ['Feature branch', 'feature/<short-name>', 'feature/validation-checklist'],
          ['Fix branch', 'fix/<short-name>', 'fix/closing-tags'],
          ['Docs branch', 'docs/<short-name>', 'docs/hdl-ldl-workflow']
        ],
        [2400, 3600, 3360]
      ),

      h3('Daily Git Routine'),
      mono('git fetch origin'),
      mono('git checkout -b feature/<name> origin/main'),
      mono('# ... do work ...'),
      mono('git add <specific files>   # never git add -A blindly'),
      mono('git status                  # review what is staged'),
      mono('git commit -m "feat: short description"'),
      mono('git push -u origin feature/<name>'),

      callout('Never:', 'git add -A without reviewing git status first. A .env file accidentally staged will be in the history permanently.', AMBER),

      // BDD issue format
      h2('GitHub Issues — BDD Format'),
      body('All GitHub Issues follow Behavior-Driven Development (BDD) format. This aligns issue language with acceptance tests and makes done criteria unambiguous.'),

      h3('Issue Template'),
      mono('## User Story'),
      mono('As a [role], I want [feature], so that [outcome].'),
      mono(''),
      mono('## Acceptance Criteria'),
      mono(''),
      mono('Given [starting state]'),
      mono('When [action taken]'),
      mono('Then [expected outcome]'),
      mono(''),
      mono('And [additional condition]'),
      mono(''),
      mono('## Definition of Done'),
      mono('- [ ] Acceptance criteria pass in browser'),
      mono('- [ ] No console errors'),
      mono('- [ ] Code reviewed'),
      mono('- [ ] Committed to correct branch'),

      h3('Example — Validation Issue'),
      mono('## User Story'),
      mono('As aasim@tciamn.org, I want to validate the Data Center Impact Tool'),
      mono('against live data so that I can confirm it is correct before deployment.'),
      mono(''),
      mono('## Acceptance Criteria'),
      mono(''),
      mono('Given I have set VITE_GOOGLE_SHEETS_API_KEY in .env'),
      mono('When I run npm run dev and open the tool'),
      mono('Then the tool loads without console errors'),
      mono(''),
      mono('Given I select Minnesota from the state dropdown'),
      mono('When the data loads'),
      mono('Then the impact numbers match the source spreadsheet by hand'),
      mono(''),
      mono('Given I disable the API key'),
      mono('When I reload the tool'),
      mono('Then the fallback data loads for the 30 supported states'),

      // Project management layers
      h2('Project Management — Three Layers'),
      body('TCIA uses three tools at different granularity levels. They do not duplicate each other.'),
      simpleTable(
        ['Tool', 'Scope', 'Used for'],
        [
          ['GitHub Issues', 'Code-linked', 'BDD acceptance criteria, code traceability, sprint items with PR links'],
          ['Jira', 'Team epics', 'Sprint planning, capacity, cross-team dependencies, roadmap'],
          ['Todoist', 'Personal', 'Daily reminders, personal task queue, things only aasim tracks']
        ],
        [2200, 2000, 5160]
      ),

      // Data sync workflow
      h2('Data Sync Workflow'),
      body('The tool uses a two-layer data strategy. The live Google Sheets feed is the source of truth. The fallback JSON is the safety net.'),

      h3('Live Feed'),
      bullet('Source: Google Sheets (FracTracker Alliance / IM3 research data)'),
      bullet('Access: Google Sheets API v4 via VITE_GOOGLE_SHEETS_API_KEY'),
      bullet('Trigger: fetched client-side on every tool load'),
      bullet('Covers: all 50 US states + 2,820 data center records'),

      h3('Fallback Feed'),
      bullet('Source: data/fallback.json in the repository'),
      bullet('Trigger: activated automatically if the Google Sheets API call fails'),
      bullet('Covers: 30 US states (subset of full dataset)'),
      bullet('Updated manually when the live sheet changes significantly'),

      h3('GitHub Actions — Automated Sync (future)'),
      body('A GitHub Actions workflow (.github/workflows/sync-data.yml) is scaffolded to fetch updated data from the live sheet and commit it to fallback.json on a schedule. This is not yet active — it runs after the tool is validated and deployed.'),

      // Deployment pipeline
      h2('Deployment Pipeline'),
      body('After initial Netlify setup (see HDL document), the deployment pipeline is fully automatic.'),
      simpleTable(
        ['Event', 'What happens', 'Time'],
        [
          ['Push to main', 'Netlify detects the push and starts a new build', 'Immediate'],
          ['Build runs', 'npm run build compiles React app to dist/', '~60 seconds'],
          ['Deploy', 'Netlify serves the new dist/ at the subdomain', 'After build'],
          ['Cache invalidation', 'Netlify automatically purges CDN cache', 'Automatic'],
          ['Rollback', 'Previous deploy is one click in Netlify UI', 'Instant']
        ],
        [2800, 4560, 2000]
      ),
      callout('Convention:', 'Only push to main when validation has passed locally. The main branch is always the version that can be deployed. Experimental work stays on feature branches.', ACCENT),

      // QA checklist
      h2('QA Checklist — Before Any Merge to Main'),
      bullet('npm run build passes with no errors'),
      bullet('npm run preview — test the production build locally'),
      bullet('Open in Chrome and Firefox — confirm no layout breaks'),
      bullet('Check browser console for errors'),
      bullet('Test with API key disabled — confirm fallback activates'),
      bullet('Test on mobile viewport (375px) — confirm responsive layout'),
      bullet('git status — confirm no .env or credentials are staged'),
      bullet('git diff — read your own changes before committing'),

      // Footer
      divider(),
      new Paragraph({
        children: [
          new TextRun({ text: 'TCIA / Future Labs · tciamn/Darkcenter · docs/workflow-data-center-tool.docx', size: 18, color: '6B7069' })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 }
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/home/user/Darkcenter/docs/workflow-data-center-tool.docx', buf);
  console.log('Workflow written');
});

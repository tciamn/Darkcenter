const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, convertInchesToTwip
} = require('docx');
const fs = require('fs');

const ACCENT = '2E6B4E';
const AMBER  = 'B87418';
const RED    = 'C0392B';
const GRAY   = 'F2F2F2';
const DARK   = '1A1C18';

const eyebrow = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 16, color: ACCENT, allCaps: true, characterSpacing: 120 })],
  spacing: { before: 400, after: 80 }
});

const h1 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_1,
  spacing: { before: 0, after: 160 }
});

const h2 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_2,
  spacing: { before: 480, after: 120 }
});

const h3 = (text) => new Paragraph({
  text,
  heading: HeadingLevel.HEADING_3,
  spacing: { before: 280, after: 80 }
});

const body = (text) => new Paragraph({
  children: [new TextRun({ text, size: 22, color: DARK })],
  spacing: { before: 80, after: 120 },
  alignment: AlignmentType.JUSTIFIED
});

const mono = (text) => new Paragraph({
  children: [new TextRun({ text, size: 18, color: DARK, font: 'Courier New' })],
  spacing: { before: 40, after: 40 },
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
        shading: { type: ShadingType.CLEAR, fill: color === AMBER ? 'FDF3E0' : color === RED ? 'FDEDED' : 'EAF3EE' },
        children: [new Paragraph({ children: [new TextRun({ text: '', size: 22 })] })]
      }),
      new TableCell({
        width: { size: 9160, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: color === AMBER ? 'FDF3E0' : color === RED ? 'FDEDED' : 'EAF3EE' },
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
    default: {
      document: { run: { font: 'Calibri', size: 22 } }
    },
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
      eyebrow('TCIA / Future Labs · High Detail Level · Technical Reference'),
      h1('Data Center Impact Tool'),
      new Paragraph({
        children: [new TextRun({ text: 'Architecture, Validation Checklist, and Deployment Runbook', size: 26, color: '3D4039', italics: true })],
        spacing: { before: 0, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: 'Owner: ', bold: true, size: 20, color: '6B7069' }),
          new TextRun({ text: 'aasim@tciamn.org', size: 20, color: '6B7069' }),
          new TextRun({ text: '   ·   Org: ', bold: true, size: 20, color: '6B7069' }),
          new TextRun({ text: 'Twin Cities Innovation Alliance', size: 20, color: '6B7069' }),
          new TextRun({ text: '   ·   Updated: ', bold: true, size: 20, color: '6B7069' }),
          new TextRun({ text: '2026-09-07', size: 20, color: '6B7069' }),
          new TextRun({ text: '   ·   Status: ', bold: true, size: 20, color: '6B7069' }),
          new TextRun({ text: 'Development complete — not yet validated', size: 20, color: AMBER })
        ],
        spacing: { before: 0, after: 400 }
      }),
      divider(),

      // Architecture
      h2('Architecture Overview'),
      body('The Data Center Impact Tool is a React 18 single-page application built with Vite 5. It follows a two-layer data strategy: a live Google Sheets feed as the primary source, with a local fallback JSON file if the feed is unavailable.'),

      h3('Data Flow'),
      simpleTable(
        ['Layer', 'Technology', 'Purpose'],
        [
          ['Frontend', 'React 18 + Vite 5', 'Interactive SPA — state selector, impact cards, charts'],
          ['Live data', 'Google Sheets API v4', 'Primary data source — 2,820 data centers, 50 US states'],
          ['Fallback data', 'data/fallback.json', '30 states of impact data — used if API call fails'],
          ['Hosting', 'Netlify (pending)', 'CI/CD platform — auto-rebuilds on push to main'],
          ['DNS', 'GoDaddy', 'CNAME record pointing subdomain to Netlify deployment'],
          ['Env vars', 'Netlify UI', 'API key stored server-side — not in the repo']
        ],
        [2200, 2600, 4560]
      ),

      h3('Component Map'),
      bullet('App.jsx — root component; manages state selection and data fetch lifecycle'),
      bullet('StateSelector.jsx — dropdown; triggers data load for selected state'),
      bullet('ImpactCard.jsx — renders a single impact metric (deaths, energy, emissions, cost)'),
      bullet('DataChart.jsx — bar chart comparing state to national averages'),
      bullet('DataContext.jsx — React context; holds fetched data, loading state, and error flag'),
      bullet('api/sheets.js — wraps Google Sheets API call; returns structured impact object'),
      bullet('data/fallback.json — static backup for 30 states'),
      bullet('public/embed.html — fully self-contained standalone version (no build step)'),

      h3('Environment Variables'),
      callout('Security:', 'Never commit API keys to the repository. Set these in the Netlify dashboard under Site Settings → Environment Variables.', AMBER),
      mono('VITE_GOOGLE_SHEETS_API_KEY=<your key>'),
      mono('VITE_SPREADSHEET_ID=<your sheet ID>'),
      body('Both variables are prefixed with VITE_ so Vite exposes them to client-side code at build time. They are not secrets in the cryptographic sense — they are restricted by Google API key settings (HTTP referrer restriction to the deployment domain).'),

      // Security status
      h2('Security Status'),
      callout('High CVE — esbuild / Vite:', 'npm audit reports esbuild <= 0.24.2 (moderate) and vite <= 6.4.2 (high). These affect the dev server only and do not appear in the production build. Fix before the next development sprint: npm audit fix --force upgrades to Vite 8.x (breaking change — test thoroughly).', RED),
      body('The current production build output is unaffected by the dev-server CVE. However, upgrading Vite is required before the next active development phase begins.'),

      // Validation checklist
      h2('Validation Checklist'),
      callout('Required before deployment:', 'Every item below must pass before the tool is deployed or shared publicly. Validation is the next step.', AMBER),

      h3('Environment Setup'),
      bullet('Set VITE_GOOGLE_SHEETS_API_KEY in a local .env file (not committed)'),
      bullet('Set VITE_SPREADSHEET_ID to the live FracTracker / IM3 data sheet'),
      bullet('Restrict the API key in Google Cloud Console: HTTP referrer → deployment domain only'),

      h3('Data Validation'),
      bullet('Run npm run dev and open the tool in a browser'),
      bullet('Select at least 5 states — confirm numbers load without error'),
      bullet('Compare at least 3 state totals against the source spreadsheet by hand'),
      bullet('Trigger the fallback: disable the API key temporarily; confirm fallback.json loads and 30 states still work'),
      bullet('Confirm all 50 states appear in the state selector dropdown'),

      h3('UI / UX'),
      bullet('Check mobile layout at 375px width (iPhone SE viewport)'),
      bullet('Check desktop layout at 1280px width'),
      bullet('Confirm no JavaScript console errors in any state'),
      bullet('Confirm loading spinner appears while data fetches'),
      bullet('Confirm error state renders if API fails and fallback also fails'),

      h3('Build'),
      bullet('Run npm run build — confirm no errors'),
      bullet('Run npm run preview — confirm the production build works locally'),
      bullet('Confirm the embed.html standalone file loads correctly in a browser with no build step'),

      // Netlify deployment
      h2('Netlify Deployment Runbook'),
      body('These steps are performed once. After initial setup, deployments are automatic on every push to main.'),

      simpleTable(
        ['Step', 'Action', 'Where'],
        [
          ['1', 'Create Netlify account or log in', 'netlify.com'],
          ['2', 'New site → Import from Git → GitHub → tciamn/Darkcenter', 'Netlify UI'],
          ['3', 'Build command: npm run build', 'Netlify → Site Settings → Build'],
          ['4', 'Publish directory: dist', 'Netlify → Site Settings → Build'],
          ['5', 'Add VITE_GOOGLE_SHEETS_API_KEY env var', 'Netlify → Site Settings → Env Vars'],
          ['6', 'Add VITE_SPREADSHEET_ID env var', 'Netlify → Site Settings → Env Vars'],
          ['7', 'Trigger first deploy — watch build log for errors', 'Netlify → Deploys'],
          ['8', 'Copy the Netlify deploy URL (e.g. darkcenter.netlify.app)', 'Netlify → Domains'],
          ['9', 'Add CNAME record at GoDaddy: data.tciamn.org → Netlify URL', 'GoDaddy DNS Manager'],
          ['10', 'Wait for DNS propagation (up to 24h); confirm custom domain loads', 'Browser']
        ],
        [400, 5560, 3400]
      ),

      h3('netlify.toml (recommended — add to repo root)'),
      mono('[build]'),
      mono('  command = "npm run build"'),
      mono('  publish = "dist"'),
      mono(''),
      mono('[[redirects]]'),
      mono('  from = "/*"'),
      mono('  to = "/index.html"'),
      mono('  status = 200'),
      body('The redirects rule is required for React Router — without it, direct URLs (e.g. /state/mn) return 404 on Netlify.'),

      // GoDaddy DNS
      h2('GoDaddy DNS Configuration'),
      body('DNS for all TCIA subdomains is managed at GoDaddy — not SiteGround. SiteGround hosts the WordPress site at app.tciamn.org but does not control DNS.'),
      simpleTable(
        ['Record Type', 'Name', 'Value', 'TTL'],
        [
          ['CNAME', 'data', '<netlify-deploy-url>.netlify.app', '1 hour'],
          ['CNAME', 'app', 'siteground-ip-or-alias', '1 hour'],
          ['CNAME', 'cloud', 'TBD (VPS IP — pending decision)', 'TBD']
        ],
        [1800, 1800, 4200, 1560]
      ),

      // Branch map
      h2('Branch Map'),
      simpleTable(
        ['Branch', 'Contents', 'Status'],
        [
          ['main', 'Complete React app + all HTML pages + CLAUDE.md', 'Current — Friday branch merged in'],
          ['claude/squarespace-page-config-yydjup', 'Fixed creators timeline HTML; active working branch', 'Active'],
          ['claude/what-broke-this-should-be-uh7vcn', 'Friday branch — origin of complete app', 'Merged to main'],
          ['claude/siteground-wordpress-setup-al3hdi', '.claude/projects/ docs (Future Labs, Supernote)', 'Reference only']
        ],
        [3000, 4560, 1800]
      ),

      // Footer
      divider(),
      new Paragraph({
        children: [
          new TextRun({ text: 'TCIA / Future Labs · tciamn/Darkcenter · docs/hdl-data-center-tool.docx', size: 18, color: '6B7069' })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 }
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/home/user/Darkcenter/docs/hdl-data-center-tool.docx', buf);
  console.log('HDL written');
});

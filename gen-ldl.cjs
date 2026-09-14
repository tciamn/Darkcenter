const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, Table, TableRow, TableCell, WidthType,
  ShadingType, BorderStyle, PageBreak, NumberingLevelAbstract,
  convertInchesToTwip, UnderlineType
} = require('docx');
const fs = require('fs');

const ACCENT = '2E6B4E'; // TCIA green
const AMBER  = 'B87418';
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

const body = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, size: 22, color: DARK, ...opts })],
  spacing: { before: 80, after: 120 },
  alignment: AlignmentType.JUSTIFIED
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
        shading: { type: ShadingType.CLEAR, fill: color === ACCENT ? 'EAF3EE' : 'FDF3E0' },
        children: [new Paragraph({ children: [new TextRun({ text: '', size: 22 })] })]
      }),
      new TableCell({
        width: { size: 9160, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: color === ACCENT ? 'EAF3EE' : 'FDF3E0' },
        margins: { left: 160, right: 160, top: 100, bottom: 100 },
        children: [new Paragraph({
          children: [
            new TextRun({ text: label + ' ', bold: true, size: 22, color: color }),
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

const simpleTable = (headers, rows) => new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: headers.map(() => Math.floor(9360 / headers.length)),
  rows: [
    new TableRow({
      tableHeader: true,
      children: headers.map(h => new TableCell({
        width: { size: Math.floor(9360 / headers.length), type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: 'EAF3EE' },
        margins: { left: 120, right: 120, top: 80, bottom: 80 },
        children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 18, color: ACCENT })] })]
      }))
    }),
    ...rows.map((row, ri) => new TableRow({
      children: row.map(cell => new TableCell({
        width: { size: Math.floor(9360 / headers.length), type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: ri % 2 === 0 ? 'FFFFFF' : 'FAFAF8' },
        margins: { left: 120, right: 120, top: 80, bottom: 80 },
        children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20, color: DARK })] })]
      }))
    }))
  ]
});

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
      eyebrow('TCIA / Future Labs · Low Detail Level · Executive Summary'),
      h1('Data Center Impact Tool'),
      new Paragraph({
        children: [new TextRun({ text: 'Who\'s Paying the Price for the AI Boom?', size: 26, color: '3D4039', italics: true })],
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

      // What it is
      h2('What Is This?'),
      body('The Data Center Impact Tool is a community-facing web application that translates the environmental and health cost of 2,820 data centers across the United States into plain language that everyday people can understand.'),
      body('It answers a simple question: who pays for the AI boom? Not in technical terms — in deaths, asthma attacks, dollars, and the name of a country whose annual emissions yours matches.'),
      body('Built from independent research. Owned by the community. Free to use, adapt, and redistribute.'),

      // What it shows
      h2('What Does It Show?'),
      bullet('Premature deaths and asthma attacks caused by air pollution from data center energy use'),
      bullet('Energy demand — expressed as homes powered, not gigawatts'),
      bullet('CO₂ emissions compared to countries people recognize'),
      bullet('Annual health costs absorbed by communities — not paid by the corporations that built these facilities'),
      bullet('A state-by-state breakdown with a "find your state" selector'),

      // Data sources
      callout('Data sources:', 'FracTracker Alliance · Oil & Gas Watch · IM3 · U.S. EPA eGRID · U.S. EIA · EDGAR · COBRA Health Model'),

      // Current status
      h2('Current Status'),
      callout('Status:', 'Development is complete. The tool has not yet been validated against live data. It must be validated before it is deployed or shared publicly.', AMBER),
      body('Validation means running the tool with real credentials against the live data source, confirming the numbers are correct, and verifying there are no errors in the browser. This is the next step before any deployment.'),

      // What exists
      h3('What Has Been Built'),
      bullet('A complete React web application — the interactive tool'),
      bullet('A self-contained standalone version that runs without a build step (for embedding)'),
      bullet('The Open Source Founders Tree — a timeline from 1983 to 2026 with a Resource Guide'),
      bullet('The Open Source Tree — a dark-theme visualisation of the open source movement'),
      bullet('A Future Labs brand variant of the open source content'),
      bullet('30 US states of impact data, stored as a backup if the live feed is unavailable'),

      // Deployment plan
      h2('Deployment Plan'),
      body('Once validation passes, the tool will be deployed to Netlify — a hosting platform that automatically rebuilds the site whenever code is updated. A subdomain will be created at GoDaddy (where TCIA\'s DNS is managed) pointing to the deployment.'),
      body('No manual steps after initial setup. When research data is updated, the tool updates automatically.'),

      simpleTable(
        ['Step', 'What Happens', 'Who'],
        [
          ['1. Validate', 'Run tool with live data; confirm numbers and UI', 'aasim@tciamn.org'],
          ['2. Deploy to Netlify', 'Connect GitHub repo; set environment variables', 'aasim@tciamn.org'],
          ['3. DNS subdomain', 'Create CNAME at GoDaddy (e.g. data.tciamn.org)', 'aasim@tciamn.org'],
          ['4. Go live', 'Share link publicly; monitor for errors', 'TCIA team']
        ]
      ),

      // Cost
      h2('What Does It Cost?'),
      body('Netlify free tier covers this tool at current scale. No monthly hosting cost. The only cost is the Google Sheets API key, which is free within standard usage limits.'),

      // Long-term vision
      h2('Long-Term Vision — Where Holo Hosting Fits'),
      body('The current deployment (Phases 1–3) runs on standard web servers — Netlify for the tool, Hetzner or Infomaniak VPS for Future Labs infrastructure. These are cooperative in governance but conventional in technology.'),
      body('In Phase 4, Future Labs moves to Holochain — a distributed computing framework where each organisation holds its own cryptographically signed data with no central server. Holo Hosting is the commercial bridge that makes Holochain apps accessible to regular web browsers.'),
      body('Community members run small devices called HoloPorts and earn HOT tokens by serving app traffic to web visitors. For TCIA, this means the Data Center Impact Tool could eventually run with no central hosting cost and no single point of failure or control.'),
      callout('Timeline:', 'Holo Hosting is a Phase 4 consideration — 18 months or more out. It does not affect the current deployment plan.'),

      divider(),

      // Footer
      new Paragraph({
        children: [
          new TextRun({ text: 'TCIA / Future Labs · tciamn/Darkcenter · docs/ldl-data-center-tool.docx', size: 18, color: '6B7069' })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 }
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/home/user/Darkcenter/docs/ldl-data-center-tool.docx', buf);
  console.log('LDL written');
});

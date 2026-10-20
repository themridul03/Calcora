import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

const BASE_URL = 'https://calcora-roan.vercel.app';

const ROUTES = [
  {
    path: '/calculators/1099-vs-w2',
    title: '1099 vs W-2 Equalizer & Self-Employment Tax Calculator | Calcora',
    metaDesc: 'Calculate the exact 1099 contractor equivalent hourly rate to match a W-2 salary after self-employment tax (15.3%), QBI deduction, health insurance, and PTO.',
    heading: '1099 vs W-2 Contractor Equalizer & Tax Parity',
    subheading: 'Calculate your exact contractor billing rate to match salary take-home after self-employment tax, healthcare, and retirement benefits.',
    breadcrumbName: '1099 vs W-2 Equalizer',
  },
  {
    path: '/calculators/debt-payoff',
    title: 'Credit Card Debt Payoff Calculator — Avalanche vs Snowball | Calcora',
    metaDesc: 'Compare Debt Avalanche, Debt Snowball, and Consolidation Loans. See exact debt-free dates, interest saved, and visual amortization curves.',
    heading: 'Credit Card Debt Payoff Matrix & Strategy Engine',
    subheading: 'Compare mathematical Debt Avalanche against behavioral Debt Snowball and 0% balance transfer consolidation in real time.',
    breadcrumbName: 'Debt Payoff Matrix',
  },
  {
    path: '/calculators/rent-vs-buy',
    title: '2026 Rent vs Buy Calculator & S&P 500 Opportunity Cost | Calcora',
    metaDesc: 'Does buying build more wealth than renting? Compare mortgage interest, HOA, and property taxes against compounding down payments in index funds.',
    heading: '2026 Rent vs Buy Decision Engine & Wealth Modeler',
    subheading: 'Pit 6.5%+ mortgage interest, property taxes, and maintenance against compounding your down payment in broad-market index funds.',
    breadcrumbName: 'Rent vs Buy Engine',
  },
  {
    path: '/calculators/can-i-afford-it',
    title: 'Can I Afford This? Impulse Buy & Life-Hours Traded Calculator | Calcora',
    metaDesc: 'See how many hours of your life an impulse purchase actually costs, calculate S&P 500 compound growth opportunity cost, and apply the viral 72-Hour Rule.',
    heading: 'Can I Afford This? Impulse Buy & Life-Hours Calculator',
    subheading: 'Convert retail prices into exact hours of human life traded and calculate the 20-year S&P 500 compounding opportunity cost.',
    breadcrumbName: 'Can I Afford This?',
  },
  {
    path: '/calculators/fire-retirement',
    title: 'FIRE Calculator — Financial Independence & Early Retirement Age | Calcora',
    metaDesc: 'Calculate your exact FIRE Freedom Number using the Trinity Study 4% Safe Withdrawal Rule, Coast FIRE, Lean FIRE, and compounding investment runway.',
    heading: 'FIRE Retirement Freedom & Target Age Calculator',
    subheading: 'Calculate your exact Freedom Number using the Trinity Study 4% Safe Withdrawal Rule, Coast FIRE, and Lean/Fat milestones.',
    breadcrumbName: 'FIRE Retirement',
  },
  {
    path: '/calculators/job-offer-comparison',
    title: 'Job Offer Duel — Side-by-Side Salary & Cost of Living Comparison | Calcora',
    metaDesc: 'Compare two competing tech or remote job offers side-by-side. Factor in state income taxes, local rent, 401(k) matching, and real monthly disposable cash.',
    heading: 'Side-by-Side Job Offer Duel & Relocation Arbitrage',
    subheading: 'Pit two competing job offers against each other factoring in zero-tax states, local rents, and true disposable cash flow.',
    breadcrumbName: 'Job Offer Duel',
  },
  {
    path: '/uk/salary-sacrifice-calculator',
    title: 'UK 60% Marginal Tax Trap & Salary Sacrifice Calculator 2025/2026 | Calcora',
    metaDesc: 'Navigate the HMRC £100k–£125k personal allowance taper. Calculate pension salary sacrifice savings and 30-hour free childcare protection.',
    heading: 'UK 60% Marginal Tax Trap & Salary Sacrifice Optimizer',
    subheading: 'Escape the HMRC £100k–£125k personal allowance clawback and protect 30-hour free childcare subsidies using pension salary sacrifice.',
    breadcrumbName: 'UK Salary Sacrifice',
  },
  {
    path: '/suggestions',
    title: 'Smart Financial Insights & Feature Request Roadmap | Calcora',
    metaDesc: 'Actionable tax optimization hacks, S-Corp shielding tips, and community feature requests for Calcora.',
    heading: 'Financial Insights & Community Feature Roadmap',
    subheading: 'Actionable tax optimization strategies, capital allocation levers, and community-upvoted financial engineering roadmap.',
    breadcrumbName: 'Suggestions & Roadmap',
  },
];

function generateRoutes() {
  const baseHtmlPath = path.resolve(distDir, 'index.html');
  if (!fs.existsSync(baseHtmlPath)) {
    console.error(`Error: base dist/index.html not found at ${baseHtmlPath}`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(baseHtmlPath, 'utf8');

  console.log(`[SEO Prerender] Generating ${ROUTES.length} dedicated canonical routes...`);

  for (const route of ROUTES) {
    const canonicalUrl = `${BASE_URL}${route.path}`;

    // 1. Replace Title
    let html = baseHtml.replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`);

    // 2. Replace Meta Description
    html = html.replace(
      /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="description" content="${route.metaDesc}" />`
    );

    // 3. Replace Canonical
    html = html.replace(
      /<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i,
      `<link rel="canonical" href="${canonicalUrl}" />`
    );

    // 4. Replace OpenGraph & Twitter
    html = html.replace(
      /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:title" content="${route.title}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:description" content="${route.metaDesc}" />`
    );
    html = html.replace(
      /<meta\s+property=["']og:url["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );
    html = html.replace(
      /<meta\s+name=["']twitter:title["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:title" content="${route.title}" />`
    );
    html = html.replace(
      /<meta\s+name=["']twitter:description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:description" content="${route.metaDesc}" />`
    );
    html = html.replace(
      /<meta\s+name=["']twitter:url["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="twitter:url" content="${canonicalUrl}" />`
    );

    // 5. Pre-render Semantic Fallback Content inside <div id="root">
    const semanticContent = `
      <div class="min-h-screen bg-black text-zinc-100 font-sans p-6">
        <header class="max-w-7xl mx-auto py-4 border-b border-zinc-900 flex items-center justify-between">
          <a href="/" class="text-xl font-black text-white no-underline flex items-center gap-2">
            Calcora <span class="text-[10px] uppercase font-bold text-[#ff9f0a] bg-[#ff9f0a]/10 px-2 py-0.5 rounded-full border border-[#ff9f0a]/30"> Pro Suite</span>
          </a>
        </header>
        <main class="max-w-7xl mx-auto py-8 space-y-4">
          <nav aria-label="Breadcrumb" class="text-xs text-zinc-500">
            <a href="/" class="text-zinc-400 hover:text-white">Home</a> &gt; <span>Calculators</span> &gt; <span class="text-[#ff9f0a] font-medium">${route.breadcrumbName}</span>
          </nav>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">${route.heading}</h1>
          <p class="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">${route.subheading}</p>
          <div class="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 text-xs text-zinc-400">
            <p>${route.metaDesc}</p>
          </div>
        </main>
      </div>
    `.trim();

    html = html.replace('<div id="root"></div>', `<div id="root">${semanticContent}</div>`);

    // 6. Output to dist/path/index.html and dist/path.html
    const dirPath = path.resolve(distDir, route.path.replace(/^\//, ''));
    const indexFilePath = path.resolve(dirPath, 'index.html');
    const flatFilePath = path.resolve(distDir, `${route.path.replace(/^\//, '')}.html`);

    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(indexFilePath, html, 'utf8');

    // Also write flat .html file in case Vercel rewrites or direct file serving is used
    fs.mkdirSync(path.dirname(flatFilePath), { recursive: true });
    fs.writeFileSync(flatFilePath, html, 'utf8');

    console.log(`  ✓ Generated: ${route.path} -> ${indexFilePath}`);
  }

  console.log('[SEO Prerender] All routes successfully generated!');
}

generateRoutes();

/**
 * capture-ui.js
 * Automated UI screenshot tool for GHSS Management App.
 * Visits every route, logs in where required, and saves
 * desktop (1440x900) + mobile (390x844) screenshots.
 *
 * Run: node scripts/capture-ui.js
 */

const { chromium } = require('../frontend/node_modules/playwright');
const fs = require('fs');
const path = require('path');

// ─── Config ─────────────────────────────────────────────────────────────────
const BASE_URL   = 'http://localhost:5173';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin';
const TEACHER_USER = 'Kamal';
const TEACHER_PASS = 'Kamal';

const OUT_DESKTOP = path.join(__dirname, '..', 'screenshots', 'desktop');
const OUT_MOBILE  = path.join(__dirname, '..', 'screenshots', 'mobile');
const OUT_META    = path.join(__dirname, '..', 'screenshots', 'meta');
const UI_MAP_FILE = path.join(__dirname, '..', 'screenshots', 'ui-map.md');

// Route → component/css mapping (derived from App.jsx)
const PAGES = [
  {
    name: 'home',
    route: '/',
    label: 'Home',
    component: 'src/components/Home.jsx',
    css: 'src/index.css',
    public: true,
  },
  {
    name: 'teacher-login',
    route: '/TeacherLogin',
    label: 'Teacher Login',
    component: 'src/components/attendance/TeacherLogin.jsx',
    css: null,
    public: true,
  },
  {
    name: 'admin-login',
    route: '/admin',
    label: 'Admin Login',
    component: 'src/components/admin/AdminLogin.jsx',
    css: null,
    public: true,
  },
  {
    name: 'teacher-admin-login',
    route: '/teacherAdminLogin',
    label: 'Teacher+Admin Login',
    component: 'src/components/admin/TeacherAdminLogin.jsx',
    css: null,
    public: true,
  },
  // Protected — require admin login
  {
    name: 'student-list',
    route: '/studentlist',
    label: 'Student List',
    component: 'src/components/StudentList.jsx',
    css: null,
    requiresAuth: 'admin',
  },
  {
    name: 'teachers-list',
    route: '/TeachersList',
    label: 'Teachers List',
    component: 'src/components/teacher/TeachersList.jsx',
    css: null,
    requiresAuth: 'admin',
  },
  {
    name: 'admission',
    route: '/admission',
    label: 'Student Admission',
    component: 'src/components/registration/StudentForm.jsx',
    css: null,
    requiresAuth: 'admin',
  },
  {
    name: 'promote',
    route: '/promote',
    label: 'Class Promotion',
    component: 'src/components/studnetPromotion/ClassSelector.jsx',
    css: null,
    requiresAuth: 'admin',
  },
  {
    name: 'admin-registration',
    route: '/AdminRegistration',
    label: 'Admin Registration',
    component: 'src/components/admin/AdminRegistration.jsx',
    css: null,
    requiresAuth: 'admin',
  },
  {
    name: 'teacher-registration',
    route: '/TeacherRegistration',
    label: 'Teacher Registration',
    component: 'src/components/admin/TeacherRegistration.jsx',
    css: null,
    requiresAuth: 'admin',
  },
  {
    name: 'performance-dashboard',
    route: '/PerformanceDashboard',
    label: 'Performance Dashboard',
    component: 'src/components/attendance/pieChart/PerformanceDashboard.jsx',
    css: null,
    requiresAuth: 'teacher',
  },
  {
    name: 'take-attendance',
    route: '/TakeAtten',
    label: 'Take Attendance',
    component: 'src/components/attendance/TakeAtten.jsx',
    css: null,
    requiresAuth: 'teacher',
  },
  {
    name: 'update-attendance',
    route: '/updateAttenStatus',
    label: 'Update Attendance',
    component: 'src/components/attendance/UpdateAttenStatusOfClsSec.jsx',
    css: null,
    requiresAuth: 'teacher',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function ensureDirs() {
  [OUT_DESKTOP, OUT_MOBILE, OUT_META].forEach(d => fs.mkdirSync(d, { recursive: true }));
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Navigate to a URL and wait for network to settle + extra delay.
 */
async function goto(page, url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await wait(1500); // let dynamic content render
}

/**
 * Admin login — fills username/password on /admin and submits.
 * Returns true on success.
 */
async function loginAsAdmin(browser) {
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await goto(page, `${BASE_URL}/admin`);

  await page.fill('input[name="username"]', ADMIN_USER);
  await page.fill('input[name="password"]', ADMIN_PASS);
  await page.click('button[type="submit"]');

  // Wait up to 8s for redirect away from /admin
  try {
    await page.waitForURL(url => !url.includes('/admin'), { timeout: 8000 });
  } catch {
    console.warn('⚠  Admin login redirect timed-out — proceeding with cookies anyway.');
  }

  return { ctx, page };
}

/**
 * Teacher login — fills username/password on /TeacherLogin and submits.
 */
async function loginAsTeacher(browser) {
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await goto(page, `${BASE_URL}/TeacherLogin`);

  await page.fill('input[name="username"]', TEACHER_USER);
  await page.fill('input[name="password"]', TEACHER_PASS);
  await page.click('button[type="submit"]');

  try {
    await page.waitForURL(url => !url.includes('/TeacherLogin'), { timeout: 8000 });
  } catch {
    console.warn('⚠  Teacher login redirect timed-out — proceeding with cookies anyway.');
  }

  return { ctx, page };
}

/**
 * Capture desktop (1440×900) and mobile (390×844) screenshots for one page.
 */
async function capture(ctx, pageName, route) {
  const page = await ctx.newPage();

  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await goto(page, `${BASE_URL}${route}`);
  const desktopPath = path.join(OUT_DESKTOP, `${pageName}-desktop.png`);
  await page.screenshot({ path: desktopPath, fullPage: true });
  console.log(`  📸 Desktop → ${desktopPath}`);

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await wait(600); // let layout reflow
  await page.screenshot({ path: path.join(OUT_MOBILE, `${pageName}-mobile.png`), fullPage: true });
  console.log(`  📱 Mobile  → screenshots/mobile/${pageName}-mobile.png`);

  await page.close();
}

/**
 * Write a .txt metadata file for a page.
 */
function writeMeta(p) {
  const content = [
    `Route: ${p.route}`,
    `Desktop screenshot: screenshots/desktop/${p.name}-desktop.png`,
    `Mobile screenshot:  screenshots/mobile/${p.name}-mobile.png`,
    `Component file: ${p.component}`,
    `CSS file: ${p.css ?? 'src/index.css (shared)'}`,
    `Auth required: ${p.requiresAuth ?? 'none'}`,
  ].join('\n');
  fs.writeFileSync(path.join(OUT_META, `${p.name}.txt`), content);
}

/**
 * Build the ui-map.md file from PAGES config.
 */
function buildUiMap(results) {
  const lines = ['# UI Screenshot Map', ''];
  for (const { page, ok } of results) {
    lines.push(`## ${page.label}`);
    lines.push(`- Route: \`${page.route}\``);
    lines.push(`- Desktop screenshot: \`screenshots/desktop/${page.name}-desktop.png\``);
    lines.push(`- Mobile screenshot: \`screenshots/mobile/${page.name}-mobile.png\``);
    lines.push(`- Component file: \`${page.component}\``);
    lines.push(`- CSS file: \`${page.css ?? 'src/index.css (shared)'}\``);
    lines.push(`- Auth required: \`${page.requiresAuth ?? 'none'}\``);
    lines.push(`- Status: ${ok ? '✅ Captured' : '❌ Failed'}`);
    lines.push('');
  }
  fs.writeFileSync(UI_MAP_FILE, lines.join('\n'));
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  ensureDirs();

  // Point directly at the already-downloaded Chrome for Testing binary
  const execPath = 'C:\\Users\\salim\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
  const browser = await chromium.launch({ headless: true, executablePath: execPath });
  const results = [];

  // ── Admin-authenticated context ──────────────────────────────────────────
  console.log('\n🔐 Logging in as admin…');
  const { ctx: adminCtx } = await loginAsAdmin(browser);

  // ── Teacher-authenticated context ────────────────────────────────────────
  console.log('🔐 Logging in as teacher…');
  const { ctx: teacherCtx } = await loginAsTeacher(browser);

  // ── Public context (no auth) ─────────────────────────────────────────────
  const publicCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // ── Screenshot each route ─────────────────────────────────────────────────
  for (const p of PAGES) {
    console.log(`\n▶ ${p.label} (${p.route})`);
    try {
      const ctx = p.requiresAuth === 'admin'
        ? adminCtx
        : p.requiresAuth === 'teacher'
          ? teacherCtx
          : publicCtx;

      await capture(ctx, p.name, p.route);
      writeMeta(p);
      results.push({ page: p, ok: true });
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
      results.push({ page: p, ok: false, error: err.message });
    }
  }

  buildUiMap(results);
  await browser.close();

  // ── Summary ───────────────────────────────────────────────────────────────
  const ok   = results.filter(r => r.ok);
  const fail = results.filter(r => !r.ok);

  console.log('\n─────────────────────────────────────────────');
  console.log(`✅  Captured: ${ok.length} / ${results.length} pages`);
  if (fail.length) {
    console.log(`❌  Failed (${fail.length}):`);
    fail.forEach(r => console.log(`   • ${r.page.label}: ${r.error}`));
  }
  console.log(`📄  UI map written → screenshots/ui-map.md`);
  console.log('─────────────────────────────────────────────\n');
})();

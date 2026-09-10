// Verifies Supabase + AI keys and that the DB schema is applied.
// Run with:  pnpm check-setup
// (package.json passes --env-file=.env.local so process.env is populated.)

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const aiProvider = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
const geminiKey = process.env.GEMINI_API_KEY;
const groqKey = process.env.GROQ_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;

const ok = (m) => console.log(`  ✅ ${m}`);
const bad = (m) => console.log(`  ❌ ${m}`);
const warn = (m) => console.log(`  ⚠️  ${m}`);

let failures = 0;

async function checkTable(table) {
  const res = await fetch(
    `${url}/rest/v1/${table}?select=*&limit=1`,
    { headers: { apikey: anon, Authorization: `Bearer ${anon}` } },
  );
  if (res.ok) {
    ok(`table "${table}" is reachable`);
    return;
  }
  const body = await res.text();
  if (res.status === 401) {
    bad(`table "${table}": 401 — the anon key looks invalid`);
  } else if (/does not exist|could not find the table|PGRST205/i.test(body)) {
    bad(`table "${table}" is missing — run supabase/schema.sql in the SQL Editor`);
  } else {
    bad(`table "${table}": HTTP ${res.status} — ${body.slice(0, 160)}`);
  }
  failures++;
}

async function checkSupabase() {
  console.log("\nSupabase:");
  if (!url || !anon) {
    warn("not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (guest mode active)");
    return;
  }
  try {
    const res = await fetch(`${url}/auth/v1/health`, { headers: { apikey: anon } });
    if (res.ok) ok("auth endpoint reachable");
    else warn(`auth health returned HTTP ${res.status}`);
  } catch (e) {
    bad(`cannot reach ${url} — ${e.message}`);
    failures++;
    return;
  }
  await checkTable("diagnostic_results");
  await checkTable("review_cards");
  await checkTable("daily_scores");
  await checkRpc();
}

async function checkRpc() {
  const res = await fetch(`${url}/rest/v1/rpc/bump_ai_usage`, {
    method: "POST",
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_identity: "setup-check", p_limit: 1000000 }),
  });
  if (res.ok) {
    ok("AI rate-limit function installed");
    return;
  }
  const body = await res.text();
  if (res.status === 404 || /could not find the function|PGRST202/i.test(body)) {
    warn("AI rate-limit function missing — run supabase/schema.sql (AI works unlimited until then)");
  } else {
    warn(`bump_ai_usage check: HTTP ${res.status}`);
  }
}

async function checkGemini(key) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`,
  );
  if (res.ok) {
    ok("Gemini API key is valid");
  } else {
    bad(`Gemini key rejected — HTTP ${res.status}`);
    failures++;
  }
}

async function checkAI() {
  console.log(`\nAI provider (${aiProvider}):`);
  const key =
    aiProvider === "groq" ? groqKey : aiProvider === "anthropic" ? anthropicKey : geminiKey;
  if (!key) {
    warn(`no API key set for "${aiProvider}" — AI features are disabled (app still works)`);
    return;
  }
  if (aiProvider === "gemini") {
    await checkGemini(key);
  } else {
    ok(`${aiProvider} key present (not test-called)`);
  }
}

console.log("Checking setup…");
await checkSupabase();
await checkAI();

console.log(
  failures === 0
    ? "\n✅ All configured checks passed."
    : `\n❌ ${failures} check(s) failed — see above.`,
);
process.exit(failures === 0 ? 0 : 1);

import { createClient } from "@/lib/supabase/server";

// Hybrid daily AI rate limit: guests are capped low, signed-in users higher.
// Backed by a Supabase security-definer function (no extra infra).
// Fails OPEN when Supabase isn't configured or the function is missing, so it
// never breaks AI in local dev or before the SQL migration is applied.

const GUEST_DAILY = Number(process.env.AI_DAILY_LIMIT_GUEST ?? 5);
const USER_DAILY = Number(process.env.AI_DAILY_LIMIT_USER ?? 50);

function getIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * A per-day, non-reversible key for a guest.
 *
 * The counter table used to hold the raw IP address, which is personal data we
 * have no use for — we only ever ask "has this visitor had five calls today?".
 * Hashing with a rotating daily salt answers exactly that and nothing else: the
 * value cannot be turned back into an address, and it cannot be used to link a
 * visitor across days.
 */
async function guestIdentity(req: Request): Promise<string> {
  const raw = `${getIp(req)}|${new Date().toISOString().slice(0, 10)}|${
    process.env.RATE_LIMIT_SALT ?? "cog"
  }`;
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(raw),
  );
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `g:${hex.slice(0, 32)}`;
}

export async function checkAiRateLimit(
  req: Request,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: true }; // Supabase not configured → allow

  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    const identity = user ? `u:${user.id}` : await guestIdentity(req);
    const limit = user ? USER_DAILY : GUEST_DAILY;

    const { data, error } = await supabase.rpc("bump_ai_usage", {
      p_identity: identity,
      p_limit: limit,
    });
    if (error) return { ok: true }; // function missing/other → fail open
    return { ok: data !== false };
  } catch {
    return { ok: true };
  }
}

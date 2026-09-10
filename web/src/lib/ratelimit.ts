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

export async function checkAiRateLimit(
  req: Request,
): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  if (!supabase) return { ok: true }; // Supabase not configured → allow

  try {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    const identity = user ? `u:${user.id}` : `ip:${getIp(req)}`;
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

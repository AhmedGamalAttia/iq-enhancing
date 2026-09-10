import type { Skill, SkillKey } from "@/lib/types";

// Visual metadata for the cognitive dimensions. Localized names/descriptions
// live in the i18n messages (`messages.skills[key]`); here we keep only the
// language-independent icon and accent color.
export const SKILLS: Record<SkillKey, Skill> = {
  abstract: { key: "abstract", icon: "◈", accent: "#a78bfa", accentText: "var(--skill-abstract)" },
  logical: { key: "logical", icon: "🧩", accent: "#7c6cff", accentText: "var(--skill-logical)" },
  verbal: { key: "verbal", icon: "📖", accent: "#2dd4bf", accentText: "var(--skill-verbal)" },
  working_memory: { key: "working_memory", icon: "🧠", accent: "#f59e0b", accentText: "var(--skill-working-memory)" },
  numeracy: { key: "numeracy", icon: "🔢", accent: "#38bdf8", accentText: "var(--skill-numeracy)" },
  critical: { key: "critical", icon: "🔍", accent: "#fb7185", accentText: "var(--skill-critical)" },
};

export const SKILL_LIST: Skill[] = Object.values(SKILLS);

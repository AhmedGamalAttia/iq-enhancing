import type { Skill, SkillKey } from "@/lib/types";

// Visual metadata for the cognitive dimensions. Localized names/descriptions
// live in the i18n messages (`messages.skills[key]`); here we keep only the
// language-independent icon and accent color.
export const SKILLS: Record<SkillKey, Skill> = {
  logical: { key: "logical", icon: "🧩", accent: "#7c6cff" },
  verbal: { key: "verbal", icon: "📖", accent: "#2dd4bf" },
  working_memory: { key: "working_memory", icon: "🧠", accent: "#f59e0b" },
  numeracy: { key: "numeracy", icon: "🔢", accent: "#38bdf8" },
  critical: { key: "critical", icon: "🔍", accent: "#fb7185" },
};

export const SKILL_LIST: Skill[] = Object.values(SKILLS);

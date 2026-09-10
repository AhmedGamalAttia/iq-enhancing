// Site-wide constants that are not translations.
//
// Kept out of `src/i18n/messages.ts` on purpose: these are single values that
// appear identically in both languages, and the legal pages need them at build
// time without pulling in the whole dictionary.

/** Set this before launch — it is shown on the legal pages as the contact address. */
export const CONTACT_EMAIL = "REPLACE_ME@example.com";
export const SITE_NAME_AR = "منصّة تنمية القدرات المعرفية";
export const SITE_NAME_EN = "Cognitive Skills Platform";

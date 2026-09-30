/**
 * The language boot script, kept in a plain module (no "use client") on purpose.
 *
 * app/layout.tsx is a server component. Anything it imports from a "use client" file
 * (components/lang.tsx) arrives as a client reference, not as a value — so the boot
 * <script> in <head> used to reach the browser as a lazy element that could only be
 * resolved once lang.tsx's JS chunk had loaded. When that chunk wasn't in yet (e.g. a
 * case study opened after /experience, with the other chunks already cached), React's
 * hydration suspended inside <head>, resumed out of step with <body>, failed (React
 * error #418) and re-rendered the whole root — which reset <html> and dropped the
 * data-lang / lang the script had set, so 中 mode showed English. Importing the string
 * from here keeps it a plain value in the server render.
 */

export const LANG_STORAGE_KEY = "pw-lang";

/** runs in <head> before paint: restore the visitor's language (and `<html lang>`, so
    screen readers switch voice with it — see setLang in components/lang-toggle.tsx) */
export const LANG_BOOT_SCRIPT = `try{var l=localStorage.getItem("${LANG_STORAGE_KEY}");if(l==="zh"){document.documentElement.dataset.lang="zh";document.documentElement.lang="zh-CN";}}catch(e){}`;

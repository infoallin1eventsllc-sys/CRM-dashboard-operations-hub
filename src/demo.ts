/// <reference types="vite/client" />

/**
 * Demonstration mode.
 *
 * The marketing site hosts a click-through copy of this CRM at
 * meridianinterface.com/demos/meridian-crm/. A visitor there has no Google
 * account on the owner allowlist and there is no Express server behind the
 * page, so two things have to change for the copy to work at all:
 *
 *   1. Data lives in localStorage instead of Firestore, seeded with the same
 *      sample records the app has always shipped with. CRMContext already has
 *      this path (it is the fallback when Firestore is unreachable); demo mode
 *      just opts into it from the start and skips the sign-in gate.
 *   2. Calls to the Gemini proxy are answered locally with a short note that
 *      the copilot is off in the demonstration. The app's own error handling
 *      would otherwise show a "verify your GEMINI_API_KEY" message that means
 *      nothing to a prospective client.
 *
 * Build with VITE_DEMO_MODE=true to get this behaviour. A normal build is
 * unaffected: the flag is baked in at build time and defaults to off.
 */
export const IS_DEMO = import.meta.env.VITE_DEMO_MODE === "true";

const DEMO_AI_NOTE =
  "This is a demonstration copy of Meridian CRM, so the AI copilot is switched off here. " +
  "In the live product this request goes to Google Gemini through Meridian's own server, " +
  "which holds the API key, so nothing sensitive ever reaches the browser. " +
  "Everything else on this page works: add a lead, move a task, mark an invoice paid, or switch on privacy mode.";

/** Answer Gemini proxy calls locally so the demo never shows a server error. */
export function installDemoMode() {
  if (!IS_DEMO || typeof window === "undefined") return;

  const realFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url.startsWith("/api/gemini/")) {
      const body = url.includes("/search")
        ? { text: DEMO_AI_NOTE, links: [], queries: [] }
        : { text: DEMO_AI_NOTE };
      return Promise.resolve(
        new Response(JSON.stringify(body), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );
    }
    return realFetch(input, init);
  };
}

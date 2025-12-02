// pages/api/mw-verify.js  (Node runtime — safe to import heavy libs)
import { getAuth } from "@clerk/nextjs/server";

/**
 * NOTE about Arcjet:
 * - If you have a server-side Arcjet SDK, use it here.
 * - The snippet below demonstrates a safe HTTP call to an Arcjet evaluation endpoint.
 * - Replace the fetch to Arcjet with the official server SDK call if available.
 */

export default async function handler(req, res) {
  try {
    // Clerk server-side check (does NOT require clerkMiddleware in Edge)
    // getAuth reads cookies/headers from the incoming request on the server.
    const { userId, sessionId } = getAuth(req);

    if (!userId) {
      // Not authenticated
      return res.status(401).json({ ok: false, reason: "not_authenticated" });
    }

    // Optional: Run Arcjet evaluation (server-side)
    // Example: call Arcjet HTTP API. Replace with your actual Arcjet usage.
    // Provide minimal context: ip, path, user-agent, maybe userId (if you want)
    const arcjetKey = process.env.ARCJET_KEY;
    if (!arcjetKey) {
      // If you don't have Arcjet configured, allow by default (or deny as needed)
      console.warn("ARCJET_KEY not configured — skipping Arcjet checks");
      return res.status(200).json({ ok: true, userId });
    }

    // Build evaluation payload (adjust fields per Arcjet API / SDK)
    const originIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const payload = {
      ip: originIp,
      path: req.headers["x-original-path"] || req.url,
      userAgent: req.headers["user-agent"] || "",
      // optional: you may want to include the userId as an attribute
      userId,
    };

    // Replace URL below with the correct Arcjet server API endpoint if different.
    // If you have an official server SDK, use that instead of this HTTP call.
    const arcjetRes = await fetch("https://api.arcjet.com/v1/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${arcjetKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!arcjetRes.ok) {
      // Arcjet service error — choose policy: allow or block. We'll allow to avoid lockout.
      console.error("Arcjet evaluation error:", await arcjetRes.text());
      return res.status(200).json({ ok: true, userId });
    }

    const arcjetJson = await arcjetRes.json();
    // Arcjet's real response shape may differ. Adapt these checks to your response.
    // Typical fields: { verdict: 'allow'|'block'|'challenge', block: true/false, reason: '...' }
    const blocked = !!(arcjetJson?.block || arcjetJson?.verdict === "block" || arcjetJson?.action === "block");

    if (blocked) {
      // Deny
      return res.status(403).json({ ok: false, reason: "blocked_by_arcjet" });
    }

    // Passed all checks
    return res.status(200).json({ ok: true, userId });
  } catch (err) {
    console.error("mw-verify error:", err);
    // On unexpected server error, return 500. Middleware will choose fallback behavior.
    return res.status(500).json({ ok: false, error: String(err) });
  }
}

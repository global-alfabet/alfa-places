// Sends a confirmation email to whoever fills in one of this site's forms. Netlify runs a function with this exact
// name (submission-created) whenever Netlify Forms accepts a submission; spam it filters out never gets here.
// Our own notification to hello@ is Netlify's (its subject comes from the form's hidden "subject" field).
//
// Netlify environment variables (Site configuration → Environment variables, scope "Functions"):
//   RESEND_API_KEY  from resend.com, for a domain verified there (globalalfabet.com). Without it nothing is sent.
//   MAIL_FROM       optional, default "Global Alfabet <hello@globalalfabet.com>"
//   REPLY_TO        optional, default hello@globalalfabet.com
// The email doesn't repeat what the person wrote: an auto-reply that echoes text could be used to send spam to
// someone else's address.
const SITE = "Alfa Finda";
const SITE_URL = "https://finda.globalalfabet.com";
// What each form is about, in the person's words. Keys are the forms' name attributes.
const FORMS = {
  "add-business": { what: "your business details", next: "We check every listing before it goes live, and we'll get back to you by email soon." },
};

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const firstName = (name) => String(name || "").trim().split(/\s+/)[0].replace(/[^\p{L}\p{M}'-]/gu, "").slice(0, 40);

export const handler = async (event) => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { statusCode: 200, body: "No RESEND_API_KEY: confirmation not sent." };
  let payload;
  try {
    payload = JSON.parse(event.body || "{}").payload || {};
  } catch {
    return { statusCode: 400, body: "Bad payload." };
  }
  const data = payload.data || {};
  const to = String(data.email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || to.length > 160) return { statusCode: 200, body: "No valid email: nothing sent." };
  const form = FORMS[payload.form_name] || FORMS["add-business"];
  const who = firstName(data.firstName || data.name || data.contactName || data.owner);
  const hi = who ? `Hi ${who},` : "Hello,";
  const subject = `We've received ${form.what} · ${SITE}`;
  const text = [
    hi,
    "",
    `Thank you for contacting ${SITE}. We've received ${form.what}.`,
    form.next,
    "",
    "If you need to add anything, just reply to this email.",
    "",
    "Kind regards,",
    `The ${SITE} team`,
    "Global Alfabet",
    SITE_URL,
    "",
    "You're getting this because this email address was entered in a form on our website. If that wasn't you, you can ignore it.",
  ].join("\n");
  const html = `<!doctype html><html><body style="margin:0;background:#f5f5f7;font-family:-apple-system,'Segoe UI',Inter,Arial,sans-serif;color:#1d1d1f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:32px 16px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;padding:36px 32px">
<tr><td style="font-size:13px;font-weight:600;color:#6e6e73;padding-bottom:18px">${esc(SITE)}</td></tr>
<tr><td style="font-size:26px;line-height:1.15;font-weight:700;letter-spacing:-0.5px;padding-bottom:16px">We've received ${esc(form.what)}.</td></tr>
<tr><td style="font-size:15px;line-height:1.55;padding-bottom:12px">${esc(hi)}</td></tr>
<tr><td style="font-size:15px;line-height:1.55;padding-bottom:12px">Thank you for contacting ${esc(SITE)}. ${esc(form.next)}</td></tr>
<tr><td style="font-size:15px;line-height:1.55;padding-bottom:24px">If you need to add anything, just reply to this email.</td></tr>
<tr><td style="font-size:15px;line-height:1.55">Kind regards,<br>The ${esc(SITE)} team<br><a href="${esc(SITE_URL)}" style="color:#1d1d1f">${esc(SITE_URL.replace(/^https?:\/\//, ""))}</a></td></tr>
</table>
<p style="max-width:560px;font-size:12px;line-height:1.5;color:#86868b;margin:16px auto 0">You're getting this because this email address was entered in a form on our website. If that wasn't you, you can ignore it.</p>
</td></tr></table></body></html>`;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.MAIL_FROM || "Global Alfabet <hello@globalalfabet.com>",
      to: [to],
      reply_to: process.env.REPLY_TO || "hello@globalalfabet.com",
      subject,
      text,
      html,
    }),
  });
  if (!r.ok) {
    console.error(`Confirmation email failed (${r.status}): ${(await r.text().catch(() => "")).slice(0, 300)}`);
    return { statusCode: 502, body: "Email failed." };
  }
  return { statusCode: 200, body: "Sent." };
};

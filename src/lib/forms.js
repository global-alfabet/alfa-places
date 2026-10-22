// Sends a form to Netlify Forms. The form also needs a hidden copy in index.html so Netlify detects it at build time.
export async function submitNetlifyForm(formName, data) {
  const body = new URLSearchParams({ "form-name": formName, ...data }).toString();
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Form failed with status ${res.status}`);
}

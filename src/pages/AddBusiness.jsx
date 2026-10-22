import { useState } from "react";
import { Link } from "react-router-dom";
import { categories, towns } from "../content/categories.js";
import { site } from "../config.js";
import { submitNetlifyForm } from "../lib/forms.js";
import { usePageTitle } from "../lib/usePageTitle.js";
import Icon from "../components/Icon.jsx";

// Field names must match the hidden "add-business" form in index.html, or Netlify drops them.
const PAYMENTS = ["Cash", "Cards", "EcoCash", "InnBucks", "OneMoney", "Bank transfer"];

export default function AddBusiness() {
  usePageTitle(
    "Add your business",
    "List your business on Alfa Places so customers and travellers in Zimbabwe can find you.",
  );
  const [state, setState] = useState("idle");
  const [category, setCategory] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    data.payments = new FormData(form).getAll("payments").join(", ");
    setState("sending");
    try {
      await submitNetlifyForm("add-business", data);
      setState("sent");
      form.reset();
      window.scrollTo(0, 0);
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div className="container page narrow center sent">
        <span className="sent-icon">
          <Icon name="check" size={36} stroke={2.2} />
        </span>
        <h1>Thanks. We've got your business.</h1>
        <p className="lead">We'll check the details and get back to you. Your listing goes live once it's approved.</p>
        <p>
          <Link className="btn" to="/">
            Back to Alfa Places
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container page narrow">
      <div className="page-head">
        <p className="eyebrow">For businesses</p>
        <h1>Add your business.</h1>
        <p className="lead">
          Tell us about your business and how customers can reach you. We check every listing before it goes live, and
          we'll contact you if anything needs changing.
        </p>
      </div>

      <form className="form" name="add-business" method="POST" onSubmit={submit}>
        <input type="hidden" name="form-name" value="add-business" />
        <p hidden>
          <label>
            Leave this empty <input name="bot-field" />
          </label>
        </p>

        <fieldset className="panel">
          <legend>Your business</legend>
          <label className="field">
            <span>Business name</span>
            <input name="businessName" required autoComplete="organization" />
          </label>
          <div className="row">
            <label className="field">
              <span>Category</span>
              <select name="category" required value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="" disabled>
                  Choose one
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="Other">Something else</option>
              </select>
            </label>
            <label className="field">
              <span>Town</span>
              <input name="town" required list="towns" autoComplete="address-level2" />
              <datalist id="towns">
                {towns.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </label>
          </div>
          {category === "Other" && (
            <label className="field">
              <span>What kind of business is it?</span>
              <input name="otherCategory" required />
            </label>
          )}
          <label className="field">
            <span>Street address (optional)</span>
            <input name="address" autoComplete="street-address" />
          </label>
          <label className="field">
            <span>What does your business do?</span>
            <textarea
              name="description"
              rows="4"
              required
              maxLength="600"
              placeholder="Two or three sentences customers will read first."
            />
          </label>
          <label className="field">
            <span>Main services or products (optional)</span>
            <textarea name="services" rows="3" placeholder="One per line" />
          </label>
          <label className="field">
            <span>Opening hours (optional)</span>
            <input name="hours" placeholder="e.g. Mon–Fri 8:00–17:00, Sat 9:00–13:00" />
          </label>
          <div className="field">
            <span>Payments you take</span>
            <div className="checks">
              {PAYMENTS.map((p) => (
                <label key={p} className="check">
                  <input type="checkbox" name="payments" value={p} /> {p}
                </label>
              ))}
            </div>
          </div>
          <label className="check">
            <input type="checkbox" name="delivery" value="Yes" /> We deliver
          </label>
        </fieldset>

        <fieldset className="panel">
          <legend>How customers reach you</legend>
          <div className="row">
            <label className="field">
              <span>Phone</span>
              <input name="phone" type="tel" required autoComplete="tel" placeholder="+263" />
            </label>
            <label className="field">
              <span>WhatsApp (optional)</span>
              <input name="whatsapp" type="tel" placeholder="+263" />
            </label>
          </div>
          <div className="row">
            <label className="field">
              <span>Email</span>
              <input name="email" type="email" required autoComplete="email" />
            </label>
            <label className="field">
              <span>Website or social page (optional)</span>
              <input name="website" type="url" placeholder="https://" />
            </label>
          </div>
        </fieldset>

        <fieldset className="panel">
          <legend>About you</legend>
          <div className="row">
            <label className="field">
              <span>Your name</span>
              <input name="contactName" required autoComplete="name" />
            </label>
            <label className="field">
              <span>Your role</span>
              <input name="contactRole" placeholder="e.g. Owner, Manager" />
            </label>
          </div>
          <label className="check">
            <input type="checkbox" name="consent" value="Yes" required /> I own or manage this business, the details are
            correct, and Alfa Places may publish them.
          </label>
        </fieldset>

        <div className="form-actions">
          <button className="btn" type="submit" disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Send for review"}
          </button>
          {state === "error" && (
            <p className="error" role="alert">
              That didn't send. Please try again, or email us at <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          )}
        </div>
        <p className="note">
          We use these details to review and publish your listing. See our <Link to="/privacy">privacy notice</Link>.
        </p>
      </form>
    </div>
  );
}

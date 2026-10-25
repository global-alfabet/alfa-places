import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../components/Icon.jsx";
import { KINDS } from "../../lib/kinds.js";
import { useDirectory, useStore } from "../../lib/store.js";
import { ownerOf } from "../../content/demo-dashboard.js";
import { usePageTitle } from "../../lib/usePageTitle.js";
import { asset } from "../../lib/asset.js";

// Figma "Login", for the test version: no passwords. Sign-in arrives with the Global Alfabet Account; until then
// anyone can open the test dashboards as one of the example businesses, or as the Alfa Finda team.
export default function SignIn() {
  usePageTitle("Sign in");
  const { state, dispatch } = useStore();
  const examples = useDirectory(true).filter((b) => b.example);
  const [id, setId] = useState(state.ownerId);
  const navigate = useNavigate();
  const b = examples.find((x) => x.id === id) || examples[0];
  const owner = ownerOf(b);

  const open = (e) => {
    e.preventDefault();
    dispatch({ type: "owner", id: b.id });
    navigate("/dashboard");
  };

  return (
    <div className="signin-page">
      <div className="signin">
        <img src={asset("/alfa-finda-icon.svg")} alt="" width="64" height="64" />
        <h1>Business sign-in</h1>
        <p className="muted">Manage your listing, reviews and messages.</p>

        <form className="card signin-card form" onSubmit={open}>
          <p className="example-note">
            <Icon name="info" size={18} />
            <span>
              Test version: sign-in arrives with the Global Alfabet Account. Pick an example business to try its
              dashboard. No password needed.
            </span>
          </p>
          <label className="field">
            <span>Sign in as</span>
            <select value={b.id} onChange={(e) => setId(e.target.value)}>
              {Object.keys(KINDS).map((k) => (
                <optgroup key={k} label={KINDS[k].plural}>
                  {examples
                    .filter((x) => x.kind === k)
                    .map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Email address</span>
            <input value={owner.email} readOnly aria-describedby="signin-email-note" />
            <small id="signin-email-note" className="note">
              {owner.name}, {owner.role.toLowerCase()} (made up)
            </small>
          </label>
          <button className="btn btn-block" type="submit">
            Open the business dashboard
          </button>
          <div className="or">
            <span>Alfa Finda team</span>
          </div>
          <Link className="btn btn-block btn-outline" to="/admin">
            <Icon name="shield" size={18} /> Open the admin dashboard
          </Link>
          <p className="signin-foot">
            New business? <Link to="/add-your-business">Add your business</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

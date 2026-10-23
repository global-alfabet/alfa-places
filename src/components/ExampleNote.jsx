import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

// Shown wherever example listings appear, so nobody mistakes them for real businesses.
export default function ExampleNote() {
  return (
    <p className="example-note">
      <Icon name="info" size={18} />
      <span>
        Alfa Finda is launching. Listings marked Example show how a listing will look. They aren't real businesses.{" "}
        <Link to="/add-your-business">Add yours</Link> to be one of the first.
      </span>
    </p>
  );
}

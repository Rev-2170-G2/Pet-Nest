import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <Link to="/about" className="footer-link">About Us</Link>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>
            <Link to="/terms" className="footer-small-link">Terms & Conditions</Link> | © 2025 PetNest
          </p>
        </div>
      </div>
    </footer>
  );
}
export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">
        New Prince <span>Digilab</span>
      </div>
      <div className="footer-copy">
        © {new Date().getFullYear()} New Prince Digilab, Mysuru. All rights reserved.
      </div>
      <div className="footer-tag">Premium Photo Lab · Mysuru · Karnataka</div>
    </footer>
  );
}

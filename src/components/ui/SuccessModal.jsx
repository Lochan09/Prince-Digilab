export default function SuccessModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal open">
      <div className="modal-box">
        <div className="modal-icon">🎉</div>
        <div className="modal-title">Order Received!</div>
        <div className="modal-msg">
          Thank you! We'll contact you shortly to confirm your order and guide you
          through the next steps.
        </div>
        <button className="modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

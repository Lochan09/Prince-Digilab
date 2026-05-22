export default function SuccessModal({ open, order, onClose, onViewOrders }) {
  if (!open) return null;

  const date = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="modal open">
      <div className="modal-box modal-box--order">
        <div className="modal-icon">🎉</div>
        <div className="modal-title">Order Placed!</div>

        {order && (
          <div className="modal-order-summary">
            <div className="modal-order-id">Order ID: <strong>{order.id}</strong></div>
            <div className="modal-order-grid">
              <span>Name</span><span>{order.name}</span>
              <span>Product</span><span>{order.productCategory}</span>
              {order.albumSize  && <><span>Size</span><span>{order.albumSize}</span></>}
              {order.designCode && <><span>Design</span><span>{order.designCode}</span></>}
              {order.photoCount > 0 && <><span>Photos</span><span>{order.photoCount} uploaded</span></>}
              {date && <><span>Date</span><span>{date}</span></>}
            </div>
          </div>
        )}

        <div className="modal-msg">
          We'll contact you shortly to confirm your order and guide you through the next steps.
        </div>

        <div className="modal-actions">
          <button className="modal-view-btn" onClick={onViewOrders}>My Orders</button>
          <button className="modal-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

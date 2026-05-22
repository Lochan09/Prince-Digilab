import { useState, useRef } from 'react';
import SuccessModal from '../ui/SuccessModal';
import { EMPTY_FORM, ALBUM_SIZES, OCCASIONS, PRODUCT_CATEGORIES } from '../../data/constants';

const ORDER_FEATURES = [
  'Over 72 exclusive NPL pad album designs',
  'Luxury wood, gold hardware & leather finishes',
  'LED & suitcase combo packages available',
  'Custom text, names and dates embossed',
  'Quick turnaround — 5 to 10 working days',
  'Upload your photos directly from your device',
];

export default function OrderSection() {
  const [form,           setForm]           = useState(EMPTY_FORM);
  const [submitting,     setSubmitting]     = useState(false);
  const [successOpen,    setSuccessOpen]    = useState(false);
  const [selectedFiles,  setSelectedFiles]  = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0); // 0-100

  const folderInputRef = useRef(null);

  function field(name) {
    return e => setForm(f => ({ ...f, [name]: e.target.value }));
  }

  function handleFileChange(e) {
    const incoming = Array.from(e.target.files);
    if (!incoming.length) return;
    setSelectedFiles(prev => {
      const existing = new Set(prev.map(f => f.name + f.size));
      return [...prev, ...incoming.filter(f => !existing.has(f.name + f.size))];
    });
    e.target.value = '';
  }

  function removeFile(idx) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setUploadProgress(0);

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    selectedFiles.forEach(f => fd.append('photos', f));

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setSubmitting(false);
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          setForm(EMPTY_FORM);
          setSelectedFiles([]);
          setUploadProgress(0);
          setSuccessOpen(true);
        } else {
          alert('Error: ' + (data.error || 'Unable to submit order.') + '\nPlease call us: 0821-4264066');
        }
      } catch {
        alert('Unexpected error. Please call us: 0821-4264066');
      }
    };

    xhr.onerror = () => {
      setSubmitting(false);
      alert('Network error. Please call us: 0821-4264066');
    };

    xhr.open('POST', '/api/orders');
    xhr.send(fd);
  }

  const totalSize = selectedFiles.reduce((s, f) => s + f.size, 0);
  const sizeMB    = (totalSize / 1024 / 1024).toFixed(1);

  return (
    <>
      <section className="order-section" id="order">
        {/* Left panel */}
        <div className="order-left">
          <div className="sec-label">Book Your Order</div>
          <h2 className="sec-title">Preserve Your <em>Moments</em></h2>
          <p className="sec-sub">
            Visit us in Mysuru or fill the form and we'll help you pick the perfect design.
          </p>
          <div className="order-features">
            {ORDER_FEATURES.map(f => (
              <div key={f} className="order-feat">{f}</div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="order-right">
          <div className="form-title">Place an Order</div>
          <div className="form-sub">We'll contact you shortly to confirm</div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input value={form.name} onChange={field('name')} type="text" placeholder="Prince" required />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input value={form.phone} onChange={field('phone')} type="tel" placeholder="9876543210" required />
              </div>
            </div>

            <div className="form-group">
              <label>Your Email Address *</label>
              <input value={form.email} onChange={field('email')} type="email" placeholder="yourname@gmail.com" required />
            </div>

            <div className="form-group">
              <label>Product Category *</label>
              <select value={form.productCategory} onChange={field('productCategory')} required>
                <option value="">— Select Category —</option>
                {PRODUCT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Design Code</label>
                <input value={form.designCode} onChange={field('designCode')} type="text" placeholder="P-07" />
              </div>
              <div className="form-group">
                <label>Album Size</label>
                <select value={form.albumSize} onChange={field('albumSize')}>
                  <option value="">Select Size</option>
                  {ALBUM_SIZES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Occasion</label>
              <select value={form.occasion} onChange={field('occasion')}>
                <option value="">Select Occasion</option>
                {OCCASIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Names / Custom Text</label>
              <input value={form.customText} onChange={field('customText')} type="text" placeholder="Adam & Eve — 14 Feb 2025" />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea value={form.notes} onChange={field('notes')} placeholder="Specific requests, finishes, delivery info..." />
            </div>

            {/* Photo upload */}
            <div className="form-group">
              <div className="upload-section-label">
                Photos <span>(optional — uploaded directly to our Drive)</span>
              </div>

              <input
                ref={folderInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                webkitdirectory=""
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <div className="upload-btn-row">
                <button type="button" className="upload-pick-btn" onClick={() => folderInputRef.current?.click()}>
                  <span className="upload-pick-icon">📁</span>
                  <span>Select Folder</span>
                </button>
              </div>

              {selectedFiles.length > 0 && (
                <div className="upload-file-list">
                  <div className="upload-file-summary">
                    {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected &nbsp;·&nbsp; {sizeMB} MB total
                    <button type="button" className="upload-clear-btn" onClick={() => setSelectedFiles([])}>
                      Clear all
                    </button>
                  </div>
                  <ul className="upload-file-names">
                    {selectedFiles.slice(0, 8).map((f, i) => (
                      <li key={i}>
                        <span>{f.name}</span>
                        <button type="button" onClick={() => removeFile(i)}>×</button>
                      </li>
                    ))}
                    {selectedFiles.length > 8 && (
                      <li className="upload-more">+ {selectedFiles.length - 8} more files</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Upload progress bar */}
            {submitting && selectedFiles.length > 0 && (
              <div className="upload-progress-wrap">
                <div className="upload-progress-header">
                  <span>Uploading {selectedFiles.length} photo{selectedFiles.length > 1 ? 's' : ''}…</span>
                  <span className="upload-progress-pct">{uploadProgress}%</span>
                </div>
                <div className="upload-progress-track">
                  <div
                    className="upload-progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="upload-progress-sub">
                  {uploadProgress < 100
                    ? 'Please wait, do not close this page'
                    : '✅ Upload complete — saving your order…'}
                </div>
              </div>
            )}

            <button className="form-submit" type="submit" disabled={submitting}>
              {submitting ? (selectedFiles.length > 0 ? 'Uploading…' : 'Sending…') : 'Submit Order Request'}
            </button>
          </form>
        </div>
      </section>

      <SuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
    </>
  );
}

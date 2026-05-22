import { useState } from 'react';
import { ChevronDownSVG } from '../icons';

export default function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        className={`faq-q${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        {q}
        <ChevronDownSVG className="faq-chevron" />
      </button>
      <div className={`faq-a${open ? ' open' : ''}`}>{a}</div>
    </div>
  );
}

import { useEffect } from 'react';
import { CATALOG } from '../../data/catalog';

export default function Lightbox({ lb, onClose, onNav }) {
  useEffect(() => {
    function handleKey(e) {
      if (!lb) return;
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft')  onNav(-1);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [lb, onClose, onNav]);

  if (!lb) return null;

  const [src, alt] = CATALOG[lb.cat][lb.idx];
  if (!src) return null;

  return (
    <div
      className="lightbox open"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <img className="lb-img" src={src} alt={alt} />
      <button className="lb-close" onClick={onClose}>✕</button>
      <button className="lb-prev"  onClick={() => onNav(-1)}>‹</button>
      <button className="lb-next"  onClick={() => onNav(1)}>›</button>
    </div>
  );
}

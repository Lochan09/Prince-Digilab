import { useCallback, useEffect, useRef, useState } from 'react';
import { HERO_SLIDES } from '../../data/constants';

export default function HeroSlider() {
  const [current, setCurrent]   = useState(0);
  const [progress, setProgress] = useState(0);
  const pausedRef = useRef(false);
  const total     = HERO_SLIDES.length;

  const goTo = useCallback((n) => {
    setCurrent(((n % total) + total) % total);
    setProgress(0);
    setTimeout(() => setProgress(100), 30);
  }, [total]);

  useEffect(() => {
    setProgress(0);
    setTimeout(() => setProgress(100), 30);
    const timer = setInterval(() => {
      if (!pausedRef.current) goTo(current + 1);
    }, 3200);
    return () => clearInterval(timer);
  }, [current, goTo]);

  return (
    <div
      className="hero-slider-wrap"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div className="hero-slider">
        {HERO_SLIDES.map((src, i) => (
          <div key={i} className={`slide${i === current ? ' active' : ''}`}>
            <img src={src} alt={`Album design ${i + 1}`} loading="lazy" />
          </div>
        ))}
        <div className="slide-badge">New Arrivals</div>
        <div
          className="slider-progress"
          style={{
            width: `${progress}%`,
            transition: progress === 0 ? 'none' : 'width 3s linear',
          }}
        />
      </div>

      <div className="slider-dots">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            className={`slider-dot${i === current ? ' active' : ''}`}
            aria-label={`Slide ${i + 1}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

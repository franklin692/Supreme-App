import React, { useRef, useState, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";

export const BeforeAfterSlider = ({ before, after, testId = "before-after" }) => {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const move = useCallback((clientX) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    setPos(pct);
  }, []);

  const onDown = () => { dragging.current = true; };
  const onUp = () => { dragging.current = false; };
  const onMove = (e) => {
    if (!dragging.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    move(clientX);
  };

  return (
    <div
      ref={containerRef}
      data-testid={testId}
      className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden select-none cursor-ew-resize glass-gold"
      onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchMove={onMove} onTouchEnd={onUp}
    >
      <img src={after} alt="Potenziale ristrutturato" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute top-3 right-3 z-10 text-[11px] font-bold metallic px-2.5 py-1 rounded-full">POTENZIALE RISTRUTTURATO</div>

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="Stato attuale" className="absolute inset-0 h-full object-cover" style={{ width: containerRef.current ? containerRef.current.getBoundingClientRect().width : "100%" }} draggable={false} />
        <div className="absolute top-3 left-3 text-[11px] font-bold bg-obsidian/80 border border-white/20 text-white px-2.5 py-1 rounded-full">STATO ATTUALE</div>
      </div>

      <div className="absolute top-0 bottom-0 z-20" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        onMouseDown={onDown} onTouchStart={onDown}>
        <div className="w-0.5 h-full bg-gold gold-glow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full metallic flex items-center justify-center cursor-ew-resize">
          <MoveHorizontal size={20} />
        </div>
      </div>
    </div>
  );
};

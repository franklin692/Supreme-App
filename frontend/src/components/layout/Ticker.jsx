import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { api, currentMonthLabel } from "@/lib/api";

export const Ticker = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/content/home").then(({ data }) => {
      const raw = data?.ticker?.items || [];
      const label = currentMonthLabel();
      setItems(raw.map((t) => t.replace(/\[.*?\]/g, label)));
    }).catch(() => {});
  }, []);

  if (!items.length) return <div className="h-9 bg-night border-b border-gold/20" data-testid="ticker-bar" />;

  return (
    <div className="h-9 bg-[#070910] border-b border-gold/25 flex items-center relative z-40 ticker-mask" data-testid="ticker-bar">
      <Marquee gradient={false} speed={55} pauseOnHover className="overflow-hidden">
        {items.concat(items).map((t, i) => (
          <span key={i} className="mx-8 text-[13px] font-mono tracking-tight text-gray-200 whitespace-nowrap">
            <span className="text-emerald">{t}</span>
            <span className="mx-8 text-gold/40">•</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
};

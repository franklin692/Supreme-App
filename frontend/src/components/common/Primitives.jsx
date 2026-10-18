import React from "react";
import { cn } from "@/lib/utils";

export const SectionTitle = ({ eyebrow, title, subtitle, align = "left", className }) => (
  <div className={cn(align === "center" ? "text-center mx-auto" : "text-left", "max-w-3xl mb-10", className)}>
    {eyebrow && (
      <div className={cn("flex items-center gap-2 mb-3", align === "center" && "justify-center")}>
        <span className="h-px w-8 bg-gold/60" />
        <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">{eyebrow}</span>
      </div>
    )}
    <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">{title}</h2>
    {subtitle && <p className="mt-4 text-muted-foreground text-base leading-relaxed">{subtitle}</p>}
  </div>
);

export const StatusBadge = ({ label, className }) => (
  <span className={cn(
    "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight metallic whitespace-nowrap",
    className
  )}>
    {label}
  </span>
);

export const GoldButton = ({ children, className, ...props }) => (
  <button {...props} className={cn(
    "px-6 py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300",
    className
  )}>
    {children}
  </button>
);

export const OutlineButton = ({ children, className, ...props }) => (
  <button {...props} className={cn(
    "px-6 py-3 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300 font-medium",
    className
  )}>
    {children}
  </button>
);

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const base =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber-400)] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-[var(--amber-500)] to-[var(--orange-500)] text-[var(--surface-0)] font-bold shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_28px_rgba(251,191,36,0.35)]",
  secondary:
    "bg-transparent border border-[var(--border)] text-[var(--text-secondary)] hover:border-[rgba(251,191,36,0.2)] hover:text-[var(--text-primary)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text-primary)]",
};

export function Button({ variant = "primary", className = "", style, ...props }: ButtonProps) {
  return (
      <button className={`${base} ${variants[variant]} ${className}`} style={{ fontFamily: "Syne, sans-serif", ...style }} {...props} />
  );
}

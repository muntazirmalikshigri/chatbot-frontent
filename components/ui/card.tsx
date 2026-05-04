import type { HTMLAttributes } from "react";

export function Card({ className = "", style, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border backdrop-blur-sm ${className}`}
      style={{
        background: "var(--surface-1)",
        borderColor: "var(--border)",
        ...style,
      }}
      {...props}
    />
  );
}

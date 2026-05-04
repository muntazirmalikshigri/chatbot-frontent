import type { InputHTMLAttributes } from "react";

export function Input({ className = "", style, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-sm ${className}`}
      style={{
        background: "var(--surface-2)",
        borderColor: "var(--border)",
        color: "var(--text-primary)",
        ...style,
      }}
      {...props}
    />
  );
}

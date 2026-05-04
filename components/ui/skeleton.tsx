import type { HTMLAttributes } from "react";

export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className}`}
      style={{
        background: "rgba(251,191,36,0.12)",
      }}
      {...props}
    />
  );
}

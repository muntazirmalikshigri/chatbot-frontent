import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[36px] border border-white/10 bg-white/5 p-8 shadow-[0_30px_100px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-10">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">Welcome back</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            A focused workspace for company owners.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
            Sign in to manage agents, upload knowledge, and test chatbot
            behavior before sharing public links.
          </p>
        </section>
        <section>{children}</section>
      </div>
    </main>
  );
}

"use client";

import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">Workspace</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Settings</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Workspace settings and account preferences will live here. This space is ready for future SaaS controls such as branding, team access, and API usage limits.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white">Branding</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Update your company identity, chatbot appearance, and public chat experience.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white">Access</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Manage workspace access, ownership, and admin configuration in later releases.
          </p>
        </Card>
      </div>
    </div>
  );
}

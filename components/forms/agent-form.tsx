"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type AgentFormValues = {
  name: string;
  tone: "friendly" | "formal";
  instructions: string;
};

type AgentFormProps = {
  initialValues?: Partial<AgentFormValues>;
  submitLabel: string;
  onSubmit: (values: AgentFormValues) => Promise<void> | void;
};

export function AgentForm({ initialValues, submitLabel, onSubmit }: AgentFormProps) {
  const [values, setValues] = useState<AgentFormValues>({
    name: initialValues?.name ?? "",
    tone: initialValues?.tone ?? "friendly",
    instructions: initialValues?.instructions ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = values.name.trim();
    const trimmedInstructions = values.instructions.trim();

    if (!trimmedName || !trimmedInstructions) {
      setError("Name and instructions are required.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSubmit({
        ...values,
        name: trimmedName,
        instructions: trimmedInstructions,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save agent");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">Agent name</label>
        <Input
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          placeholder="Support Assistant"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">Tone</label>
        <select
          value={values.tone}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              tone: event.target.value as "friendly" | "formal",
            }))
          }
          className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
        >
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">Instructions</label>
        <Textarea
          rows={7}
          value={values.instructions}
          onChange={(event) =>
            setValues((current) => ({ ...current, instructions: event.target.value }))
          }
          placeholder="Describe the agent personality, constraints, and support rules."
        />
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

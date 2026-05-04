"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import type { Company } from "@/lib/types";

function formatDate(value?: string) {
  if (!value) return "Recently created";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function CompanyCardSkeleton() {
  return (
    <Card className="p-6">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
      <div className="mt-8 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
    </Card>
  );
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Company | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const items = await api.getCompanies();
        if (mounted) {
          setCompanies(items);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unable to load companies");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const emptyState = useMemo(
    () => (
      <Card className="border border-dashed border-cyan-400/30 bg-cyan-400/5 p-10 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Companies</p>
        <h2 className="mt-4 text-2xl font-semibold text-white">No company found. Create your first company.</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Add a tenant workspace to begin managing assistants, knowledge, and chatbot access.
        </p>
        <Link href="/dashboard/company/create" className="mt-6 inline-flex">
          <Button>Create Company</Button>
        </Link>
      </Card>
    ),
    []
  );

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await api.deleteCompany(deleteTarget._id);
      setCompanies((current) => current.filter((company) => company._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete company");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[32px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300">Tenants</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Companies</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Organize each tenant workspace, review creation dates, and manage company knowledge with a safe confirmation step.
          </p>
        </div>
        <Link href="/dashboard/company/create">
          <Button>Create Company</Button>
        </Link>
      </div>

      {error ? <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CompanyCardSkeleton key={index} />
          ))}
        </div>
      ) : companies.length === 0 ? (
        emptyState
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <Card key={company._id} className="p-6 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/25">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-white">{company.name}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-400">
                    {company.description || "No description added yet."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(company)}
                  aria-label={`Delete ${company.name}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Created</p>
                  <p className="mt-2 text-sm text-slate-300">{formatDate(company.createdAt)}</p>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {company.status || "active"}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/dashboard/companies/${company._id}`}>
                  <Button variant="secondary">Manage knowledge</Button>
                </Link>
                <Link href="/dashboard/company/create">
                  <Button variant="ghost">Create another</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(deleteTarget)}
        title="Delete company?"
        description={
          deleteTarget
            ? `This will permanently remove ${deleteTarget.name}, all related assistants, knowledge chunks, and chat sessions.`
            : undefined
        }
        confirmLabel="Delete company"
        danger
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

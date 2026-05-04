"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type FileUploadProps = {
  accept?: string;
  onUpload: (file: File) => Promise<void> | void;
  label: string;
};

export function FileUpload({ accept, onUpload, label }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chooseFile = () => {
    inputRef.current?.click();
  };

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setLoading(true);
    setError(null);

    try {
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
      <Button type="button" variant="secondary" onClick={chooseFile} className="w-full">
        {loading ? "Uploading..." : label}
      </Button>
      {fileName ? <p className="text-xs text-slate-400">Selected: {fileName}</p> : null}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}

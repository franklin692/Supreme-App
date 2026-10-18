import React, { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export const toAbsoluteMediaUrl = (u) =>
  !u ? u : (u.startsWith("http") ? u : `${process.env.REACT_APP_BACKEND_URL}${u}`);

export const MediaUpload = ({ onUploaded, label = "Carica", testId, className = "" }) => {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);

  const handle = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/admin/media", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onUploaded(toAbsoluteMediaUrl(data.url), data);
      toast.success("Immagine caricata");
    } catch {
      toast.error("Upload non riuscito");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <>
      <input ref={ref} type="file" accept="image/*" onChange={handle} className="hidden" data-testid={testId ? `${testId}-input` : undefined} />
      <button type="button" onClick={() => ref.current?.click()} disabled={busy} data-testid={testId}
        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-gold/40 text-gold text-sm hover:bg-gold/10 transition-colors disabled:opacity-60 ${className}`}>
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} {label}
      </button>
    </>
  );
};

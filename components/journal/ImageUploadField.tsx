"use client";

import { useState, useTransition } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { cldCard } from "@/lib/cloudinary-transform";
import { validateUploadFile } from "@/lib/upload-limit";

export function ImageUploadField({
  value,
  onChange,
  folder = "couple-space/journal",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const validationError = validateUploadFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = "";
      return;
    }

    startTransition(async () => {
      try {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        if (!cloudName || !uploadPreset) {
          throw new Error("Cloudinary env vars are not configured.");
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);
        formData.append("folder", folder);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData },
        );
        if (!res.ok) throw new Error("Upload failed. Try a different image.");

        const data = await res.json();
        onChange(data.secure_url as string);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    });
  }

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cldCard(value)}
          alt=""
          className="max-h-56 w-full object-cover"
        />
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Remove image"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#2B2320]/70 text-white hover:bg-[#2B2320]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#2B2320]/20 p-6 text-center text-[#2B2320]/50 hover:border-[#C4685A]/40 hover:text-[#C4685A]">
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <ImagePlus className="h-5 w-5" strokeWidth={1.75} />
      )}
      <span className="text-xs">
        {isPending ? "Uploading…" : "Add a photo (optional, up to 10MB)"}
      </span>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isPending}
        className="sr-only"
      />
      {error && <span className="text-xs text-[#C4685A]">{error}</span>}
    </label>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Camera, Loader2 } from "lucide-react";

/**
 * Uses Cloudinary's unsigned upload endpoint — requires an "unsigned"
 * upload preset created in your Cloudinary dashboard (Settings > Upload
 * > Add upload preset > Signing Mode: Unsigned). Set these two env vars:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
 * This keeps the upload entirely client-side — no server route needed
 * for something as low-risk as a profile picture.
 */
export function AvatarUpload({
  currentImage,
  name,
  onUploaded,
}: {
  currentImage?: string | null;
  name: string;
  onUploaded: (url: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(currentImage ?? null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

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
        formData.append("folder", "couple-space/avatars");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData },
        );

        if (!res.ok) throw new Error("Upload failed. Try a different image.");

        const data = await res.json();
        onUploaded(data.secure_url as string);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
        setPreview(currentImage ?? null);
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="group relative flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#E7B7A4]">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="font-display text-2xl text-[#2B2320]/60">
            {name.charAt(0).toUpperCase()}
          </span>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-[#2B2320]/0 transition-colors group-hover:bg-[#2B2320]/40">
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin text-white opacity-0 group-hover:opacity-100" />
          ) : (
            <Camera className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isPending}
          className="sr-only"
        />
      </label>

      {error && <p className="text-xs text-[#C4685A]">{error}</p>}
    </div>
  );
}

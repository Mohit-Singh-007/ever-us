"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MapPin, Trash2, Pencil, Check, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { updateMemory, deleteMemory } from "@/lib/actions/memory";
import { cldFull } from "@/lib/cloudinary-transform";

type Memory = {
  id: string;
  imageUrl: string;
  caption: string | null;
  location: string | null;
  date: Date;
  uploadedBy: { name: string };
};

export function MemoryLightBox({
  memory,
  currentUserName,
  open,
  onOpenChange,
}: {
  memory: Memory;
  currentUserName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(memory.caption ?? "");
  const [location, setLocation] = useState(memory.location ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateMemory(memory.id, {
        imageUrl: memory.imageUrl,
        caption,
        location,
        date: format(memory.date, "yyyy-MM-dd"),
      });
      setIsEditing(false);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteMemory(memory.id);
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cldFull(memory.imageUrl)}
          alt={memory.caption ?? ""}
          className="max-h-[50vh] w-full object-cover"
        />

        <div className="p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-wide text-[#8A9A7E]">
              {format(memory.date, "MMMM d, yyyy")}
            </p>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isPending}
                    aria-label="Save"
                    className="text-[#8A9A7E] hover:text-[#2B2320]"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setCaption(memory.caption ?? "");
                      setLocation(memory.location ?? "");
                    }}
                    disabled={isPending}
                    aria-label="Cancel"
                    className="text-[#2B2320]/40 hover:text-[#2B2320]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    aria-label="Edit"
                    className="text-[#2B2320]/40 hover:text-[#2B2320]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    aria-label="Delete"
                    className="text-[#2B2320]/40 hover:text-[#C4685A]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="flex flex-col gap-3">
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
                placeholder="Caption"
              />
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#2B2320]/35" />
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="pl-8"
                />
              </div>
            </div>
          ) : (
            <>
              {memory.caption && (
                <p className="mb-2 text-sm leading-relaxed text-[#2B2320]">
                  {memory.caption}
                </p>
              )}
              {memory.location && (
                <p className="flex items-center gap-1.5 text-xs text-[#2B2320]/50">
                  <MapPin className="h-3 w-3" /> {memory.location}
                </p>
              )}
              <p className="mt-3 text-[10px] uppercase tracking-wide text-[#2B2320]/35">
                added by {memory.uploadedBy.name}
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

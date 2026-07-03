"use client";

import { useState } from "react";
import { Lightbox } from "../memories/Lightbox";

type Memory = {
  id: string;
  imageUrl: string;
  caption: string | null;
  location: string | null;
  date: Date;
  uploadedBy: { name: string };
};

export function RecentMemoriesGrid({
  memories,
  currentUserName,
}: {
  memories: Memory[];
  currentUserName: string;
}) {
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {memories.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setActiveMemory(m)}
            className="group relative aspect-4/5 overflow-hidden rounded-2xl bg-[#2B2320]/5 text-left shadow-sm ring-1 ring-[#2B2320]/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.imageUrl}
              alt={m.caption ?? ""}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />

            {m.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-[#2B2320]/85 via-[#2B2320]/25 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="line-clamp-2 text-xs leading-snug text-white">
                  {m.caption}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {activeMemory && (
        <Lightbox
          memory={activeMemory}
          currentUserName={currentUserName}
          open={Boolean(activeMemory)}
          onOpenChange={(open) => !open && setActiveMemory(null)}
        />
      )}
    </>
  );
}

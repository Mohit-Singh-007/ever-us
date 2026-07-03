"use client";

import { useState } from "react";
import { format, isSameMonth } from "date-fns";
import { MapPin } from "lucide-react";
import { MemoryLightbox } from "./MemoryLightBox";

type Memory = {
  id: string;
  imageUrl: string;
  caption: string | null;
  location: string | null;
  date: Date;
  uploadedBy: { name: string };
};

export function MemoryTimeline({
  memories,
  currentUserName,
}: {
  memories: Memory[];
  currentUserName: string;
}) {
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null);

  const groups: { label: string; items: Memory[] }[] = [];
  for (const memory of memories) {
    const last = groups[groups.length - 1];
    if (last && isSameMonth(last.items[0].date, memory.date)) {
      last.items.push(memory);
    } else {
      groups.push({ label: format(memory.date, "MMMM yyyy"), items: [memory] });
    }
  }

  return (
    <div className="flex flex-col gap-14">
      {groups.map((group) => (
        <section key={group.label}>
          <div className="mb-5 flex items-center gap-4">
            <h2 className="font-display text-lg italic text-[#2B2320]/80 md:text-xl">
              {group.label}
            </h2>
            <div className="h-px flex-1 bg-[#2B2320]/10" />
            <span className="font-mono text-[10px] uppercase tracking-wide text-[#2B2320]/35">
              {group.items.length}{" "}
              {group.items.length === 1 ? "photo" : "photos"}
            </span>
          </div>

          {/* CSS-columns masonry: each photo keeps its natural aspect ratio,
              columns reflow automatically, and nothing can overlap or hide
              behind another tile — unlike a manually spanned CSS grid. */}
          <div className="columns-2 gap-3 sm:columns-3 md:columns-4">
            {group.items.map((memory) => (
              <button
                key={memory.id}
                type="button"
                onClick={() => setActiveMemory(memory)}
                className="group relative mb-3 block w-full overflow-hidden rounded-2xl bg-[#2B2320]/5 text-left shadow-sm ring-1 ring-[#2B2320]/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg break-inside-avoid"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={memory.imageUrl}
                  alt={memory.caption ?? ""}
                  loading="lazy"
                  className="block h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                {/* always-visible date chip, top-left */}
                <div className="absolute left-2 top-2 rounded-full bg-[#2B2320]/55 px-2 py-1 backdrop-blur-sm">
                  <span className="text-[10px] font-medium text-white">
                    {format(memory.date, "MMM d")}
                  </span>
                </div>

                {/* caption/location reveal on hover */}
                {(memory.caption || memory.location) && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2B2320]/85 via-[#2B2320]/30 to-transparent p-3 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {memory.caption && (
                      <p className="line-clamp-2 text-xs leading-snug text-white">
                        {memory.caption}
                      </p>
                    )}
                    {memory.location && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-white/75">
                        <MapPin className="h-2.5 w-2.5 shrink-0" />{" "}
                        {memory.location}
                      </p>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      ))}

      {activeMemory && (
        <MemoryLightbox
          memory={activeMemory}
          currentUserName={currentUserName}
          open={Boolean(activeMemory)}
          onOpenChange={(open) => !open && setActiveMemory(null)}
        />
      )}
    </div>
  );
}

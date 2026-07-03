"use client";

import { useState } from "react";
import { format, isSameMonth } from "date-fns";
import { MapPin } from "lucide-react";
import { MemoryLightbox } from "./memory-lightbox";

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
    <div className="flex flex-col gap-10">
      {groups.map((group) => (
        <section key={group.label}>
          <h2 className="font-mono mb-4 text-xs uppercase tracking-[0.2em] text-[#8A9A7E]">
            {group.label}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {group.items.map((memory, i) => (
              <button
                key={memory.id}
                type="button"
                onClick={() => setActiveMemory(memory)}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-[#2B2320]/5 text-left"
                style={{
                  // slight organic size variation on every 5th tile for visual rhythm
                  gridRowEnd: i % 5 === 0 ? "span 2" : undefined,
                  gridColumnEnd: i % 5 === 0 ? "span 2" : undefined,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={memory.imageUrl}
                  alt={memory.caption ?? ""}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#2B2320]/70 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {memory.caption && (
                    <p className="line-clamp-2 text-xs text-white">
                      {memory.caption}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-white/70">
                    <span>{format(memory.date, "MMM d")}</span>
                    {memory.location && (
                      <span className="flex items-center gap-0.5">
                        <MapPin className="h-2.5 w-2.5" /> {memory.location}
                      </span>
                    )}
                  </div>
                </div>
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

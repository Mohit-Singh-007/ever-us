"use client";

import { useState } from "react";
import { format, isSameMonth } from "date-fns";
import { MapPin } from "lucide-react";
import { cldThumb } from "@/lib/cloudinary-transform";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Lightbox";

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

  let runningIndex = 0;

  return (
    <div className="relative">
      {/* the spine — dashed thread running down the page, same motif as the landing hero */}
      <div
        className="absolute left-4 top-3 bottom-3 w-px md:left-1/2 md:-translate-x-1/2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, #C4685A55 0, #C4685A55 4px, transparent 4px, transparent 12px)",
        }}
        aria-hidden
      />

      <div className="flex flex-col gap-2">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col">
            {/* month marker, sits centered on the spine at md+, aligned with cards on mobile */}
            <div className="relative py-6">
              <div className="pl-10 md:pl-0 md:flex md:justify-center">
                <span className="font-display inline-block rounded-full border border-[#C4685A]/25 bg-[#FBF3EF] px-4 py-1.5 text-sm italic text-[#2B2320] shadow-sm">
                  {group.label}
                </span>
              </div>
            </div>

            {group.items.map((memory) => {
              const isLeft = runningIndex % 2 === 0;
              runningIndex += 1;

              return (
                <div key={memory.id} className="relative py-4">
                  {/* dot on the spine */}
                  <span
                    className="absolute left-4 top-8 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-[#C4685A] ring-4 ring-[#FBF3EF] md:left-1/2"
                    aria-hidden
                  />

                  <button
                    type="button"
                    onClick={() => setActiveMemory(memory)}
                    className={cn(
                      "group ml-10 block w-[calc(100%-2.5rem)] text-left md:w-[calc(50%-2.5rem)]",
                      isLeft ? "md:mr-auto md:pr-2" : "md:ml-auto md:pl-2",
                    )}
                  >
                    <div
                      className={cn(
                        "overflow-hidden rounded-2xl border border-[#2B2320]/8 bg-white/70 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg",
                        "flex flex-col sm:flex-row",
                        !isLeft && "sm:flex-row-reverse",
                      )}
                    >
                      <div className="relative aspect-4/3 w-full overflow-hidden sm:aspect-square sm:w-36 sm:shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cldThumb(memory.imageUrl)}
                          alt={memory.caption ?? ""}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-center p-4">
                        <p className="font-mono mb-1 text-[10px] uppercase tracking-wide text-[#8A9A7E]">
                          {format(memory.date, "MMMM d, yyyy")}
                        </p>
                        {memory.caption && (
                          <p className="line-clamp-2 text-sm leading-snug text-[#2B2320]">
                            {memory.caption}
                          </p>
                        )}
                        {memory.location && (
                          <p className="mt-1.5 flex items-center gap-1 text-xs text-[#2B2320]/50">
                            <MapPin className="h-3 w-3 shrink-0" />{" "}
                            {memory.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
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
    </div>
  );
}

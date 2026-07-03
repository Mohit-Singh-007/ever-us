"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Plus, CalendarIcon, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { createMemory } from "@/lib/actions/memory";
import { cn } from "@/lib/utils";
import { ImageUploadField } from "../journal/ImageUploadField";

export function AddMemoryDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setImageUrl("");
    setCaption("");
    setLocation("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createMemory({ imageUrl, caption, location, date });
      if (result.ok) {
        reset();
        setOpen(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full bg-[#2B2320] text-[#FBF3EF] hover:bg-[#2B2320]/90">
          <Plus className="h-4 w-4" /> Add memory
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Add to the timeline
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <ImageUploadField
            value={imageUrl}
            onChange={setImageUrl}
            folder="couple-space/memories"
          />

          <div className="grid gap-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What made this moment worth keeping?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {date
                        ? format(new Date(date), "MMM d, yyyy")
                        : "Pick a date"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={date ? new Date(date) : undefined}
                    onSelect={(d) => d && setDate(format(d, "yyyy-MM-dd"))}
                    disabled={(d) => d > new Date()}
                    startMonth={new Date(1990, 0)}
                    endMonth={new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#2B2320]/35" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Optional"
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-[#C4685A]">{error}</p>}

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending || !imageUrl}
              className="rounded-full bg-[#2B2320] text-[#FBF3EF] hover:bg-[#2B2320]/90"
            >
              {isPending ? "Adding…" : "Add to timeline"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

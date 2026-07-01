"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createJournalEntry } from "@/lib/actions/journal";
import { MOOD_EMOJI, MOOD_LABELS, MOODS } from "@/zod/journal-schema";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUploadField } from "./ImageUploadField";

export function NewJournalEntryDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setTitle("");
    setContent("");
    setMood("");
    setImageUrl("");
    setError(null);
  }

  function isContentEmpty(html: string) {
    return html.replace(/<[^>]*>/g, "").trim().length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createJournalEntry({
        title,
        content,
        mood: mood as never,
        imageUrl,
      });
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
          <Plus className="h-4 w-4" /> New entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Write a new entry
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give it a title"
            />
          </div>

          <div className="grid gap-2">
            <Label>How are you feeling?</Label>
            <Select value={mood} onValueChange={setMood}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pick a mood (optional)" />
              </SelectTrigger>
              <SelectContent>
                {MOODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {MOOD_EMOJI[m]} {MOOD_LABELS[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Entry</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="What's on your mind?"
            />
          </div>

          <div className="grid gap-2">
            <Label>Photo</Label>
            <ImageUploadField value={imageUrl} onChange={setImageUrl} />
          </div>

          {error && <p className="text-sm text-[#C4685A]">{error}</p>}

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending || isContentEmpty(content)}
              className="rounded-full bg-[#2B2320] text-[#FBF3EF] hover:bg-[#2B2320]/90"
            >
              {isPending ? "Posting…" : "Post entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

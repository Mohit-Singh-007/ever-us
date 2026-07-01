"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  deleteJournalEntry,
  addJournalComment,
  deleteJournalComment,
  toggleJournalReaction,
} from "@/lib/actions/journal";

import { cn } from "@/lib/utils";
import { MOOD_EMOJI, REACTION_EMOJIS } from "@/zod/journal-schema";
import { sanitizeJournalHtml } from "@/lib/sanitize-html";

type Entry = {
  id: string;
  title: string | null;
  content: string;
  mood: string | null;
  imageUrl: string | null;
  createdAt: Date;
  author: { id: string; name: string; image: string | null };
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    authorId: string;
    author: { name: string };
  }[];
  reactions: { id: string; emoji: string; userId: string }[];
};

export function JournalEntryCard({
  entry,
  currentUserId,
}: {
  entry: Entry;
  currentUserId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isAuthor = entry.author.id === currentUserId;

  const reactionCounts = REACTION_EMOJIS.map((emoji) => ({
    emoji,
    count: entry.reactions.filter((r) => r.emoji === emoji).length,
    reactedByMe: entry.reactions.some(
      (r) => r.emoji === emoji && r.userId === currentUserId,
    ),
  })).filter((r) => r.count > 0 || true); // show all, count 0 still clickable

  function handleReact(emoji: string) {
    startTransition(async () => {
      await toggleJournalReaction(entry.id, emoji);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteJournalEntry(entry.id);
      router.refresh();
    });
  }

  function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    startTransition(async () => {
      await addJournalComment(entry.id, commentText);
      setCommentText("");
      router.refresh();
    });
  }

  function handleDeleteComment(commentId: string) {
    startTransition(async () => {
      await deleteJournalComment(commentId);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-[#2B2320]/10 bg-white/70 p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E7B7A4]">
            {entry.author.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={entry.author.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-medium">
                {entry.author.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-[#2B2320]">
              {entry.author.name}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-[#2B2320]/40">
              {format(entry.createdAt, "MMM d, h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {entry.mood && (
            <span className="text-lg" aria-label={entry.mood}>
              {MOOD_EMOJI[entry.mood as keyof typeof MOOD_EMOJI]}
            </span>
          )}
          {isAuthor && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              aria-label="Delete entry"
              className="text-[#2B2320]/30 hover:text-[#C4685A]"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {entry.title && (
        <h3 className="font-display mb-2 text-lg">{entry.title}</h3>
      )}

      <div
        className="prose prose-sm mb-4 max-w-none text-[#2B2320]/85 prose-headings:text-[#2B2320] prose-strong:text-[#2B2320] [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_blockquote]:border-l-2 [&_blockquote]:border-[#C4685A]/40 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-[#2B2320]/70"
        dangerouslySetInnerHTML={{ __html: sanitizeJournalHtml(entry.content) }}
      />

      {entry.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.imageUrl}
          alt=""
          className="mb-4 max-h-72 w-full rounded-xl object-cover"
        />
      )}

      <div className="flex flex-wrap items-center gap-1.5 border-t border-[#2B2320]/8 pt-3">
        {REACTION_EMOJIS.map((emoji) => {
          const count = entry.reactions.filter((r) => r.emoji === emoji).length;
          const reactedByMe = entry.reactions.some(
            (r) => r.emoji === emoji && r.userId === currentUserId,
          );
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => handleReact(emoji)}
              disabled={isPending}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition-colors",
                reactedByMe
                  ? "border-[#C4685A]/40 bg-[#C4685A]/10"
                  : "border-[#2B2320]/10 hover:bg-[#2B2320]/5",
              )}
            >
              <span>{emoji}</span>
              {count > 0 && <span className="text-[#2B2320]/50">{count}</span>}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setCommentsOpen((v) => !v)}
          className="ml-auto flex items-center gap-1.5 text-xs text-[#2B2320]/50 hover:text-[#2B2320]"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {entry.comments.length > 0 ? entry.comments.length : "Comment"}
        </button>
      </div>

      {commentsOpen && (
        <div className="mt-4 flex flex-col gap-3 border-t border-[#2B2320]/8 pt-4">
          {entry.comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start justify-between gap-2"
            >
              <div>
                <p className="text-xs font-medium text-[#2B2320]/70">
                  {comment.author.name}
                </p>
                <p className="text-sm text-[#2B2320]/85">{comment.content}</p>
              </div>
              {comment.authorId === currentUserId && (
                <button
                  type="button"
                  onClick={() => handleDeleteComment(comment.id)}
                  aria-label="Delete comment"
                  className="text-[#2B2320]/25 hover:text-[#C4685A]"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment…"
              className="flex-1 rounded-full border border-[#2B2320]/12 bg-white px-3.5 py-2 text-xs placeholder:text-[#2B2320]/35 focus:border-[#C4685A]/50 focus:outline-none"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isPending || !commentText.trim()}
              className="rounded-full bg-[#2B2320] text-xs text-[#FBF3EF] hover:bg-[#2B2320]/90"
            >
              Send
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

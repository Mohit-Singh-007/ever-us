"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  bucketItemSchema,
  BUCKET_CATEGORIES,
  BUCKET_CATEGORY_LABELS,
  type BucketItemFormValues,
} from "@/zod/category-bucket-schema";
import { createBucketItem } from "@/lib/actions/bucket";

export function AddBucketItemDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BucketItemFormValues>({
    resolver: zodResolver(bucketItemSchema),
    defaultValues: { title: "", description: "", category: "DREAMS" },
  });

  function onSubmit(values: BucketItemFormValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await createBucketItem(values);
      if (result.ok) {
        reset();
        setOpen(false);
        router.refresh();
      } else {
        setServerError(result.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-full bg-[#2B2320] text-[#FBF3EF] hover:bg-[#2B2320]/90">
          <Plus className="h-4 w-4" /> Add item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Add to the list
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Watch the northern lights"
              {...register("title")}
            />
            {errors.title && (
              <span className="text-xs text-[#C4685A]">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" rows={2} {...register("description")} />
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUCKET_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {BUCKET_CATEGORY_LABELS[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {serverError && (
            <p className="text-sm text-[#C4685A]">{serverError}</p>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-[#2B2320] text-[#FBF3EF] hover:bg-[#2B2320]/90"
            >
              {isPending ? "Adding…" : "Add to list"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, X, Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { LOVE_LANGUAGES, ProfileFormValues, profileSchema } from "@/zod/profile-schema";
import { updateProfile } from "@/lib/actions/profile";
import { AvatarUpload } from "./AvatarUpload";

type InitialProfile = {
  name: string;
  image: string | null;
  nickname: string | null;
  bio: string | null;
  birthday: Date | null;
  favoriteMovie: string | null;
  favoriteFood: string | null;
  loveLanguage: string | null;
  interests: string[];
};

export function ProfileForm({ initial }: { initial: InitialProfile }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [interestInput, setInterestInput] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nickname: initial.nickname ?? "",
      bio: initial.bio ?? "",
      birthday: initial.birthday
        ? initial.birthday.toISOString().slice(0, 10)
        : "",
      favoriteMovie: initial.favoriteMovie ?? "",
      favoriteFood: initial.favoriteFood ?? "",
      loveLanguage:
        (initial.loveLanguage as ProfileFormValues["loveLanguage"]) ?? "",
      interests: initial.interests,
      image: initial.image ?? "",
    },
  });

  const interests = watch("interests");
  const image = watch("image");
  const birthday = watch("birthday");

  function addInterest() {
    const value = interestInput.trim();
    if (!value || interests.includes(value) || interests.length >= 15) return;
    setValue("interests", [...interests, value], { shouldDirty: true });
    setInterestInput("");
  }

  function removeInterest(value: string) {
    setValue(
      "interests",
      interests.filter((i) => i !== value),
      { shouldDirty: true },
    );
  }

  function onSubmit(values: ProfileFormValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await updateProfile(values);
      if (result.ok) {
        setSavedAt(Date.now());
        router.refresh();
      } else {
        setServerError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-xl">
      <div className="mb-8 flex justify-center">
        <AvatarUpload
          currentImage={image}
          name={initial.name}
          onUploaded={(url) => setValue("image", url, { shouldDirty: true })}
        />
      </div>

      <Card className="border-[#2B2320]/10 bg-white/70">
        <CardContent className="flex flex-col gap-6 pt-6">
          <div className="grid gap-2">
            <Label htmlFor="nickname" className="text-xs text-[#2B2320]/60">
              Nickname
            </Label>
            <Input
              id="nickname"
              placeholder="What your partner calls you"
              {...register("nickname")}
            />
            <FieldError message={errors.nickname?.message} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio" className="text-xs text-[#2B2320]/60">
              Bio
            </Label>
            <Textarea
              id="bio"
              rows={3}
              placeholder="A few words about you"
              {...register("bio")}
            />
            <FieldError message={errors.bio?.message} />
          </div>

          <div className="grid gap-2">
            <Label className="text-xs text-[#2B2320]/60">Birthday</Label>
            <Controller
              control={control}
              name="birthday"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(new Date(field.value), "MMMM d, yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      disabled={(date) => date > new Date()}
                      startMonth={new Date(1940, 0)}
                      endMonth={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            <FieldError message={errors.birthday?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label
                htmlFor="favoriteMovie"
                className="text-xs text-[#2B2320]/60"
              >
                Favorite movie
              </Label>
              <Input id="favoriteMovie" {...register("favoriteMovie")} />
              <FieldError message={errors.favoriteMovie?.message} />
            </div>
            <div className="grid gap-2">
              <Label
                htmlFor="favoriteFood"
                className="text-xs text-[#2B2320]/60"
              >
                Favorite food
              </Label>
              <Input id="favoriteFood" {...register("favoriteFood")} />
              <FieldError message={errors.favoriteFood?.message} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-xs text-[#2B2320]/60">Love language</Label>
            <Controller
              control={control}
              name="loveLanguage"
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Not set" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOVE_LANGUAGES.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.loveLanguage?.message} />
          </div>

          <div className="grid gap-2">
            <Label className="text-xs text-[#2B2320]/60">Interests</Label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="gap-1 rounded-full bg-[#2B2320]/6 pr-1.5 text-[#2B2320] hover:bg-[#2B2320]/10"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    aria-label={`Remove ${interest}`}
                    className="rounded-full p-0.5 text-[#2B2320]/40 hover:text-[#C4685A]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {interests.length < 15 && (
              <div className="flex gap-2">
                <Input
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInterest();
                    }
                  }}
                  placeholder="Add an interest and press Enter"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addInterest}
                  aria-label="Add interest"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            <FieldError
              message={errors.interests?.message as string | undefined}
            />
          </div>
        </CardContent>
      </Card>

      {serverError && (
        <p className="mt-6 text-sm text-[#C4685A]">{serverError}</p>
      )}

      <div className="mt-8 flex items-center gap-4">
        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="rounded-full bg-[#2B2320] px-6 text-[#FBF3EF] hover:bg-[#2B2320]/90"
        >
          {isPending ? "Saving…" : "Save changes"}
        </Button>
        {savedAt && !isDirty && (
          <span className="flex items-center gap-1.5 text-xs text-[#8A9A7E]">
            <Check className="h-3.5 w-3.5" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-xs text-[#C4685A]">{message}</span>;
}

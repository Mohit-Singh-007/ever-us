"use server";


import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ProfileFormValues, profileSchema } from "@/zod/profile-schema";
import prisma from "../prisma";


type UpdateProfileResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function updateProfile(
  values: ProfileFormValues,
): Promise<UpdateProfileResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, error: "Not authenticated" };

  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      nickname: data.nickname || null,
      bio: data.bio || null,
      birthday: data.birthday ? new Date(data.birthday) : null,
      favoriteMovie: data.favoriteMovie || null,
      favoriteFood: data.favoriteFood || null,
      loveLanguage: data.loveLanguage || null,
      interests: data.interests,
      ...(data.image ? { image: data.image } : {}),
    },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { ok: true };
}
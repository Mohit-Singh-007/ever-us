import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: {
      name: true,
      image: true,
      nickname: true,
      bio: true,
      birthday: true,
      favoriteMovie: true,
      favoriteFood: true,
      loveLanguage: true,
      interests: true,
    },
  });

  return (
    <div>
      <div className="mx-auto mb-8 max-w-xl">
        <p className="font-mono mb-2 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
          your profile
        </p>
        <h1 className="font-display text-2xl md:text-3xl">
          Tell your partner about you.
        </h1>
      </div>

      <ProfileForm initial={user} />
    </div>
  );
}

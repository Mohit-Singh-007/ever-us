import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Cake, Film, Utensils } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { getPartnerProfile } from "@/lib/actions/getPartnerProfile";

export default async function PartnerProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const partner = await getPartnerProfile();

  if (!partner) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7B7A4]/50">
          <Heart className="h-6 w-6 text-[#C4685A]" strokeWidth={1.75} />
        </div>
        <h1 className="font-display mb-2 text-2xl">
          No partner connected yet.
        </h1>
        <p className="mb-7 text-sm leading-relaxed text-[#2B2320]/60">
          Once you're connected, their profile will show up here.
        </p>
        <Link
          href="/invite"
          className="rounded-full bg-[#2B2320] px-6 py-3 text-sm font-medium text-[#FBF3EF]"
        >
          Invite your partner
        </Link>
      </div>
    );
  }

  const displayName = partner.nickname || partner.name;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-[#E7B7A4]">
          {partner.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={partner.image}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-2xl text-[#2B2320]/60">
                {partner.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <p className="font-mono mb-1 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
          your partner
        </p>
        <h1 className="font-display text-2xl md:text-3xl">{displayName}</h1>
        {partner.bio && (
          <p className="mt-2 max-w-sm text-sm text-[#2B2320]/60">
            {partner.bio}
          </p>
        )}
      </div>

      <Card className="border-[#2B2320]/10 bg-white/70">
        <CardContent className="flex flex-col gap-5 pt-6">
          {partner.birthday && (
            <InfoRow
              icon={Cake}
              label="Birthday"
              value={format(new Date(partner.birthday), "MMMM d")}
            />
          )}
          {partner.favoriteMovie && (
            <InfoRow
              icon={Film}
              label="Favorite movie"
              value={partner.favoriteMovie}
            />
          )}
          {partner.favoriteFood && (
            <InfoRow
              icon={Utensils}
              label="Favorite food"
              value={partner.favoriteFood}
            />
          )}
          {partner.loveLanguage && (
            <InfoRow
              icon={Heart}
              label="Love language"
              value={partner.loveLanguage}
            />
          )}

          {partner.interests.length > 0 && (
            <div>
              <p className="mb-2 text-xs text-[#2B2320]/50">Interests</p>
              <div className="flex flex-wrap gap-2">
                {partner.interests.map((interest) => (
                  <Badge
                    key={interest}
                    variant="secondary"
                    className="rounded-full bg-[#2B2320]/6 text-[#2B2320]"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {!partner.birthday &&
            !partner.favoriteMovie &&
            !partner.favoriteFood &&
            !partner.loveLanguage &&
            partner.interests.length === 0 && (
              <p className="py-4 text-center text-sm text-[#2B2320]/45">
                {displayName} hasn't filled in their profile yet.
              </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Cake;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2B2320]/5">
        <Icon className="h-4 w-4 text-[#C4685A]" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-xs text-[#2B2320]/45">{label}</p>
        <p className="text-sm text-[#2B2320]">{value}</p>
      </div>
    </div>
  );
}

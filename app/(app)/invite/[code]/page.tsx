import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getInvitationByCode } from "@/lib/actions/invitation";
import { Heart } from "lucide-react";
import Link from "next/link";
import { AcceptInviteButton } from "@/components/dashboard/AcceptInviteButton";

export default async function AcceptInvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const invitation = await getInvitationByCode(code);

  return (
    <div
      className={` font-body flex min-h-svh items-center justify-center bg-[#FBF3EF] px-6 text-[#2B2320]`}
    >
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#E7B7A4]/50">
          <Heart className="h-6 w-6 text-[#C4685A]" strokeWidth={1.75} />
        </div>

        {renderState()}
      </div>
    </div>
  );

  function renderState() {
    if (!invitation) {
      return (
        <>
          <h1 className="font-display mb-2 text-2xl">Invite not found.</h1>
          <p className="text-sm text-[#2B2320]/60">
            This link may be mistyped, or the invite may no longer exist.
          </p>
        </>
      );
    }

    if (invitation.status === "REVOKED") {
      return (
        <>
          <h1 className="font-display mb-2 text-2xl">
            This invite was revoked.
          </h1>
          <p className="text-sm text-[#2B2320]/60">
            Ask {invitation.sender.name} to send you a new one.
          </p>
        </>
      );
    }

    if (invitation.status === "ACCEPTED") {
      return (
        <>
          <h1 className="font-display mb-2 text-2xl">
            This invite is already used.
          </h1>
          <p className="text-sm text-[#2B2320]/60">
            If that was you, sign in to head to your dashboard.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-full bg-[#2B2320] px-6 py-3 text-sm font-medium text-[#FBF3EF]"
          >
            Sign in
          </Link>
        </>
      );
    }

    if (invitation.expiresAt < new Date()) {
      return (
        <>
          <h1 className="font-display mb-2 text-2xl">
            This invite has expired.
          </h1>
          <p className="text-sm text-[#2B2320]/60">
            Ask {invitation.sender.name} to send you a new one.
          </p>
        </>
      );
    }

    // Valid, pending invite
    return (
      <>
        <p className="font-mono mb-3 text-xs uppercase tracking-[0.25em] text-[#8A9A7E]">
          you've been invited
        </p>
        <h1 className="font-display mb-2 text-2xl">
          {invitation.sender.name} wants to share a space with you.
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-[#2B2320]/60">
          Accept to connect your accounts. You can only be in one space at a
          time.
        </p>

        {session ? (
          <AcceptInviteButton code={code} />
        ) : (
          <Link
            href={`/login?next=/invite/${code}`}
            className="inline-block rounded-full bg-[#2B2320] px-6 py-3 text-sm font-medium text-[#FBF3EF] transition-transform hover:-translate-y-0.5"
          >
            Sign in to accept
          </Link>
        )}
      </>
    );
  }
}

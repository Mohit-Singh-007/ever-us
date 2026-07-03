import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Session lookups happen in the (app) layout AND in nearly every page under
 * it (as a defense-in-depth guard). Without this, that's two auth/session
 * round trips per request. React's cache() dedupes calls with the same
 * arguments within a single render pass — so as long as every layout/page
 * imports this instead of calling auth.api.getSession directly, the second
 * call is free.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});
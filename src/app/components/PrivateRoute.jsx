"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "../lib/auth-client";
import { Aperture } from "lucide-react";

const PrivateRoute = ({ children }) => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session, router, pathname]);

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <Aperture className="w-6 h-6 text-amber-500 absolute animate-pulse" />
        </div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Verifying studio session...
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
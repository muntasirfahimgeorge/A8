import Link from "next/link";
import { Clapperboard, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-6">
        <Clapperboard className="w-16 h-16 text-amber-500" />
      </div>

      <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 text-amber-600 dark:text-amber-400 border border-zinc-200 dark:border-zinc-800 mb-3">
        Error 404 • Scene Not Found
      </span>

      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
        Cut! This Stage Is Empty
      </h1>

      <p className="max-w-md text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
        The creative workspace or page you are looking for has wrapped production
        or moved to another set.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold shadow-md transition"
      >
        <Home className="w-4 h-4" />
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Aperture, Send } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Subscribed to StudioSpace creator updates!");
    setEmail("");
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500 text-zinc-950">
                <Aperture className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Studio<span className="text-amber-500">Space</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              The peer-to-peer creative workspace marketplace connecting
              filmmakers, photographers, podcasters, and musicians with
              production-ready studios on demand.
            </p>

            {/* Social Links (X, Instagram, YouTube, LinkedIn) */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 hover:text-zinc-900 dark:hover:text-white transition"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="w-4 h-4 fill-current"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 hover:text-zinc-900 dark:hover:text-white transition"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 hover:text-zinc-900 dark:hover:text-white transition"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 hover:text-zinc-900 dark:hover:text-white transition"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-500 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/studios" className="hover:text-amber-500 transition">
                  Explore Studios
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-amber-500 transition"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#about-us"
                  className="hover:text-amber-500 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/add-studio"
                  className="hover:text-amber-500 transition"
                >
                  Host Your Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4">
              Popular Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/studios?category=Photo Studios"
                  className="hover:text-amber-500 transition"
                >
                  Photo Studios
                </Link>
              </li>
              <li>
                <Link
                  href="/studios?category=Sound Stages"
                  className="hover:text-amber-500 transition"
                >
                  Sound Stages
                </Link>
              </li>
              <li>
                <Link
                  href="/studios?category=Podcast Rooms"
                  className="hover:text-amber-500 transition"
                >
                  Podcast Rooms
                </Link>
              </li>
              <li>
                <Link
                  href="/studios?category=Music Suites"
                  className="hover:text-amber-500 transition"
                >
                  Music Suites
                </Link>
              </li>
              <li>
                <Link
                  href="/studios?category=Art Workshops"
                  className="hover:text-amber-500 transition"
                >
                  Art Workshops
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-4">
              Creator Dispatch
            </h3>
            <p className="text-sm mb-4">
              Get weekly updates on newly listed production spaces and off-peak
              studio rates.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {year} StudioSpace Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Host Protection Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
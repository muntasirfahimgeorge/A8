"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

const Navbar = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Better Auth Session
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  // Navigation Items
  const navItems = [
    {
      id: 1,
      name: "Login",
      path: "/login",
    },
    {
      id: 2,
      name: "Sign Up",
      path: "/signup",
    },
  ];

  // Logout Function
  const handleLogout = async () => {
    setLoading(true);

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setProfileOpen(false);
            router.replace("/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold text-white">
          Assignment<span className="text-indigo-500">08</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {!isPending &&
            !user &&
            navItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className="font-medium text-slate-300 transition hover:text-indigo-400"
              >
                {item.name}
              </Link>
            ))}
        </div>

        {/* User Profile */}
        {!isPending && user && (
          <div className="relative">
            {/* Profile Image Button */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-indigo-500 bg-indigo-600 font-bold text-white transition hover:scale-105"
              aria-label="User profile menu"
              aria-expanded={profileOpen}
            >
              {user.image && !imageError ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  onError={() => setImageError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name?.charAt(0).toUpperCase() ||
                user.email?.charAt(0).toUpperCase() ||
                "U"
              )}
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
                {/* User Information */}
                <div className="border-b border-slate-700 px-4 py-4">
                  <p className="font-semibold text-white">{user.name}</p>

                  <p className="mt-1 break-all text-sm text-slate-400">
                    {user.email}
                  </p>
                </div>

                {/* Logout Button */}
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="w-full rounded-lg px-4 py-3 text-left font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {loading ? "Logging out..." : "↪ Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu Button */}
        {!isPending && !user && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl text-white md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? "✕" : "☰"}
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      {isOpen && !user && (
        <div className="border-t border-slate-800 bg-slate-950 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="font-medium text-slate-300 transition hover:text-indigo-400"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
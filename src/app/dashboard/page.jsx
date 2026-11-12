"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PrivateRoute from "../components/PrivateRoute";
import StudioCard from "../components/StudioCard";
import { authClient } from "../lib/auth-client";
import { authFetch } from "../lib/api";
import toast from "react-hot-toast";
import { Building2, CalendarCheck, Heart, PlusCircle } from "lucide-react";

const DashboardContent = () => {
  const { data: session } = authClient.useSession();
  const [myStudios, setMyStudios] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [savedStudios, setSavedStudios] = useState([]);
  const [loading, setLoading] = useState(true);

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!session?.user?.email) return;
      try {
        const [studiosRes, bookingsData, wishlistItems, allStudiosRes] =
          await Promise.all([
            fetch(
              `${serverUrl}/api/studios?ownerEmail=${encodeURIComponent(
                session.user.email
              )}`
            ).then((r) => r.json()),
            authFetch("/api/bookings"),
            authFetch("/api/wishlist"),
            fetch(`${serverUrl}/api/studios`).then((r) => r.json()),
          ]);

        setMyStudios(Array.isArray(studiosRes) ? studiosRes : []);
        setMyBookings(Array.isArray(bookingsData) ? bookingsData : []);

        const wishIds = wishlistItems.map((w) => w.studioId);
        const matchedSaved = (
          Array.isArray(allStudiosRes) ? allStudiosRes : []
        ).filter((s) => wishIds.includes(s._id));
        setSavedStudios(matchedSaved);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [session, serverUrl]);

  const handleRemoveWishlist = async (studioId) => {
    try {
      await authFetch("/api/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ studioId }),
      });
      setSavedStudios((prev) => prev.filter((s) => s._id !== studioId));
      toast.success("Removed from wishlist.");
    } catch (error) {
      toast.error("Failed to update wishlist.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name}
              className="w-16 h-16 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-zinc-950 font-extrabold text-2xl flex items-center justify-center">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "C"}
            </div>
          )}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Creator Overview
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Welcome, {session?.user?.name}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {session?.user?.email}
            </p>
          </div>
        </div>

        <Link
          href="/add-studio"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Studio
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <Link
          href="/my-listings"
          className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-500 transition"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-zinc-500">
              My Studio Listings
            </span>
            <Building2 className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            {loading ? "..." : myStudios.length}
          </p>
        </Link>

        <Link
          href="/my-bookings"
          className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-500 transition"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-zinc-500">
              My Reservations
            </span>
            <CalendarCheck className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            {loading ? "..." : myBookings.length}
          </p>
        </Link>

        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-zinc-500">
              Saved Wishlist
            </span>
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
          <p className="text-3xl font-extrabold text-zinc-900 dark:text-white">
            {loading ? "..." : savedStudios.length}
          </p>
        </div>
      </div>

      {/* Saved Wishlist Section */}
      <div>
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-6">
          Saved Studios Wishlist
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
              />
            ))}
          </div>
        ) : savedStudios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-10 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Click the heart icon on any studio card to save workspaces for
              future shoots.
            </p>
            <Link
              href="/studios"
              className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-sm"
            >
              Browse Studios
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {savedStudios.map((studio) => (
              <StudioCard
                key={studio._id}
                studio={studio}
                isSaved={true}
                onToggleWishlist={handleRemoveWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardPage = () => (
  <PrivateRoute>
    <DashboardContent />
  </PrivateRoute>
);

export default DashboardPage;
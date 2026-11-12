"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PrivateRoute from "../components/PrivateRoute";
import { authClient } from "../lib/auth-client";
import { authFetch } from "../lib/api";
import toast from "react-hot-toast";
import {
  PlusCircle,
  Pencil,
  Trash2,
  MapPin,
  AlertTriangle,
  Building2,
} from "lucide-react";

const MyListingsContent = () => {
  const { data: session } = authClient.useSession();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(
          `${serverUrl}/api/studios?ownerEmail=${encodeURIComponent(
            session.user.email
          )}`
        );
        const data = await res.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to load your studio listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [session, serverUrl]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await authFetch(`/api/studios/${deleteTarget._id}`, {
        method: "DELETE",
      });
      setListings((prev) =>
        prev.filter((item) => item._id !== deleteTarget._id)
      );
      toast.success("Studio deleted successfully!");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete studio.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Host Inventory
          </span>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            My Studio Listings
          </h1>
        </div>

        <Link
          href="/add-studio"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm shadow-sm transition self-start"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Studio
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 p-14 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            No Studios Listed Yet
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            Share your creative workspace with filmmakers, photographers, and
            podcasters to start earning.
          </p>
          <Link
            href="/add-studio"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-sm font-bold transition"
          >
            <PlusCircle className="w-4 h-4" />
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-wider text-zinc-500 bg-zinc-50 dark:bg-zinc-950/60">
                <th className="py-4 px-5">Studio</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Hourly Rate</th>
                <th className="py-4 px-5">Capacity</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
              {listings.map((studio) => (
                <tr
                  key={studio._id}
                  className="hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={studio.image}
                        alt={studio.title}
                        className="w-16 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <Link
                          href={`/studios/${studio._id}`}
                          className="font-bold text-zinc-900 dark:text-white hover:text-amber-500 transition"
                        >
                          {studio.title}
                        </Link>
                        <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-amber-500" />
                          {studio.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      {studio.category}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-zinc-900 dark:text-white">
                    ${studio.hourlyRate}/hr
                  </td>
                  <td className="py-4 px-5 text-zinc-600 dark:text-zinc-300">
                    {studio.maxCapacity} crew
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/studios/edit/${studio._id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-amber-500 text-xs font-bold transition"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Update
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(studio)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
              Delete Studio Listing?
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Are you sure you want to permanently remove{" "}
              <span className="font-bold text-zinc-900 dark:text-white">
                {deleteTarget.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm font-semibold cursor-pointer"
              >
                Keep Listing
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition cursor-pointer"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MyListingsPage = () => (
  <PrivateRoute>
    <MyListingsContent />
  </PrivateRoute>
);

export default MyListingsPage;
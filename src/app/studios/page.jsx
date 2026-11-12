"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import StudioCard from "../components/StudioCard";
import { authClient } from "../lib/auth-client";
import { authFetch } from "../lib/api";
import toast from "react-hot-toast";
import { Search, SlidersHorizontal, Building2, RotateCcw } from "lucide-react";

const categoryOptions = [
  "All",
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

const ExploreStudiosContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const initialCategory = searchParams.get("category") || "All";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [studios, setStudios] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  useEffect(() => {
    const paramCat = searchParams.get("category") || "All";
    setSelectedCategory(paramCat);
  }, [searchParams]);

  useEffect(() => {
    const fetchStudios = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "All") {
          params.set("category", selectedCategory);
        }
        if (searchTerm.trim()) {
          params.set("search", searchTerm.trim());
        }
        if (sortBy) {
          params.set("sort", sortBy);
        }

        const res = await fetch(
          `${serverUrl}/api/studios?${params.toString()}`
        );
        const data = await res.json();
        setStudios(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error("Failed to load studios.");
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchStudios, 250);
    return () => clearTimeout(delayDebounce);
  }, [selectedCategory, searchTerm, sortBy, serverUrl]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!session?.user) {
        setWishlistIds([]);
        return;
      }
      try {
        const items = await authFetch("/api/wishlist");
        setWishlistIds(items.map((item) => item.studioId));
      } catch (error) {
        // Ignore silent error
      }
    };
    loadWishlist();
  }, [session]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      router.push("/studios");
    } else {
      router.push(`/studios?category=${encodeURIComponent(category)}`);
    }
  };

  const handleToggleWishlist = async (studioId) => {
    if (!session?.user) {
      toast.error("Please log in to save studios.");
      return;
    }
    try {
      const res = await authFetch("/api/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ studioId }),
      });
      if (res.saved) {
        setWishlistIds((prev) => [...prev, studioId]);
        toast.success("Saved to wishlist!");
      } else {
        setWishlistIds((prev) => prev.filter((id) => id !== studioId));
        toast.success("Removed from wishlist.");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update wishlist.");
    }
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setSortBy("newest");
    router.push("/studios");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
          Verified Creative Spaces
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1">
          Explore Studios
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base">
          Browse photography lofts, sound stages, podcast rooms, and music
          suites available for hourly booking.
        </p>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by studio name, city, or neighborhood..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm font-medium focus:outline-none focus:border-amber-500"
          >
            <option value="newest">Newest Listed</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categoryOptions.map((cat) => {
          const isActive =
            selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                isActive
                  ? "bg-amber-500 text-zinc-950 shadow-sm"
                  : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:border-amber-500/50"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Studios Grid / Skeleton / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="h-[370px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 animate-pulse"
            />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 p-14 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            No Matching Studios Found
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            We couldn&apos;t find any workspaces matching your current category or
            search filters.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-sm font-bold transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {studios.map((studio) => (
            <StudioCard
              key={studio._id}
              studio={studio}
              isSaved={wishlistIds.includes(studio._id)}
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ExploreStudiosPage = () => {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-zinc-500">
          Loading creative studios...
        </div>
      }
    >
      <ExploreStudiosContent />
    </Suspense>
  );
};

export default ExploreStudiosPage;
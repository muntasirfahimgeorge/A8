"use client";

import Link from "next/link";
import { MapPin, Star, Heart, ArrowUpRight } from "lucide-react";

const StudioCard = ({ studio, isSaved = false, onToggleWishlist }) => {
  return (
    <div className="group flex flex-col h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/40 transition-all duration-300">
      {/* Uniform Image Wrapper */}
      <div className="relative h-56 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={studio.image}
          alt={studio.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge */}
        <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-950/80 text-amber-400 backdrop-blur-md">
          {studio.category}
        </span>

        {/* Wishlist Heart Button (Optional Requirement) */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(studio._id);
            }}
            aria-label="Save studio to wishlist"
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 hover:scale-110 transition shadow-sm cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                isSaved ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/95 dark:bg-zinc-950/90 text-xs font-bold text-zinc-900 dark:text-white shadow">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{Number(studio.rating || 5.0).toFixed(1)}</span>
          <span className="text-zinc-400 font-normal">
            ({studio.reviewsCount || 0})
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
            {studio.title}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">{studio.location}</span>
          </div>
        </div>

        {/* Footer: Hourly Rate & View Details */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xl font-extrabold text-zinc-900 dark:text-white">
              ${studio.hourlyRate}
            </span>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              /hr
            </span>
          </div>

          <Link
            href={`/studios/${studio._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold transition shadow-sm"
          >
            View Details
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudioCard;
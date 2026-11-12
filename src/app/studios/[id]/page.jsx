"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "../../lib/auth-client";
import { authFetch } from "../../lib/api";
import toast from "react-hot-toast";
import {
  MapPin,
  Star,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const StudioDetailsContent = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [todayStr, setTodayStr] = useState("");

  // Booking Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("13:00");
  const [notes, setNotes] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  useEffect(() => {
    setTodayStr(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/studios/${id}`);
        if (!res.ok) {
          throw new Error("Studio not found");
        }
        const data = await res.json();
        setStudio(data);
      } catch (error) {
        setStudio(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudio();
  }, [id, serverUrl]);

  const calculateHours = () => {
    if (!startTime || !endTime) return 0;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const diff = eh * 60 + em - (sh * 60 + sm);
    return diff > 0 ? Number((diff / 60).toFixed(2)) : 0;
  };

  const totalHours = calculateHours();
  const rentalSubtotal = studio ? totalHours * Number(studio.hourlyRate) : 0;
  const securityDeposit = studio ? Number(studio.securityDeposit || 0) : 0;
  const grandTotal = rentalSubtotal + securityDeposit;

  const handleOpenBookingModal = () => {
    if (!session?.user) {
      toast.error("Please log in to book this studio.");
      router.push(`/login?callbackUrl=${encodeURIComponent(`/studios/${id}`)}`);
      return;
    }
    setBookingError("");
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setBookingError("");

    if (!bookingDate) {
      setBookingError("Please select a shoot date.");
      return;
    }

    if (totalHours <= 0) {
      setBookingError("End time must be later than start time.");
      return;
    }

    setSubmitting(true);
    try {
      await authFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          studioId: studio._id,
          studioTitle: studio.title,
          studioImage: studio.image,
          studioLocation: studio.location,
          category: studio.category,
          hourlyRate: studio.hourlyRate,
          securityDeposit: studio.securityDeposit,
          bookingDate,
          startTime,
          endTime,
          totalHours,
          totalPrice: grandTotal,
          notes,
        }),
      });

      toast.success("Workspace reserved! Status: Pending.");
      setIsModalOpen(false);
      router.push("/my-bookings");
    } catch (error) {
      const msg = error.message || "Could not complete booking.";
      setBookingError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-[420px] w-full rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
          Studio Not Found
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
          This workspace may have been removed or the link is incorrect.
        </p>
        <Link
          href="/studios"
          className="px-6 py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold text-sm"
        >
          Back to Explore Studios
        </Link>
      </div>
    );
  }

  const galleryImages =
    studio.gallery && studio.gallery.length > 0
      ? studio.gallery
      : [studio.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <Link
        href="/studios"
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-amber-500 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to All Studios
      </Link>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 mb-2">
            {studio.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
            {studio.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2.5 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              {studio.location}
            </span>
            <span className="flex items-center gap-1 font-semibold text-zinc-900 dark:text-white">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {Number(studio.rating || 5.0).toFixed(1)} (
              {studio.reviewsCount || 0} reviews)
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-500" />
              Up to {studio.maxCapacity} people
            </span>
          </div>
        </div>
      </div>

      {/* Gallery Carousel */}
      <div className="relative h-[320px] sm:h-[460px] w-full rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 mb-10">
        <img
          src={galleryImages[activeImageIdx]}
          alt={studio.title}
          className="h-full w-full object-cover"
        />

        {galleryImages.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveImageIdx((prev) =>
                  prev === 0 ? galleryImages.length - 1 : prev - 1
                )
              }
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-950/70 text-white hover:bg-zinc-950 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setActiveImageIdx((prev) =>
                  prev === galleryImages.length - 1 ? 0 : prev + 1
                )
              }
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-950/70 text-white hover:bg-zinc-950 transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === activeImageIdx
                      ? "w-8 bg-amber-500"
                      : "w-2.5 bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
              Workspace Overview
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {studio.overview}
            </p>
          </section>

          <section className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500">Max Crew Capacity</p>
              <p className="text-lg font-extrabold text-zinc-900 dark:text-white mt-1">
                {studio.maxCapacity} Creators
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <p className="text-xs text-zinc-500">Hourly Rate</p>
              <p className="text-lg font-extrabold text-zinc-900 dark:text-white mt-1">
                ${studio.hourlyRate} / hr
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 col-span-2 sm:col-span-1">
              <p className="text-xs text-zinc-500">Security Deposit</p>
              <p className="text-lg font-extrabold text-zinc-900 dark:text-white mt-1">
                ${studio.securityDeposit} (Refundable)
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              Included Gear & Amenities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(studio.amenities || []).map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium text-zinc-700 dark:text-zinc-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-zinc-950 font-extrabold text-lg flex items-center justify-center">
                {studio.ownerName?.charAt(0)?.toUpperCase() || "H"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-zinc-900 dark:text-white">
                    Hosted by {studio.ownerName}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Host
                  </span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {studio.ownerEmail}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
              Creator Reviews ({studio.reviews?.length || 0})
            </h2>
            {studio.reviews && studio.reviews.length > 0 ? (
              <div className="space-y-4">
                {studio.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-zinc-900 dark:text-white">
                        {rev.userName}
                      </span>
                      <span className="text-xs text-zinc-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No reviews yet. Be the first creator to book and review this
                workspace!
              </p>
            )}
          </section>
        </div>

        {/* Right Sticky Booking Card */}
        <div>
          <div className="sticky top-24 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl space-y-5">
            <div className="flex items-baseline justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-white">
                  ${studio.hourlyRate}
                </span>
                <span className="text-sm text-zinc-500"> / hour</span>
              </div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                +${studio.securityDeposit} deposit
              </span>
            </div>

            <ul className="space-y-2.5 text-sm text-zinc-600 dark:text-zinc-300">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Instant slot conflict verification
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                $1M production liability included
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                Max capacity: {studio.maxCapacity} crew members
              </li>
            </ul>

            <button
              onClick={handleOpenBookingModal}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm shadow-md transition cursor-pointer"
            >
              Book Workspace Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Close booking modal"
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              Reserve Studio Slot
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {studio.title} • ${studio.hourlyRate}/hr
            </p>

            {bookingError && (
              <div className="mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-600 dark:text-red-400 font-medium">
                {bookingError}
              </div>
            )}

            <form onSubmit={handleConfirmBooking} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Shoot Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Start Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    End Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Production Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe crew size, lighting needs, or load-in time..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
                />
              </div>

              {/* Price Summary */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2 text-sm">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>
                    ${studio.hourlyRate} × {totalHours} hrs
                  </span>
                  <span>${rentalSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Refundable Security Deposit</span>
                  <span>${securityDeposit.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-between font-extrabold text-base text-zinc-900 dark:text-white">
                  <span>Total Estimate</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-zinc-950 font-bold text-sm transition cursor-pointer"
              >
                {submitting ? "Checking Availability..." : "Confirm Reservation"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StudioDetailsPage = () => (
  <Suspense
    fallback={
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-[420px] rounded-3xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      </div>
    }
  >
    <StudioDetailsContent />
  </Suspense>
);

export default StudioDetailsPage;
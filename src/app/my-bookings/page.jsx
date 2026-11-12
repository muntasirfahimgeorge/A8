"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PrivateRoute from "../components/PrivateRoute";
import { authFetch } from "../lib/api";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import {
  Calendar,
  Clock,
  MapPin,
  FileDown,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from "lucide-react";

const statusStyles = {
  Pending:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  Confirmed:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  Completed:
    "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
  Cancelled:
    "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
};

const MyBookingsContent = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const loadBookings = async () => {
    try {
      const data = await authFetch("/api/bookings");
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async () => {
    if (!cancelTarget) return;
    setProcessingId(cancelTarget._id);
    try {
      await authFetch(`/api/bookings/${cancelTarget._id}/cancel`, {
        method: "PATCH",
      });
      setBookings((prev) =>
        prev.map((item) =>
          item._id === cancelTarget._id
            ? { ...item, status: "Cancelled" }
            : item
        )
      );
      toast.success("Booking cancelled.");
      setCancelTarget(null);
    } catch (error) {
      toast.error(error.message || "Failed to cancel booking.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      await authFetch(`/api/bookings/${bookingId}/confirm`, {
        method: "PATCH",
      });
      setBookings((prev) =>
        prev.map((item) =>
          item._id === bookingId ? { ...item, status: "Confirmed" } : item
        )
      );
      toast.success("Booking confirmed! PDF invoice is now available.");
    } catch (error) {
      toast.error(error.message || "Failed to confirm booking.");
    } finally {
      setProcessingId(null);
    }
  };

  // Optional Requirement: PDF Booking Invoice Generator
  const handleDownloadPDF = (booking) => {
    const doc = new jsPDF();

    doc.setFillColor(24, 24, 27);
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(245, 158, 11);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("StudioSpace", 20, 22);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("OFFICIAL PRODUCTION BOOKING RECEIPT", 20, 31);

    doc.setTextColor(24, 24, 27);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Invoice ID: #${booking._id.slice(-8).toUpperCase()}`, 20, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Status: ${booking.status}`, 150, 55);

    doc.line(20, 62, 190, 62);

    doc.setFontSize(11);
    doc.text(`Creator Name: ${booking.userName}`, 20, 74);
    doc.text(`Creator Email: ${booking.userEmail}`, 20, 82);

    doc.setFont("helvetica", "bold");
    doc.text("Workspace Details", 20, 98);
    doc.setFont("helvetica", "normal");
    doc.text(`Studio: ${booking.studioTitle}`, 20, 106);
    doc.text(`Location: ${booking.studioLocation}`, 20, 114);
    doc.text(`Shoot Date: ${booking.bookingDate}`, 20, 122);
    doc.text(
      `Time Slot: ${booking.startTime} - ${booking.endTime} (${booking.totalHours} hrs)`,
      20,
      130
    );

    doc.line(20, 140, 190, 140);

    const subtotal = Number(booking.hourlyRate) * Number(booking.totalHours);
    doc.text(
      `Studio Rental (${booking.totalHours} hrs @ $${booking.hourlyRate}/hr):`,
      20,
      152
    );
    doc.text(`$${subtotal.toFixed(2)}`, 165, 152);

    doc.text("Refundable Security Deposit:", 20, 161);
    doc.text(`$${Number(booking.securityDeposit).toFixed(2)}`, 165, 161);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Total Paid:", 20, 175);
    doc.text(`$${Number(booking.totalPrice).toFixed(2)}`, 165, 175);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(113, 113, 122);
    doc.text(
      "Thank you for creating with StudioSpace. Covered under $1M Host Liability Protection.",
      20,
      200
    );

    doc.save(`StudioSpace-Invoice-${booking._id.slice(-6)}.pdf`);
    toast.success("PDF Invoice downloaded!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
          Production Schedule
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
          My Bookings
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Track reservation statuses, cancel pending slots, and download PDF
          receipts for confirmed shoots.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
            />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 p-14 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            No Bookings Yet
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            You haven&apos;t reserved any creative studio slots yet. Explore
            available workspaces to schedule your next session.
          </p>
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-sm font-bold transition"
          >
            <Compass className="w-4 h-4" />
            Explore Studios
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <img
                  src={booking.studioImage}
                  alt={booking.studioTitle}
                  className="w-full sm:w-28 h-24 rounded-xl object-cover shrink-0"
                />

                <div>
                  <div className="flex flex-wrap items-center gap-2.5 mb-1">
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="text-lg font-bold text-zinc-900 dark:text-white hover:text-amber-500 transition"
                    >
                      {booking.studioTitle}
                    </Link>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                        statusStyles[booking.status] || statusStyles.Pending
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {booking.studioLocation}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      {booking.bookingDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      {booking.startTime} – {booking.endTime} (
                      {booking.totalHours} hrs)
                    </span>
                  </div>

                  <p className="text-sm font-extrabold text-zinc-900 dark:text-white mt-2">
                    Total: ${Number(booking.totalPrice).toFixed(2)}{" "}
                    <span className="text-xs font-normal text-zinc-500">
                      (incl. ${booking.securityDeposit} deposit)
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {booking.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleConfirmBooking(booking._id)}
                      disabled={processingId === booking._id}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm Slot
                    </button>

                    <button
                      onClick={() => setCancelTarget(booking)}
                      disabled={processingId === booking._id}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel Booking
                    </button>
                  </>
                )}

                {booking.status === "Confirmed" && (
                  <button
                    onClick={() => handleDownloadPDF(booking)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold shadow-sm transition cursor-pointer"
                  >
                    <FileDown className="w-4 h-4" />
                    Download PDF Invoice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Cancel Confirmation Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-white">
              Cancel Pending Reservation?
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Do you want to cancel your booking for{" "}
              <span className="font-bold text-zinc-900 dark:text-white">
                {cancelTarget.studioTitle}
              </span>{" "}
              on {cancelTarget.bookingDate}?
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-sm font-semibold cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MyBookingsPage = () => (
  <PrivateRoute>
    <MyBookingsContent />
  </PrivateRoute>
);

export default MyBookingsPage;
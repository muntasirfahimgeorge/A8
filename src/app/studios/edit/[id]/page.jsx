"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PrivateRoute from "../../../components/PrivateRoute";
import { authFetch } from "../../../lib/api";
import { uploadImageToImgBB } from "../../../lib/imgbb";
import toast from "react-hot-toast";
import {
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Plus,
  ArrowLeft,
} from "lucide-react";

const studioCategories = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

const defaultAmenities = [
  "Cyclorama Wall",
  "4K Cinema Cameras",
  "Shure SM7B Mics",
  "Acoustic Treatment",
  "Profoto Strobe Lighting",
  "High-Speed Fiber Wi-Fi",
  "Green Screen Backdrop",
  "Makeup & Dressing Room",
  "Client Lounge Area",
  "Freight Elevator Access",
];

const EditStudioContent = () => {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Photo Studios");
  const [hourlyRate, setHourlyRate] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [overview, setOverview] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchExistingStudio = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/studios/${id}`);
        if (!res.ok) throw new Error("Studio not found");
        const data = await res.json();

        setTitle(data.title || "");
        setCategory(data.category || "Photo Studios");
        setHourlyRate(data.hourlyRate ?? "");
        setSecurityDeposit(data.securityDeposit ?? 0);
        setMaxCapacity(data.maxCapacity ?? "");
        setLocation(data.location || "");
        setImage(data.image || "");
        setSelectedAmenities(data.amenities || []);
        setOverview(data.overview || "");
        setOwnerName(data.ownerName || "");
        setOwnerEmail(data.ownerEmail || "");
      } catch (error) {
        toast.error("Could not load studio details.");
        router.push("/my-listings");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExistingStudio();
  }, [id, serverUrl, router]);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const toastId = toast.loading("Uploading new photo to ImgBB...");
    try {
      const uploadedUrl = await uploadImageToImgBB(file);
      setImage(uploadedUrl);
      toast.success("Image updated!", { id: toastId });
    } catch (error) {
      toast.error(error.message || "Image upload failed.", { id: toastId });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleToggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handleAddCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (!trimmed) return;
    if (!selectedAmenities.includes(trimmed)) {
      setSelectedAmenities((prev) => [...prev, trimmed]);
    }
    setCustomAmenity("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await authFetch(`/api/studios/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: title.trim(),
          category,
          hourlyRate: Number(hourlyRate),
          securityDeposit: Number(securityDeposit || 0),
          maxCapacity: Number(maxCapacity),
          location: location.trim(),
          image: image.trim(),
          gallery: [image.trim()],
          amenities: selectedAmenities,
          overview: overview.trim(),
        }),
      });

      toast.success("Studio listing updated!");
      router.push("/my-listings");
    } catch (error) {
      toast.error(error.message || "Failed to update studio.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-4 animate-pulse">
        <div className="h-10 w-60 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-[500px] rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/my-listings"
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-amber-500 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Listings
      </Link>

      <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-6">
        Update Studio Listing
      </h1>

      <form
        onSubmit={handleUpdate}
        className="space-y-6 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Studio Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            >
              {studioCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Hourly Rate ($) *
            </label>
            <input
              type="number"
              min="1"
              required
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Security Deposit ($) *
            </label>
            <input
              type="number"
              min="0"
              required
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Max Capacity *
            </label>
            <input
              type="number"
              min="1"
              required
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Location *
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
          />
        </div>

        {/* ImgBB Upload + URL */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold">
            Studio Image (Upload New via ImgBB or Edit URL) *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <label className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-amber-500 bg-zinc-50 dark:bg-zinc-950 cursor-pointer text-sm font-semibold">
              {uploadingImage ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5 text-amber-500" />
                  <span>Upload Replacement Image</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={uploadingImage}
                onChange={handleImageFileChange}
                className="hidden"
              />
            </label>

            <div className="relative">
              <ImageIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
              />
            </div>
          </div>

          {image && (
            <img
              src={image}
              alt="Preview"
              className="h-44 w-full sm:w-72 object-cover rounded-2xl border border-zinc-200 dark:border-zinc-800"
            />
          )}
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Amenities *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-3">
            {Array.from(new Set([...defaultAmenities, ...selectedAmenities])).map(
              (amenity) => {
                const checked = selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                      checked
                        ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                        : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleAmenity(amenity)}
                      className="accent-amber-500"
                    />
                    <span>{amenity}</span>
                  </label>
                );
              }
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              placeholder="Add another amenity..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            />
            <button
              type="button"
              onClick={handleAddCustomAmenity}
              className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 font-semibold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Overview *
          </label>
          <textarea
            rows={4}
            required
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
          />
        </div>

        {/* Read-Only Host Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
              Host Name (Read-only)
            </label>
            <input
              type="text"
              readOnly
              value={ownerName}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-sm text-zinc-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
              Host Email (Read-only)
            </label>
            <input
              type="email"
              readOnly
              value={ownerEmail}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-sm text-zinc-500 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || uploadingImage}
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-zinc-950 font-bold text-sm transition cursor-pointer"
        >
          {submitting ? "Saving Changes..." : "Save Studio Changes"}
        </button>
      </form>
    </div>
  );
};

const EditStudioPage = () => (
  <PrivateRoute>
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="h-96 rounded-3xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>
      }
    >
      <EditStudioContent />
    </Suspense>
  </PrivateRoute>
);

export default EditStudioPage;
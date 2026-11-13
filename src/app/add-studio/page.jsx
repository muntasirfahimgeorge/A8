"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PrivateRoute from "../components/PrivateRoute";
import { authClient } from "../lib/auth-client";
import { authFetch } from "../lib/api";
import { uploadImageToImgBB } from "../lib/imgbb";
import toast from "react-hot-toast";
import {
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Plus,
  Building2,
  DollarSign,
  Users,
  MapPin,
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

const AddStudioContent = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Photo Studios");
  const [hourlyRate, setHourlyRate] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([
    "High-Speed Fiber Wi-Fi",
  ]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [overview, setOverview] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPG, PNG, WEBP).");
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading("Uploading studio photo to ImgBB...");
    try {
      const uploadedUrl = await uploadImageToImgBB(file);
      setImage(uploadedUrl);
      toast.success("Image uploaded successfully!", { id: toastId });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image.trim()) {
      toast.error("Please upload a studio image or provide an image URL.");
      return;
    }

    if (selectedAmenities.length === 0) {
      toast.error("Please select at least one studio amenity.");
      return;
    }

    setSubmitting(true);
    try {
      await authFetch("/api/studios", {
        method: "POST",
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
          ownerName: session?.user?.name || "Studio Host",
          ownerEmail: session?.user?.email,
        }),
      });

      toast.success("Studio listed successfully!");
      router.push("/my-listings");
    } catch (error) {
      toast.error(error.message || "Failed to publish studio listing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
          Host Dashboard
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1">
          List a New Studio Space
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Publish your creative workspace to connect with filmmakers,
          photographers, and recording artists.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg"
      >
        {/* Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Studio Title *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Soho Daylight Cyclorama Loft"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Studio Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-amber-500"
            >
              {studioCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rates & Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Hourly Rate ($) *
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1"
                required
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="85"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Security Deposit ($) *
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="0"
                required
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                placeholder="150"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Max Crew Capacity *
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="1"
                required
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                placeholder="12"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Location / Full Address *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Brooklyn Navy Yard, Building 77, NY"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* ImgBB Image Upload + Image URL */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold">
            Studio Cover Photo (Upload via ImgBB or Paste URL) *
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-amber-500 bg-zinc-50 dark:bg-zinc-950 cursor-pointer transition">
              {uploadingImage ? (
                <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm py-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading to ImgBB...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-300 text-sm font-semibold py-2">
                  <UploadCloud className="w-5 h-5 text-amber-500" />
                  <span>Choose Image File to Upload</span>
                </div>
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
                placeholder="https://i.ibb.co/..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {image && (
            <div className="relative h-48 w-full sm:w-80 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <img
                src={image}
                alt="Studio Preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Amenities Checkboxes & Custom Tag */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Included Gear & Amenities *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mb-3">
            {defaultAmenities.map((amenity) => {
              const checked = selectedAmenities.includes(amenity);
              return (
                <label
                  key={amenity}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition ${
                    checked
                      ? "border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                      : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300"
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
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomAmenity();
                }
              }}
              placeholder="Add custom equipment (e.g., ARRI SkyPanel S60)..."
              className="flex-1 px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            />
            <button
              type="button"
              onClick={handleAddCustomAmenity}
              className="px-4 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Detailed Overview */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Detailed Workspace Overview *
          </label>
          <textarea
            rows={4}
            required
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Describe ceiling height, natural lighting windows, acoustic isolation, load-in access, and included production gear..."
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Read-Only Host Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Host Name (Read-only)
            </label>
            <input
              type="text"
              readOnly
              value={session?.user?.name || ""}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-sm text-zinc-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Host Email (Read-only)
            </label>
            <input
              type="email"
              readOnly
              value={session?.user?.email || ""}
              className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-sm text-zinc-500 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || uploadingImage}
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-zinc-950 font-bold text-sm shadow-md transition cursor-pointer"
        >
          {submitting ? "Publishing Studio..." : "Publish Studio Listing"}
        </button>
      </form>
    </div>
  );
};

const AddStudioPage = () => (
  <PrivateRoute>
    <AddStudioContent />
  </PrivateRoute>
);

export default AddStudioPage;
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PrivateRoute from "../../../components/PrivateRoute";
import { authFetch } from "../../../lib/api";
import toast from "react-hot-toast";
import { Upload, Plus, X, Loader2 } from "lucide-react";

const defaultAmenities = [
  "White Cyclorama Wall",
  "Acoustic Soundproofing",
  "Profoto / Aputure Lighting",
  "High-Speed Wi-Fi",
  "Makeup & Dressing Room",
  "3-Phase Power",
  "Green Screen Backdrop",
  "Air Conditioning",
];

const EditStudioContent = () => {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Photo Studio");
  const [hourlyRate, setHourlyRate] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [overview, setOverview] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  useEffect(() => {
    const loadExisting = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/studios/${id}`);
        if (!res.ok) throw new Error("Failed to load studio.");
        const data = await res.json();

        setTitle(data.title || "");
        setCategory(data.category || "Photo Studio");
        setHourlyRate(data.hourlyRate || "");
        setSecurityDeposit(data.securityDeposit || "");
        setMaxCapacity(data.maxCapacity || "");
        setLocation(data.location || "");
        setImageUrl(data.image || "");
        setSelectedAmenities(data.amenities || []);
        setOverview(data.overview || "");
        setOwnerName(data.ownerName || "");
        setOwnerEmail(data.ownerEmail || "");
      } catch (error) {
        toast.error("Could not load studio details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadExisting();
  }, [id, serverUrl]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey || apiKey.includes("এখানে")) {
      toast.error("Please configure NEXT_PUBLIC_IMGBB_API_KEY or paste URL.");
      return;
    }

    setUploadingImg(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImageUrl(data.data.display_url);
        toast.success("New image uploaded!");
      }
    } catch (error) {
      toast.error("Image upload failed.");
    } finally {
      setUploadingImg(false);
    }
  };

  const toggleAmenity = (item) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
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
          title,
          category,
          hourlyRate: Number(hourlyRate),
          securityDeposit: Number(securityDeposit),
          maxCapacity: Number(maxCapacity),
          location,
          image: imageUrl,
          amenities: selectedAmenities,
          overview,
        }),
      });

      toast.success("Studio updated successfully!");
      router.push("/my-listings");
    } catch (error) {
      toast.error(error.message || "Failed to update studio.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="h-[520px] rounded-3xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
          Edit Workspace
        </span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
          Update Studio Listing
        </h1>
      </div>

      <form
        onSubmit={handleUpdate}
        className="space-y-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Studio Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            >
              <option value="Photo Studio">Photo Studio</option>
              <option value="Film Stage">Film Stage</option>
              <option value="Podcast Lounge">Podcast Lounge</option>
              <option value="Music Suite">Music Suite</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              min="1"
              required
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Security Deposit ($)
            </label>
            <input
              type="number"
              min="0"
              required
              value={securityDeposit}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5">
              Max Capacity
            </label>
            <input
              type="number"
              min="1"
              required
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Location / Address
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold">Studio Image</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-bold cursor-pointer shrink-0">
              {uploadingImg ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              Replace File
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            />
          </div>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="h-44 w-full object-cover rounded-2xl border border-zinc-200 dark:border-zinc-800"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Amenities & Equipment
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
            {defaultAmenities.map((item) => {
              const checked = selectedAmenities.includes(item);
              return (
                <label
                  key={item}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                    checked
                      ? "border-amber-500 bg-amber-500/10 text-zinc-900 dark:text-white"
                      : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleAmenity(item)}
                    className="accent-amber-500"
                  />
                  {item}
                </label>
              );
            })}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              placeholder="Add custom gear..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
            />
            <button
              type="button"
              onClick={handleAddCustomAmenity}
              className="px-4 py-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-sm font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {selectedAmenities.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => toggleAmenity(tag)}
                  className="cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Detailed Overview
          </label>
          <textarea
            rows={4}
            required
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">
              Host Name (Read-Only)
            </label>
            <input
              type="text"
              readOnly
              value={ownerName}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950/60 text-zinc-500 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">
              Host Email (Read-Only)
            </label>
            <input
              type="email"
              readOnly
              value={ownerEmail}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950/60 text-zinc-500 text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || uploadingImg}
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-zinc-950 font-bold text-sm shadow-md transition cursor-pointer"
        >
          {submitting ? "Saving Changes..." : "Save & Update Studio"}
        </button>
      </form>
    </div>
  );
};

const EditStudioPage = () => (
  <PrivateRoute>
    <EditStudioContent />
  </PrivateRoute>
);

export default EditStudioPage;
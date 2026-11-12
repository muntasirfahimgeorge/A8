"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import StudioCard from "./components/StudioCard";
import { authClient } from "./lib/auth-client";
import { authFetch } from "./lib/api";
import toast from "react-hot-toast";
import {
  Camera,
  Film,
  Mic,
  Music,
  Palette,
  Search,
  Clock,
  CalendarCheck2,
  Sparkles,
  ShieldCheck,
  BadgeCheck,
  Wrench,
  Headphones,
  ArrowRight,
} from "lucide-react";

const heroSlides = [
  {
    id: 1,
    badge: "PEER-TO-PEER PRODUCTION MARKETPLACE",
    title: "Shoot in Iconic Daylight Lofts & Sound Stages",
    subtext:
      "Book vetted photography cycloramas, cinema stages, and creative studios by the hour with transparent pricing and instant scheduling.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 2,
    badge: "TURNKEY AUDIO & VODCAST SUITES",
    title: "Broadcast-Ready Podcast & Mastering Rooms",
    subtext:
      "Walk into acoustically treated recording lounges outfitted with Shure SM7B chains, 4K cinema cameras, and live engineering support.",
    image:
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: 3,
    badge: "MONETIZE YOUR CREATIVE SPACE",
    title: "Turn Your Studio Downtime Into Revenue",
    subtext:
      "List your creative workspace in minutes, set your hourly rates and security deposits, and host verified filmmakers and creators.",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80",
  },
];

const categories = [
  {
    name: "Photo Studios",
    description: "Cyc walls, natural light lofts & strobe setups",
    icon: Camera,
    count: "40+ Spaces",
  },
  {
    name: "Sound Stages",
    description: "Soundproof cinema stages & lighting grids",
    icon: Film,
    count: "18+ Spaces",
  },
  {
    name: "Podcast Rooms",
    description: "Multi-cam video & broadcast audio lounges",
    icon: Mic,
    count: "25+ Spaces",
  },
  {
    name: "Music Suites",
    description: "Isolated vocal booths & analog mixing rooms",
    icon: Music,
    count: "22+ Spaces",
  },
  {
    name: "Art Workshops",
    description: "Skylight ateliers for painting & ceramics",
    icon: Palette,
    count: "15+ Spaces",
  },
];

const bookingSteps = [
  {
    step: "01",
    title: "Discover Spaces",
    description:
      "Filter verified production studios by category, equipment list, capacity, and hourly budget.",
    icon: Search,
  },
  {
    step: "02",
    title: "Select Shoot Hours",
    description:
      "Inspect real-time slot availability and choose the exact date and production hours you need.",
    icon: Clock,
  },
  {
    step: "03",
    title: "Book Instantly",
    description:
      "Reserve your slot with transparent hourly rates and refundable security deposit protection.",
    icon: CalendarCheck2,
  },
  {
    step: "04",
    title: "Create & Produce",
    description:
      "Arrive on set with pre-checked gear and bring your creative vision to life without friction.",
    icon: Sparkles,
  },
];

const guarantees = [
  {
    title: "$1M Liability Protection",
    description:
      "Every confirmed studio session includes comprehensive property and production liability coverage.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Hosts & Creators",
    description:
      "Identity-checked studio owners and creator profiles ensure trusted peer-to-peer collaborations.",
    icon: BadgeCheck,
  },
  {
    title: "Equipment Safety Assurance",
    description:
      "Clear security deposit terms and pre-shoot gear checklists protect both hosts and renters.",
    icon: Wrench,
  },
  {
    title: "24/7 Production Support",
    description:
      "Dedicated studio specialists are on standby around the clock to resolve scheduling or access needs.",
    icon: Headphones,
  },
];

const HomePage = () => {
  const { data: session } = authClient.useSession();
  const [featuredStudios, setFeaturedStudios] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await fetch(`${serverUrl}/api/studios?limit=6&sort=rating`);
        const data = await res.json();
        setFeaturedStudios(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load featured studios:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, [serverUrl]);

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
        // Ignore silent wishlist errors
      }
    };
    loadWishlist();
  }, [session]);

  const handleToggleWishlist = async (studioId) => {
    if (!session?.user) {
      toast.error("Please log in to save studios to your wishlist.");
      return;
    }
    try {
      const res = await authFetch("/api/wishlist/toggle", {
        method: "POST",
        body: JSON.stringify({ studioId }),
      });
      if (res.saved) {
        setWishlistIds((prev) => [...prev, studioId]);
        toast.success("Saved to your wishlist!");
      } else {
        setWishlistIds((prev) => prev.filter((id) => id !== studioId));
        toast.success("Removed from wishlist.");
      }
    } catch (error) {
      toast.error(error.message || "Could not update wishlist.");
    }
  };

  return (
    <div>
      {/* 1. Banner / Hero Slider */}
      <section className="relative">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-[520px] sm:h-[600px] w-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full w-full flex items-center">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/70 to-zinc-950/30" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-2xl space-y-5">
                    <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {slide.badge}
                    </span>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                      {slide.title}
                    </h1>

                    <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
                      {slide.subtext}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <Link
                        href="/studios"
                        className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm shadow-lg transition"
                      >
                        Explore Studios
                      </Link>
                      <Link
                        href="/studios"
                        className="px-6 py-3.5 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition"
                      >
                        Host Your Space
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. Featured Studios Section (Dynamic .limit(6)) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Curated Production Spaces
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1">
              Featured Studios
            </h2>
          </div>
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            View All Studios
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-[370px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {featuredStudios.map((studio) => (
              <StudioCard
                key={studio._id}
                studio={studio}
                isSaved={wishlistIds.includes(studio._id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. Browse by Studio Categories */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200/80 dark:border-zinc-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Tailored For Every Medium
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1">
              Browse by Studio Categories
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-sm sm:text-base">
              Select a specialized production environment to filter available
              rooms and equipment packages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {categories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/studios?category=${encodeURIComponent(cat.name)}`}
                  className="group p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amber-500 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors mb-4">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <span className="mt-5 inline-block text-xs font-bold text-amber-600 dark:text-amber-400">
                    {cat.count} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Extra Section 1: How Booking Works */}
      <section
        id="how-it-works"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
            Streamlined Production Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white mt-1">
            How Booking Works
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-sm sm:text-base">
            From scouting the right set to rolling cameras, reserve any creative
            space in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bookingSteps.map((item) => {
            const StepIcon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-xl bg-amber-500/15 text-amber-500">
                    <StepIcon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-zinc-200 dark:text-zinc-800">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Extra Section 2: Host Guarantee & Creator Support */}
      <section
        id="about-us"
        className="bg-zinc-900 dark:bg-zinc-900/80 text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Built For Trust & Reliability
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-1">
                Host Guarantee & Creator Support
              </h2>
              <p className="text-zinc-400 mt-3 text-sm sm:text-base">
                Whether you are renting a cinema sound stage or listing your
                private studio, StudioSpace safeguards every booking.
              </p>
            </div>
            <Link
              href="/add-studio"
              className="self-start lg:self-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm transition"
            >
              List Your Studio Today
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((item) => {
              const GuaranteeIcon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950/70"
                >
                  <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-4">
                    <GuaranteeIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
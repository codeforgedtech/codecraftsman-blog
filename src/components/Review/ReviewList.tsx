import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
  CalendarIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  imageUrl: string;
  created_at: string;
  version: string;
  os_type: string;
  based_on: string[];
  origin: string;
  architecture: string[];
  desktop_environment: string[];
  categories: string[];
  slug: string;
}

// Visually consistent rating with 5 stars
const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const maxStars = 5;
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} of ${maxStars}`}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <StarIcon
          key={i}
          className={"h-5 w-5 " + (i < rating ? "text-yellow-400" : "text-white/20")}
        />
      ))}
    </div>
  );
};

const ReviewList: React.FC = () => {
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase.from("reviews").select("*");
      if (error) {
        console.error("Error fetching reviews:", error.message);
      } else {
        const sortedReviews = data?.sort(
          (a: Review, b: Review) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setFilteredReviews(sortedReviews || []);
      }
    };

    fetchReviews();
  }, []);

  const handleSort = (type: string) => {
    const sorted = [...filteredReviews].sort((a, b) => {
      switch (type) {
        case "architecture":
          return a.architecture.join(", ").localeCompare(b.architecture.join(", "));
        case "desktop_environment":
          return a.desktop_environment.join(", ").localeCompare(b.desktop_environment.join(", "));
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    setFilteredReviews(sorted);
  };

  const getExcerpt = (content: string) => {
    const clean = content.replace(/<[^>]+>/g, "");
    return clean.length > 180 ? clean.slice(0, 180) + "…" : clean;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20">
      {children}
    </span>
  );

  const Spec = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-2 text-sm text-gray-300">
      <span className="text-gray-400 min-w-[7rem]">{label}:</span>
      <span className="font-medium text-gray-200">{value}</span>
    </div>
  );

  return (
    <div className="bg-black min-h-screen text-white font-sans px-2 sm:px-4 lg:px-6 py-8 w-full overflow-x-hidden">
      <div className="w-full">
        {/* Header */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent mb-8">
          Reviews
        </h1>

        {/* Filter & Sort */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
          <label htmlFor="filter-sort" className="text-sm text-gray-300">
            Sort reviews by
          </label>
          <select
            id="filter-sort"
            className="p-2.5 bg-slate-900 text-white border border-white/10 rounded-lg text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            onChange={(e) => handleSort(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select an option
            </option>
            <optgroup label="Sort By">
              <option value="architecture">Architecture</option>
              <option value="desktop_environment">Desktop Environment</option>
              <option value="rating">Rating</option>
            </optgroup>
          </select>
        </div>

        {/* Reviews Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredReviews.map((review) => (
            <li key={review.id} className="group">
              {/* Gradient border card */}
              <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
                <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-black p-5 shadow-2xl h-full flex flex-col">
                  {/* Image with fixed aspect ratio */}
                  {review.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-xl ring-1 ring-white/10">
                      <div className="relative w-full aspect-[16/9]">
                        <img
                          src={review.imageUrl}
                          alt={review.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-2">
                    {review.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {getExcerpt(review.content)}
                  </p>

                  {/* Categories */}
                  <div className="flex flex-wrap items-center gap-2 mb-4 min-h-[1.75rem]">
                    {Array.isArray(review.categories) && review.categories.length > 0 ? (
                      review.categories.map((c, i) => <Badge key={i}>{c}</Badge>)
                    ) : (
                      <span className="text-gray-500 text-sm">No categories</span>
                    )}
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-1 gap-1.5 mb-4">
                    <Spec label="Version" value={review.version} />
                    <Spec label="OS Type" value={review.os_type} />
                    <Spec label="Based On" value={review.based_on?.join(", ") || "—"} />
                    <Spec label="Origin" value={review.origin} />
                    <Spec label="Architecture" value={review.architecture?.join(", ") || "—"} />
                    <Spec label="Desktop Env" value={review.desktop_environment?.join(", ") || "—"} />
                  </div>

                  {/* Footer: date + rating */}
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 text-xs text-gray-400">
                      <CalendarIcon className="h-4 w-4 text-cyan-400" />
                      {formatDate(review.created_at)}
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>

                  <Link
                    to={`/review/${review.slug}`}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30 w-full sm:w-auto justify-center"
                    aria-label={`Read more about ${review.title}`}
                  >
                    Read more <ChevronRightIcon className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReviewList;



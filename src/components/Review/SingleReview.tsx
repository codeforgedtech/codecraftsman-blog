import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import DOMPurify from "dompurify";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

interface Reviews {
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
  desktop_environment: string[]; // fix: specify string[]
  categories: string[];
  slug: string;
}

// Consistent rating component (always 5 stars, filled based on rating)
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

const SingleReview: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [reviews, setReviews] = useState<Reviews | null>(null);
  const [similarReviews, setSimilarReviews] = useState<Reviews[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      <span className="text-gray-400 min-w-[9rem]">{label}:</span>
      <span className="font-medium text-gray-200">{value}</span>
    </div>
  );

  useEffect(() => {
    const fetchReviewsBySlug = async () => {
      if (!slug) return;
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching post by slug:", error.message);
        return;
      }

      setReviews(data);
      if (data) fetchSimilar(data.categories, data.id);
    };

    const fetchSimilar = async (categories: string[], reviewId: string) => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .contains("categories", categories)
        .neq("id", reviewId)
        .limit(4);
      if (error) {
        console.error("Error fetching similar reviews:", error.message);
      } else {
        setSimilarReviews(data || []);
      }
    };

    fetchReviewsBySlug();
  }, [slug]);

  if (!reviews) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse text-gray-400">Loading…</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-10 w-screen">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent mb-6">
          {reviews.title}
        </h1>

        {/* Main Card (glass + gradient border) */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-5 sm:p-8 shadow-2xl">
            {/* Hero image */}
            {reviews.imageUrl && (
              <div className="mb-6 overflow-hidden rounded-xl ring-1 ring-white/10">
                <img
                  src={reviews.imageUrl}
                  alt={reviews.title}
                  className="w-full h-64 sm:h-[420px] object-cover hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300/90 mb-2">
              <span className="inline-flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-cyan-400" />
                {formatDate(reviews.created_at)}
              </span>
              <span className="h-4 w-px bg-white/10" />
              <RatingStars rating={reviews.rating} />
            </div>

            {/* Categories */}
            {reviews.categories?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {reviews.categories.map((c, i) => (
                  <Badge key={i}>{c}</Badge>
                ))}
              </div>
            )}

            {/* Content */}
            <div
              className="mt-6 text-gray-200 leading-relaxed space-y-4 break-words"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(reviews.content),
              }}
            />

            {/* Specs */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Spec label="Version" value={reviews.version} />
              <Spec label="OS Type" value={reviews.os_type} />
              <Spec label="Based On" value={reviews.based_on?.join(", ") || "—"} />
              <Spec label="Origin" value={reviews.origin} />
              <Spec label="Architecture" value={reviews.architecture?.join(", ") || "—"} />
              <Spec label="Desktop Env" value={reviews.desktop_environment?.join(", ") || "—"} />
            </div>

            {/* Back Button */}
            <div className="mt-8">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30"
              >
                <ChevronLeftIcon className="h-5 w-5" /> Back
              </button>
            </div>
          </div>
        </div>

        {/* Similar Reviews */}
        {similarReviews.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Similar Reviews
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarReviews.map((s) => (
                <div key={s.id} className="group rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
                  <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-black p-4 h-full">
                    {s.imageUrl && (
                      <div className="mb-3 overflow-hidden rounded-xl ring-1 ring-white/10">
                        <img
                          src={s.imageUrl}
                          alt={s.title}
                          className="w-full h-36 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      </div>
                    )}
                    <h3 className="text-base font-semibold text-white line-clamp-2 mb-2">
                      {s.title}
                    </h3>
                    <div className="mb-3">
                      <RatingStars rating={s.rating} />
                    </div>
                    <Link
                      to={`/review/${s.slug}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      Read more <ChevronRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleReview;


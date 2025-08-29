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
  desktop_environment: string[];
  categories: string[];
  slug: string;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const maxStars = 5;
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} of ${maxStars}`}>
      {Array.from({ length: maxStars }).map((_, i) => (
        <StarIcon key={i} className={"h-5 w-5 " + (i < rating ? "text-yellow-400" : "text-white/20")} />
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20">
      {children}
    </span>
  );

  const SpecRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex items-start gap-2 text-sm text-gray-300">
      <span className="text-gray-400 min-w-[9rem]">{label}:</span>
      <span className="font-medium text-gray-200">{value}</span>
    </div>
  );

  useEffect(() => {
    const fetchReviewsBySlug = async () => {
      if (!slug) return;
      const { data, error } = await supabase.from("reviews").select("*").eq("slug", slug).single();
      if (error) {
        console.error("Error fetching review by slug:", error.message);
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
      if (error) console.error("Error fetching similar reviews:", error.message);
      else setSimilarReviews(data || []);
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
    <div className="bg-black min-h-screen text-white font-sans px-2 sm:px-4 lg:px-6 py-8 w-full overflow-x-hidden">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1
            className="text-3xl sm:text-5xl font-extrabold tracking-tight
                       leading-tight sm:leading-[1.15] pb-1
                       bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500
                       bg-clip-text text-transparent"
          >
            {reviews.title}
          </h1>
        </div>

        {/* Card */}
        <div className="mt-6 rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-5 sm:p-8 shadow-2xl">
            {/* Grid: ändra ordning med order-utilities */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              {/* HÖGER-kolumn ska visas först på mobil: order-1 <lg, order-2 på lg+ */}
              <aside className="order-1 lg:order-2 mt-0 lg:mt-0 lg:col-span-5 lg:sticky lg:top-4 space-y-4">
                {/* Bild */}
                {reviews.imageUrl && (
                  <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
                    <div className="relative w-full aspect-[16/9]">
                      <img
                        src={reviews.imageUrl}
                        alt={reviews.title}
                        className="absolute inset-0 w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                )}

                {/* Specs */}
                <div className="rounded-xl bg-slate-900/80 ring-1 ring-white/10 p-4 sm:p-5">
                  <h3 className="text-base font-semibold text-white mb-3">Specifications</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <SpecRow label="Version" value={reviews.version} />
                    <SpecRow label="OS Type" value={reviews.os_type} />
                    <SpecRow label="Based On" value={reviews.based_on?.join(", ") || "—"} />
                    <SpecRow label="Origin" value={reviews.origin} />
                    <SpecRow label="Architecture" value={reviews.architecture?.join(", ") || "—"} />
                    <SpecRow label="Desktop Env" value={reviews.desktop_environment?.join(", ") || "—"} />
                  </div>

                  {/* Tags under specs */}
                  {reviews.categories?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {reviews.categories.map((c, i) => (
                        <Badge key={i}>{c}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </aside>

              {/* VÄNSTER-kolumn: content visas efter på mobil: order-2 <lg, order-1 på lg+ */}
              <div className="order-2 lg:order-1 lg:col-span-7 mt-6 lg:mt-0">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300/90 mb-4">
                  <span className="inline-flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-cyan-400" />
                    {formatDate(reviews.created_at)}
                  </span>
                  <span className="h-4 w-px bg-white/10" />
                  <RatingStars rating={reviews.rating} />
                </div>

                {/* Content */}
                <div
                  className="text-gray-200 leading-relaxed space-y-4 break-words"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(reviews.content) }}
                />

                {/* Back */}
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
                  <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-black p-4 h-full flex flex-col">
                    {s.imageUrl && (
                      <div className="mb-3 overflow-hidden rounded-xl ring-1 ring-white/10">
                        <div className="relative w-full aspect-[16/9]">
                          <img
                            src={s.imageUrl}
                            alt={s.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
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
                      className="mt-auto inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30 w-full sm:w-auto justify-center"
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
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





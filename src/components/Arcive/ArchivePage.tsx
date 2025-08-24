import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import {
  CalendarIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  TagIcon,
  FolderIcon,
  ComputerDesktopIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  images: string[];
  categories: string[];
  slug: string;
  tags: string[];
  likes: number;
  views: number;
}

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  imageUrl: string;
  created_at: string;
  version: string;
  os_type: string;
  origin: string;
  desktop_environment: string[];
  categories: string[];
  based_on: string[];
  architecture: string[];
  slug: string;
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const max = 5;
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${rating} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => (
        <StarIcon key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400" : "text-white/20"}`} />
      ))}
    </div>
  );
};

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20">
    {children}
  </span>
);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const getExcerpt = (html: string, maxLen = 160) => {
  const text = html.replace(/<[^>]+>/g, "").trim();
  return text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
};

const ArchivePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"posts" | "reviews">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortOption, setSortOption] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from("posts").select("*");
      setPosts(data || []);
    };

    const fetchReviews = async () => {
      const { data } = await supabase.from("reviews").select("*");
      setReviews(data || []);
    };

    fetchPosts();
    fetchReviews();
  }, []);

  // reset pagination on tab/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, sortOption, itemsPerPage]);

  const sortedItems = useMemo(() => {
    const list = activeTab === "posts" ? [...posts] : [...reviews];
    if (sortOption === "date") {
      return list.sort(
        (a, b) => new Date((b as Post | Review).created_at).getTime() - new Date((a as Post | Review).created_at).getTime()
      );
    }
    if (activeTab === "reviews" && sortOption === "rating") {
      return (list as Review[]).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    if (activeTab === "posts" && sortOption === "views") {
      return (list as Post[]).sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }
    return list;
  }, [activeTab, posts, reviews, sortOption]);

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginatePrev = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
    window.scrollTo(0, 0);
  };

  const paginateNext = () => {
    setCurrentPage((p) => Math.min(totalPages, p + 1));
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-10 w-screen">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent mb-6">
          {activeTab === "posts" ? "Posts Archive" : "Reviews Archive"}
        </h1>

        {/* Tabs */}
        <div className="inline-flex items-center rounded-xl bg-slate-900 ring-1 ring-white/10 p-1 mb-6">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "posts"
                ? "bg-cyan-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
            aria-pressed={activeTab === "posts"}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === "reviews"
                ? "bg-cyan-600 text-white"
                : "text-gray-300 hover:text-white"
            }`}
            aria-pressed={activeTab === "reviews"}
          >
            Reviews
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="sort-options" className="text-sm text-gray-300">
              Sort by
            </label>
            <select
              id="sort-options"
              onChange={(e) => setSortOption(e.target.value)}
              value={sortOption}
              className="p-2.5 bg-slate-900 text-white border border-white/10 rounded-lg text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="date">Date</option>
              {activeTab === "posts" && <option value="views">Views</option>}
              {activeTab === "reviews" && <option value="rating">Rating</option>}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="ipp" className="text-sm text-gray-300">
              Per page
            </label>
            <select
              id="ipp"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              className="p-2.5 bg-slate-900 text-white border border-white/10 rounded-lg text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              {[6, 9, 12].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item: Post | Review) => (
            <li key={item.id} className="group">
              <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
                <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-black p-5 shadow-2xl h-full">
                  {/* Image */}
                  {"images" in item && item.images?.[0] && (
                    <div className="mb-4 overflow-hidden rounded-xl ring-1 ring-white/10">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-44 sm:h-52 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  )}
                  {"imageUrl" in item && item.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-xl ring-1 ring-white/10">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-44 sm:h-52 object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">
                    {item.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {getExcerpt(activeTab === "posts" ? (item as Post).content : (item as Review).content || "")}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarIcon className="h-4 w-4 text-cyan-400" />
                      {formatDate(item.created_at)}
                    </span>
                    {"rating" in item && (
                      <span className="inline-flex items-center gap-2">
                        <RatingStars rating={(item as Review).rating} />
                      </span>
                    )}
                  </div>

                  {/* Categories */}
                  {item.categories?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <FolderIcon className="h-4 w-4 text-cyan-400" />
                      <div className="flex flex-wrap gap-2">
                        {item.categories.map((category, i) => (
                          <Badge key={i}>{category}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags for posts */}
                  {activeTab === "posts" && "tags" in item && item.tags?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <TagIcon className="h-4 w-4 text-cyan-400" />
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, i) => (
                          <Badge key={i}>#{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Desktop env for reviews */}
                  {"desktop_environment" in item && (item as Review).desktop_environment?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <ComputerDesktopIcon className="h-4 w-4 text-cyan-400" />
                      <div className="flex flex-wrap gap-2">
                        {(item as Review).desktop_environment.map((de, i) => (
                          <Badge key={i}>{de}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <Link
                    to={`/${activeTab === "posts" ? "post" : "review"}/${item.slug}`}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30"
                    onClick={() => window.scrollTo(0, 0)}
                    aria-label={`Read more about ${item.title}`}
                  >
                    Read more <ChevronRightIcon className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white ring-1 ring-white/10 hover:ring-cyan-400/40 disabled:opacity-40"
            onClick={paginatePrev}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <span className="text-sm text-gray-300">
            Page <span className="font-semibold text-white">{currentPage}</span> of {totalPages}
          </span>
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white ring-1 ring-white/10 hover:ring-cyan-400/40 disabled:opacity-40"
            onClick={paginateNext}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;


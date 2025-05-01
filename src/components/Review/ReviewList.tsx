import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import {
  CalendarIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import AdsSection from "../Ads/adsPage";

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

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const maxStars = 5;
  return (
    <div className="flex items-center space-x-1">
      {[...Array(Math.min(rating, maxStars))].map((_, i) => (
        <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
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
          (a, b) =>
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
          return a.architecture
            .join(", ")
            .localeCompare(b.architecture.join(", "));
        case "desktop_environment":
          return a.desktop_environment
            .join(", ")
            .localeCompare(b.desktop_environment.join(", "));
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    setFilteredReviews(sorted);
  };

  const getExcerpt = (content: string) => {
    return content.length > 150 ? content.substring(0, 150) + "..." : content;
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="p-1 rounded-lg shadow-lg mp-2">
          <AdsSection placement="in-content" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">
          Reviews
        </h1>
        <div className="mb-4">
          <label htmlFor="filter-sort" className="block text-cyan-400 mb-2">
            Filter and Sort
          </label>
          <select
            id="filter-sort"
            className="p-2 bg-gray-800 text-cyan-400 border border-gray-600 rounded"
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="">Select an option</option>
            <optgroup label="Sort By">
              <option value="architecture">Architecture</option>
              <option value="desktop_environment">Desktop Environment</option>
              <option value="rating">Rating</option>
            </optgroup>
          </select>
        </div>

        <ul className="space-y-6">
          {filteredReviews.map((review) => (
            <li
              key={review.id}
              className="bg-white p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-start mb-8"
            >
              {review.imageUrl && (
                <div className="w-full sm:w-1/3 mb-4 sm:mb-0 sm:mr-6">
                  <img
                    src={review.imageUrl}
                    alt={review.title}
                    className="w-full h-64 sm:h-auto object-cover rounded-xl shadow-md transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}

              <div className="flex flex-col justify-between w-full sm:w-2/3">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 hover:text-cyan-500 transition">
                    {review.title}
                  </h2>
                  <p
                    className="text-gray-600 mb-4"
                    dangerouslySetInnerHTML={{
                      __html: getExcerpt(review.content),
                    }}
                  ></p>

                  <div className="flex flex-wrap mb-4">
                    {Array.isArray(review.categories) ? (
                      review.categories.map((category, index) => (
                        <span
                          key={index}
                          className="bg-cyan-500 text-white text-xs font-bold mr-2 mb-2 px-2.5 py-0.5 rounded"
                        >
                          {category}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">No categories</span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 mb-4">
                    <div>
                      <strong>Version:</strong> {review.version}
                    </div>
                    <div>
                      <strong>OS Type:</strong> {review.os_type}
                    </div>
                    <div>
                      <strong>Based On:</strong> {review.based_on.join(", ")}
                    </div>
                    <div>
                      <strong>Origin:</strong> {review.origin}
                    </div>
                    <div>
                      <strong>Architecture:</strong>{" "}
                      {review.architecture.join(", ")}
                    </div>
                    <div>
                      <strong>Desktop Env:</strong>{" "}
                      {review.desktop_environment.join(", ")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-cyan-500" />
                    <span className="text-gray-400 text-sm">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <RatingStars rating={review.rating} />
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to={`/review/${review.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 mt-6 text-sm font-medium text-cyan-600 bg-white border border-cyan-600 rounded-lg shadow hover:bg-cyan-600 hover:text-white transition-all duration-300"
                  >
                    Read more{" "}
                    <ChevronRightIcon className="h-5 w-5 inline-block" />
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

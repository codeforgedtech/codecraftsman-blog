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
              className="p-4 sm:p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg flex flex-col sm:flex-row-reverse"
            >
              {review.imageUrl && (
                <img
                  src={review.imageUrl}
                  alt={review.title}
                  className="w-full h-48 sm:h-full object-cover rounded-lg border-4 border-cyan-500 shadow-xl mb-4 sm:mb-0 sm:w-1/3 sm:h-auto sm:ml-6"
                />
              )}

              <div className="flex flex-col sm:w-2/3">
                <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-4 hover:text-cyan-300 transition duration-300">
                  {review.title}
                </h2>
                <p
                  className="text-sm sm:text-lg text-gray-300 mb-4"
                  dangerouslySetInnerHTML={{
                    __html: getExcerpt(review.content),
                  }}
                ></p>
                <div className="mt-4">
                  {Array.isArray(review.categories) ? (
                    review.categories.map((category, index) => (
                      <span
                        key={index}
                        className="bg-cyan-700 text-white text-xs font-bold mr-2 px-2.5 py-0.5 rounded"
                      >
                        {category}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No categories</span>
                  )}
                </div>

                <div className="mt-4 text-sm text-gray-300">
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
                    <strong>Desktop Environment:</strong>{" "}
                    {review.desktop_environment.join(", ")}
                  </div>
                </div>
                <div className="text-xs sm:text-sm text-gray-400 italic">
                  <CalendarIcon className="h-5 w-5 text-cyan-400 inline-block mr-1" />
                  {new Date(review.created_at).toLocaleDateString()}
                </div>

                {/* RatingStars Component */}
                <div className="mt-2">
                  <RatingStars rating={review.rating} />
                </div>
                <div className="mt-4">
                  <Link
                    to={`/review/${review.slug}`}
                    className="inline-block text-cyan-400 hover:text-cyan-300 mt-4 py-2 px-6 border-2 border-cyan-400 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
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

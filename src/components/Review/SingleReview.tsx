import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import DOMPurify from 'dompurify';
import { CalendarIcon, ChevronRightIcon, HeartIcon } from '@heroicons/react/24/solid';
import AdsSection from '../Ads/adsPage';

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
  desktop_environment: [];
  categories: string[];
  slug: string;
}

const SingleReview: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [reviews, setReviews] = useState<Reviews | null>(null);
  const [similarReviews, setSimilarReviews] = useState<Reviews[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);

  };
  useEffect(() => {
    const fetchReviewsBySlug = async () => {
      if (slug) {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error fetching post by slug:', error.message);
        } else {
          setReviews(data);
          if (data) {
            fetchSimilarReviews(data.categories, data.id);
          }
        }
      }
    };

    const fetchSimilarReviews = async (categories: string[], reviewId: string) => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .contains('categories', categories)
        .neq('id', reviewId)
        .limit(4);

      if (error) {
        console.error('Error fetching similar reviews:', error.message);
      } else {
        setSimilarReviews(data || []);
      }
    };

    fetchReviewsBySlug();
  }, [slug]);

  if (!reviews) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-black p-6 rounded-lg shadow-lg mb-8">
          <AdsSection placement="post-top" />
        </div>

        <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg">
          <img
            src={reviews.imageUrl}
            alt={reviews.title}
            className="w-full h-64 object-cover rounded-lg mb-4 border-4 border-cyan-500 shadow-xl"
          />

          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-4 hover:text-cyan-300 transition duration-300">
              {reviews.title}
            </h1>
          </div>
          <div
            className="text-sm sm:text-lg text-gray-300 mb-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(reviews.content),
            }}
          />
          <div className="text-sm text-gray-400 italic">
            <CalendarIcon className="h-5 w-5 text-cyan-400 inline-block mr-1" />
            {new Date(reviews.created_at).toLocaleDateString()}
          </div>
          <div className="mt-4 flex space-x-4">
            <div className="flex items-center space-x-1">
              <HeartIcon className="h-5 w-5 text-red-500" />
              <span className="text-gray-300">{reviews.rating} Rating</span>
            </div>
          </div>

          <div className="mt-4">
            {reviews.categories.map((category, index) => (
              <span
                key={index}
                className="bg-cyan-700 text-white text-xs font-bold mr-2 px-2.5 py-0.5 rounded"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-300">
            <div>
              <strong>Version:</strong> {reviews.version}
            </div>
            <div>
              <strong>OS Type:</strong> {reviews.os_type}
            </div>
            <div>
              <strong>Based On:</strong> {reviews.based_on.join(', ')}
            </div>
            <div>
              <strong>Origin:</strong> {reviews.origin}
            </div>
            <div>
              <strong>Architecture:</strong> {reviews.architecture.join(', ')}
            </div>
            <div>
              <strong>Desktop Environment:</strong> {reviews.desktop_environment.join(', ')}
            </div>
          </div>

          {/* Similar Reviews */}
          {similarReviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl text-cyan-400 mb-4">Similar Reviews</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similarReviews.map((similarReview) => (
                  <div
                    key={similarReview.id}
                    className="p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={similarReview.imageUrl}
                      alt={similarReview.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                      {similarReview.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-2">
                      Rating: {similarReview.rating}
                    </p>
                    <Link
              to={`/review/${similarReview.slug}`}
              className="inline-block text-cyan-400 hover:text-cyan-300 mt-4 transition duration-300"
              onClick={handleScrollToTop}
            >
              Read more <ChevronRightIcon className="h-5 w-5 inline-block" />
            </Link>
                    
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-cyan-700 text-white text-xs font-bold px-6 py-2 rounded hover:bg-cyan-600 transition duration-300"
            >
              Tillbaka
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleReview;










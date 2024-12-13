import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import {
  CalendarIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import AdsSection from '../Ads/adsPage';

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

const ArchivePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reviews'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredItems, setFilteredItems] = useState<(Post | Review)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortOption, setSortOption] = useState('date');

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*');
      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data || []);
      }
    };

    const fetchReviews = async () => {
      const { data, error } = await supabase.from('reviews').select('*');
      if (error) {
        console.error('Error fetching reviews:', error.message);
      } else {
        setReviews(data || []);
      }
    };

    fetchPosts();
    fetchReviews();
  }, []);

  useEffect(() => {
    const items = activeTab === 'posts' ? posts : reviews;
    const sortedItems = sortItems(items);
    setFilteredItems(sortedItems);
  }, [activeTab, posts, reviews, sortOption]);

  const sortItems = (items: (Post | Review)[]) => {
    if (sortOption === 'date') {
      return [...items].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortOption === 'rating' && activeTab === 'reviews') {
      return [...(items as Review[])].sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'views' && activeTab === 'posts') {
      return [...(items as Post[])].sort((a, b) => b.views - a.views);
    }
    return items;
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginatePrev = () => {
    setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0);
  };

  const paginateNext = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
  };
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);

  };
  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
      <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-black p-6 rounded-lg shadow-lg mb-8">
          <AdsSection placement="in-content" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">
          {activeTab === 'posts' ? 'Posts Archive' : 'Reviews Archive'}
        </h1>

        {/* Tab Selector */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 rounded ${
              activeTab === 'posts'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-cyan-400'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded ${
              activeTab === 'reviews'
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-800 text-cyan-400'
            }`}
          >
            Reviews
          </button>
        </div>

        {/* Sort Options */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-auto">
            <label htmlFor="sort-options" className="block text-cyan-400 mb-2">
              Sort {activeTab === 'posts' ? 'Posts' : 'Reviews'}
            </label>
            <select
              id="sort-options"
              onChange={(e) => setSortOption(e.target.value)}
              value={sortOption}
              className="w-full sm:w-auto px-4 py-2 rounded bg-gray-800 text-cyan-400 border border-gray-600"
            >
              <option value="date">Sort by Date</option>
              {activeTab === 'posts' && <option value="views">Sort by Views</option>}
              {activeTab === 'reviews' && (
                <option value="rating">Sort by Rating</option>
              )}
            </select>
          </div>
        </div>

        {/* Items List */}
        <ul className="space-y-6">
          {currentItems.map((item: Post | Review) => (
            <li
              key={item.id}
              className="p-4 sm:p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg"
            >
              {'images' in item && item.images[0] && (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-lg mb-4 border-4 border-cyan-500 shadow-xl"
                />
              )}
              {'imageUrl' in item && item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-lg mb-4 border-4 border-cyan-500 shadow-xl"
                />
              )}
              <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-4 hover:text-cyan-300 transition duration-300">
                {item.title}
              </h2>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <CalendarIcon className="h-5 w-5" />
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </span>
                {'rating' in item && (
                  <span className="text-yellow-400 font-semibold">
                    Rating: {item.rating}
                  </span>
                )}
                {'views' in item && (
                  <span className="text-cyan-400 font-semibold">
                    Views: {item.views}
                  </span>
                )}
              </div>

              <Link
                to={`/${activeTab === 'posts' ? 'post' : 'review'}/${item.slug}`}
                className="text-cyan-500 flex items-center space-x-2 mt-4"
                onClick={handleScrollToTop}
              >
                <span>Read More</span>
                <ChevronRightIcon className="h-5 w-5" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="flex justify-center sm:justify-between items-center mt-8">
          <button
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50"
            onClick={paginatePrev}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <span className="mx-4 text-cyan-400 font-semibold">
            {currentPage} of {Math.ceil(filteredItems.length / itemsPerPage)}
          </span>
          <button
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50"
            onClick={paginateNext}
            disabled={indexOfLastItem >= filteredItems.length}
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;




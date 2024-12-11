import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { CalendarIcon, ChevronRightIcon, EyeIcon, ChatBubbleLeftIcon, ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import AdsSection from '../Ads/adsPage';
import { Link } from 'react-router-dom';

interface PostList {
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

interface Comment {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
}

const ArchivePage: React.FC = () => {
  const [posts, setPosts] = useState<PostList[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);  // Justera antal inlägg per sida
  const [sortOption, setSortOption] = useState('date');  // Standard sortering efter datum
   // State för söktermen
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentSortOrder, setCommentSortOrder] = useState<'asc' | 'desc'>('desc');  // Nytt tillstånd för att växla mellan stigande och fallande
  useEffect(() => {
    // Scroll to top when component is mounted
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*');
      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        const sortedPosts = sortPosts(data || []);
        setPosts(sortedPosts);
        setFilteredPosts(sortedPosts);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments') // Ersätt med din tabellnamn
        .select('*');

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        setComments(data);
      }
    };

    fetchComments();
  }, []);

  const sortPosts = (posts: PostList[]) => {
    if (sortOption === 'date') {
      return posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortOption === 'views') {
      return posts.sort((a, b) => b.views - a.views);
    }
    return posts;
  };

  const handleSortChange = (option: string) => {
    setSortOption(option); // Uppdatera det valda sorteringsalternativet

    let sortedPosts: PostList[] = [];

    switch (option) {
      case 'date':
        sortedPosts = [...posts].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'views':
        sortedPosts = [...posts].sort((a, b) => b.views - a.views);
        break;
      case 'category':
        sortedPosts = [...posts].sort((a, b) => {
          const categoryA = a.categories[0] || '';
          const categoryB = b.categories[0] || '';
          return categoryA.localeCompare(categoryB);
        });
        break;
      case 'comments':
        sortedPosts = [...posts].sort((a, b) => {
          const commentCountA = getCommentCount(a.id);
          const commentCountB = getCommentCount(b.id);
          return commentSortOrder === 'desc' 
            ? commentCountB - commentCountA 
            : commentCountA - commentCountB; // Sortera efter kommentarer, baserat på vald ordning
        });
        break;
      default:
        sortedPosts = [...posts]; // Om inget alternativ är valt, visa som vanligt
    }

    setFilteredPosts(sortedPosts);
  };

  const getCommentCount = (postId: string) => {
    const postComments = comments.filter((comment) => comment.post_id === postId);
    return postComments.length;
  };

  const handleCombinedChange = (value: string) => {
    if (value.startsWith('comments-')) {
      const order = value.split('-')[1];
      toggleCommentSortOrder(order); // Funktion för att ändra kommentarsordning
    } else {
      handleSortChange(value); // Funktion för att ändra sortering
    }
  };

  // Beräkna vilka inlägg som ska visas baserat på aktuell sida
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Byt till föregående sida
  const paginatePrev = () => {
    setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0); // Rullar till toppen
  };

  const paginateNext = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0); // Rullar till toppen
  };

  const toggleCommentSortOrder = (_order: string) => {
    setCommentSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    handleSortChange('comments'); // Uppdatera sorteringen baserat på den nya ordningen
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
    <div className="w-full max-w-6xl">
    <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-black p-6 rounded-lg shadow-lg mb-8">

<AdsSection placement="in-content" />
</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">Archive</h1>

        <div className="mb-4 flex flex-col sm:flex-row gap-4">
  <div className="w-full sm:w-auto">
    <label htmlFor="combined-options" className="block text-cyan-400 mb-2">
      Select Option
    </label>
    <select
      id="combined-options"
      onChange={(e) => handleCombinedChange(e.target.value)}
      value={sortOption}
      className="w-full sm:w-auto px-4 py-2 rounded bg-gray-800 text-cyan-400 border border-gray-600"
    >
      <optgroup label="Sort Options">
        <option value="date">Sort by Date</option>
        <option value="views">Sort by Views</option>
        <option value="category">Sort by Category</option>
        <option value="comments">Sort by Comments</option>
      </optgroup>
      <optgroup label="Comment Order">
        <option value="comments-desc">Descending Comments</option>
        <option value="comments-asc">Ascending Comments</option>
      </optgroup>
    </select>
  </div>
</div>


        

        <ul className="space-y-6">
          {currentPosts.map((post) => (
            <li key={post.id} className="p-4 sm:p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg">
              {post.images[0] && (
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg mb-4 border-4 border-cyan-500 shadow-xl"
                />
              )}
              <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-4 hover:text-cyan-300 transition duration-300">{post.title}</h2>
             
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <CalendarIcon className="h-5 w-5" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <EyeIcon className="h-5 w-5" />
                  <span>{post.views}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  <span>{getCommentCount(post.id)}</span>
                </span>
                {post.categories.length > 0 && (
                  <span className="text-sm bg-cyan-600 text-white px-3 py-1 rounded-full">
                    {post.categories[0]}
                  </span>
                )}
              </div>
              <Link to={`/post/${post.slug}`} className="text-cyan-500 flex items-center space-x-2 mt-4">
                <span>Read More</span>
                <ChevronRightIcon className="h-5 w-5" />
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex justify-center sm:justify-between items-center mt-8">
  <button
    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50"
    onClick={paginatePrev}
    disabled={currentPage === 1}
  >
   <ArrowLeftIcon className="h-5 w-5" />
  </button>
  <span className="mx-4 text-cyan-400 font-semibold">
    {currentPage} of {Math.ceil(filteredPosts.length / postsPerPage)}
  </span>
  <button
    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50"
    onClick={paginateNext}
    disabled={indexOfLastPost >= filteredPosts.length}
  >
    <ArrowRightIcon className="h-5 w-5" />
  </button>
</div>
      </div>
    </div>
  );
};

export default ArchivePage;



import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { CalendarIcon, ChevronRightIcon, EyeIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import SearchBar from '../Search/SearchBar'; 
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
  const [, setSearchTerm] = useState<string>('');  // State för söktermen
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentSortOrder, setCommentSortOrder] = useState<'asc' | 'desc'>('desc');  // Nytt tillstånd för att växla mellan stigande och fallande

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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.title.toLowerCase().includes(term.toLowerCase()) || post.content.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredPosts(filtered);
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

  const toggleCommentSortOrder = () => {
    setCommentSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    handleSortChange('comments'); // Uppdatera sorteringen baserat på den nya ordningen
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans p-8 flex items-center justify-center w-screen">
      <div className="w-full max-w-6xl p-6 mx-auto">
        <h1 className="text-4xl font-bold text-center text-cyan-500 mb-8">Archive</h1>

        <div className="mb-4 flex justify-center space-x-4">
          <select
            onChange={(e) => handleSortChange(e.target.value)}
            value={sortOption}
            className="px-4 py-2 rounded bg-gray-700 text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="views">Sort by Views</option>
            <option value="category">Sort by Category</option>
            <option value="comments">Sort by Comments</option>
          </select>
          <select
            onChange={toggleCommentSortOrder}
            className="px-4 py-2 rounded bg-gray-700 text-white"
            value={commentSortOrder}
          >
            <option value="desc">Descending Comments</option>
            <option value="asc">Ascending Comments</option>
          </select>
        </div>

        <SearchBar onSearch={handleSearch} />

        <ul className="space-y-8">
          {currentPosts.map((post) => (
            <li key={post.id} className="p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
              {post.images[0] && (
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg mb-4 border-4 border-cyan-500 shadow-xl"
                />
              )}
              <h2 className="text-3xl font-semibold text-cyan-400 mb-4">{post.title}</h2>
             
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

        <div className="flex justify-between mt-8">
          <button
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            onClick={paginatePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            onClick={paginateNext}
            disabled={indexOfLastPost >= filteredPosts.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;



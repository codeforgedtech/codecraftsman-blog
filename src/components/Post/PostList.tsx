import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import axios from 'axios';
import { PencilIcon, CalendarIcon, ChevronRightIcon, ChatBubbleLeftIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/solid';
import SearchBar from '../Search/SearchBar'; 
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

interface Reply {
  id: string;
  comment_id: string;
  content: string;
  created_at: string;
  parent_reply_id: string | null;
}

interface Like {
  id: string;
  post_id: string;
  ip_address: string;
  created_at: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<PostList[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostList[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [modalVisible, setModalVisible] = useState(false); // State för att visa modal
  const [likedPostId, setLikedPostId] = useState<string | null>(null); // För att hålla reda på vilket inlägg som gillades
  const [modalMessage, setModalMessage] = useState<string>(''); // Meddelande för modalen
  const [searchTerm, setSearchTerm] = useState<string>(''); // State för söktermen
  const [searchType, setSearchType] = useState('content'); 
  const getIpAddress = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return 'unknown';
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('posts').select('*');
      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        const sortedPosts = data?.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setPosts(sortedPosts || []);
        setFilteredPosts(sortedPosts || []); 
      }
    };

    const fetchComments = async () => {
      const { data, error } = await supabase.from('comments').select('*');
      if (error) {
        console.error('Error fetching comments:', error.message);
      } else {
        setComments(data || []);
      }
    };

    const fetchReplies = async () => {
      const { data, error } = await supabase.from('replies').select('*');
      if (error) {
        console.error('Error fetching replies:', error.message);
      } else {
        setReplies(data || []);
      }
    };

    const fetchLikes = async () => {
        const { data, error } = await supabase.from('likes').select('*');
        if (error) {
          console.error('Error fetching likes:', error.message);
        } else {
          // Filtrera bort ogiltiga objekt
          const validLikes = data?.filter(like => like?.post_id != null);
          setLikes(validLikes || []);
        }
      };

    fetchPosts();
    fetchComments();
    fetchReplies();
    fetchLikes();
  }, []);
  const handleSearch = (term: string) => {
    setSearchTerm(term); // Uppdatera söktermen
    if (!term) {
      setFilteredPosts(posts); // Om söktermen är tom, visa alla inlägg
    } else {
      const filtered = posts.filter((post) => {
        switch (searchType) {
          case 'category':
            return post.categories.some((category) => category.toLowerCase().includes(term.toLowerCase()));
          case 'tag':
            return post.tags.some((tag) => tag.toLowerCase().includes(term.toLowerCase()));
          default:
            return post.title.toLowerCase().includes(term.toLowerCase()) || post.content.toLowerCase().includes(term.toLowerCase());
        }
      });
      setFilteredPosts(filtered); // Uppdatera de filtrerade inläggen
    }
  };

  const getExcerpt = (content: string) => {
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };
  

  const getCommentCount = (postId: string) => {
    const postComments = comments.filter((comment) => comment.post_id === postId);
    const postReplies = replies.filter((reply) => 
      postComments.some((comment) => comment.id === reply.comment_id)
    );
    return postComments.length + postReplies.length;
  };

  const handleLike = async (postId: string) => {
    const ipAddress = await getIpAddress();
    const existingLike = likes.find((like) => like.post_id === postId && like.ip_address === ipAddress);
  
    if (existingLike) {
      // Om användaren redan har gillat detta inlägg, visa modalen och sätt meddelandet
      setLikedPostId(postId); // Här kan du sätta likedPostId till inlägget för att visa att det redan är gillat
      setModalMessage('You have already liked this post!'); // Sätt meddelandet för att informera användaren
      setModalVisible(true);
    } else {
      // Annars, spara en ny like
      const { data, error } = await supabase
        .from('likes')
        .insert([
          {
            post_id: postId,
            ip_address: ipAddress,
            created_at: new Date().toISOString(),
          },
        ])
        .single();
  
      if (error) {
        console.error('Error inserting like:', error.message);
      } else {
        setLikes((prevLikes) => [...prevLikes, data]);
        setLikedPostId(postId); // Markera som gillat
        setModalMessage('Thanks for liking!'); // Sätt meddelandet för att tacka användaren
        setModalVisible(true); // Visa modalen
      }
    }
  };

  const getLikeCount = (postId: string) => {
    return likes.filter((like) => like?.post_id === postId).length;
  };

  const closeModal = () => {
    setModalVisible(false);
    window.location.reload();
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans p-8 flex items-center justify-center w-screen">
      <div className="w-full max-w-6xl p-6">
        <h1 className="text-4xl font-bold text-center text-cyan-500 mb-8">
          Posts
        </h1>
        <div className="mb-4 flex justify-center space-x-4">
          <button 
            className={`px-4 py-2 rounded ${searchType === 'content' ? 'bg-cyan-600' : 'bg-gray-700'}`}
            onClick={() => setSearchType('content')}
          >
            Content
          </button>
          <button 
            className={`px-4 py-2 rounded ${searchType === 'category' ? 'bg-cyan-600' : 'bg-gray-700'}`}
            onClick={() => setSearchType('category')}
          >
            Category
          </button>
          <button 
            className={`px-4 py-2 rounded ${searchType === 'tag' ? 'bg-cyan-600' : 'bg-gray-700'}`}
            onClick={() => setSearchType('tag')}
          >
            Tags
          </button>
        </div>
        <SearchBar onSearch={handleSearch} />
        {filteredPosts.length === 0 && searchTerm && (
  <p className="text-center text-gray-400 mt-4">
    No posts found for "<span className="font-bold">{searchTerm}</span>"
  </p>
)}
        <ul className="space-y-8">
          {filteredPosts.map((post) => (
            <li
              key={post.id}
              className="p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              {post.images[0] && (
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-lg mb-4 border-4 border-cyan-500 shadow-xl"
                />
              )}

              <div className="flex items-center space-x-2">
                <PencilIcon className="h-6 w-6 text-cyan-400" />
                <h2 className="text-3xl font-semibold text-cyan-400 mb-4 hover:text-cyan-300 transition duration-300">
                  {post.title}
                </h2>
              </div>

              <p
                className="text-lg text-gray-300 mb-4"
                dangerouslySetInnerHTML={{ __html: getExcerpt(post.content) }}
              ></p>

              <div className="text-sm text-gray-400 italic">
                <CalendarIcon className="h-5 w-5 text-cyan-400 inline-block mr-1" />
                {new Date(post.created_at).toLocaleDateString()}
              </div>

              <div className="mt-2 flex space-x-4">
                <div className="flex items-center space-x-1">
                  <HeartIcon
                    className={`h-5 w-5 cursor-pointer ${likedPostId === post.id ? 'text-gray-500' : 'text-red-500'}`}
                    onClick={() => handleLike(post.id)}
                  />
                  <span className="text-gray-300">{getLikeCount(post.id)} Likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <EyeIcon className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-300">{post.views} Views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ChatBubbleLeftIcon className="h-5 w-5 text-cyan-400" />
                  <span className="text-gray-300">{getCommentCount(post.id)} Comments</span>
                </div>
              </div>

              <div className="mt-4">
                {post.categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-cyan-700 text-white text-xs font-bold mr-2 px-2.5 py-0.5 rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <Link
                to={`/post/${post.slug}`}
                className="inline-block text-cyan-400 hover:text-cyan-300 mt-4 transition duration-300"
              >
                Read more <ChevronRightIcon className="h-5 w-5 inline-block" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-900 p-8 rounded-xl shadow-lg text-white w-1/3">
            <h2 className="text-2xl mb-4">{modalMessage}</h2>
            <button
              onClick={closeModal}
              className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-full mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;











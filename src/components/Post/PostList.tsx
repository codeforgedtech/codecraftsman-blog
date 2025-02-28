import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import {
  CalendarIcon,
  ChevronRightIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/solid";
import SearchBar from "../Search/SearchBar";
import AdsSection from "../Ads/adsPage";

interface PostList {
  id: string;
  title: string;
  content: string;
  created_at: string;
  images: string[]; // Array of image URLs
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
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [, setLikes] = useState<Like[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [modalMessage] = useState<string>("");
  const [searchType, setSearchType] = useState("content");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<PostList[]>(posts);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*");
      if (error) {
        console.error("Error fetching posts:", error.message);
      } else {
        const sortedPosts = data?.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setPosts(sortedPosts || []);
        setFilteredPosts(sortedPosts || []);
      }
    };

    const fetchComments = async () => {
      const { data, error } = await supabase.from("comments").select("*");
      if (error) {
        console.error("Error fetching comments:", error.message);
      } else {
        setComments(data || []);
      }
    };

    const fetchReplies = async () => {
      const { data, error } = await supabase.from("replies").select("*");
      if (error) {
        console.error("Error fetching replies:", error.message);
      } else {
        setReplies(data || []);
      }
    };

    const fetchLikes = async () => {
      const { data, error } = await supabase.from("likes").select("*");
      if (error) {
        console.error("Error fetching likes:", error.message);
      } else {
        const validLikes = data?.filter((like) => like?.post_id != null);
        setLikes(validLikes || []);
      }
    };

    fetchPosts();
    fetchComments();
    fetchReplies();
    fetchLikes();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term); // Store search term in state
    if (!term) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) => {
        switch (searchType) {
          case "category":
            return post.categories.some((category) =>
              category.toLowerCase().includes(term.toLowerCase())
            );
          case "tag":
            return post.tags.some((tag) =>
              tag.toLowerCase().includes(term.toLowerCase())
            );
          default:
            return (
              post.title.toLowerCase().includes(term.toLowerCase()) ||
              post.content.toLowerCase().includes(term.toLowerCase())
            );
        }
      });
      setFilteredPosts(filtered);
    }
  };

  const getExcerpt = (content: string) => {
    return content.length > 150 ? content.substring(0, 150) + "..." : content;
  };

  const getCommentCount = (postId: string) => {
    const postComments = comments.filter(
      (comment) => comment.post_id === postId
    );
    const postReplies = replies.filter((reply) =>
      postComments.some((comment) => comment.id === reply.comment_id)
    );
    return postComments.length + postReplies.length;
  };

  const closeModal = () => {
    setModalVisible(false);
    window.location.reload();
  };
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        {/* Header och ads */}
        <div className="p-1 rounded-lg shadow-lg mp-2">
          <AdsSection placement="post-top" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">
          Posts
        </h1>

        {/* Filter och Search */}
        <div className="flex flex-wrap items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
          <div>
            <select
              id="filter-dropdown"
              className="sm:w-48 p-2 bg-gray-800 text-cyan-400 border border-gray-600 rounded text-sm sm:text-base"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="content">Content</option>
              <option value="category">Category</option>
              <option value="tag">Tags</option>
            </select>
          </div>
          <SearchBar value={searchTerm} onSearch={handleSearch} />
        </div>

        <ul className="space-y-6">
          {filteredPosts.map((post, index) => (
            <li
              key={post.id}
              className="p-4 sm:p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg"
            >
              {index === Math.floor(filteredPosts.length / 2) && (
                <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-black p-6 rounded-lg shadow-lg mb-8">
                  <AdsSection placement="middle" />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-cyan-400 mb-4 hover:text-cyan-300 transition duration-300">
                  {post.title}
                </h2>
              </div>

              {/* Visa bilder från inlägget */}
              {post.images.length > 0 && (
                <div className="flex space-x-4 mb-4">
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-48 sm:h-64 object-cover rounded-lg mb-4 border-4 border-cyan-500 shadow-xl"
                    />
                  ))}
                </div>
              )}

              <p
                className="text-sm sm:text-lg text-gray-300 mb-4"
                dangerouslySetInnerHTML={{ __html: getExcerpt(post.content) }}
              ></p>

              <div className="text-xs sm:text-sm text-gray-400 italic">
                <CalendarIcon className="h-5 w-5 text-cyan-400 inline-block mr-1" />
                {new Date(post.created_at).toLocaleDateString()}
              </div>

              <div className="mt-2 flex space-x-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-1"></div>

                <div className="flex items-center space-x-1">
                  <ChatBubbleLeftIcon className="h-5 w-5 text-cyan-400" />
                  <span className="text-gray-300">
                    {getCommentCount(post.id)} Comments
                  </span>
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
                className="inline-block text-cyan-400 hover:text-cyan-300 mt-4 py-2 px-6 border-2 border-cyan-400 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                onClick={handleScrollToTop}
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

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import {
  CalendarIcon,
  ChevronRightIcon,
  ChatBubbleLeftIcon,
  TagIcon,
  FolderIcon,
} from "@heroicons/react/24/solid";
import SearchBar from "../Search/SearchBar";
import AdsSection from "../Ads/adsPage";

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
    setSearchTerm(term);
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
        {/* Ads Section */}
        <div className="p-1 mb-8">
          <AdsSection placement="post-top" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-600 mb-8">
          Posts
        </h1>

        {/* Filter och Search */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <select
            id="filter-dropdown"
            className="p-2 bg-white text-cyan-600 border border-cyan-600 rounded-lg text-sm shadow hover:border-cyan-400 transition-all"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="content">Content</option>
            <option value="category">Category</option>
            <option value="tag">Tags</option>
          </select>
          <SearchBar value={searchTerm} onSearch={handleSearch} />
        </div>

        {/* Lista av posts */}
        <ul className="space-y-10">
          {filteredPosts.map((post, index) => (
           <li
  key={post.id}
  className="relative p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
>
  
<div className="absolute bottom-4 right-4 
                w-12 h-12 
                sm:w-14 sm:h-14 
                md:w-16 md:h-16 
                lg:w-20 lg:h-20">
  <img
    src="/src/assets/mascot.png"
    alt="CodeCraftsman mascot"
    className="w-full h-full object-cover rounded-full border-2 border-cyan-500 shadow hover:scale-105 transition-transform"
  />
</div>
              {index === Math.floor(filteredPosts.length / 2) && (
                <div className="my-8">
                  <AdsSection placement="middle" />
                </div>
              )}

              <h2 className="text-2xl font-semibold text-cyan-600 mb-4">
                {post.title}
              </h2>

              <div className="rounded-xl overflow-hidden mb-6">
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="w-full h-[400px] object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>

              <p
                className="text-gray-700 text-base mb-4"
                dangerouslySetInnerHTML={{ __html: getExcerpt(post.content) }}
              ></p>

              <div className="flex items-center text-sm text-gray-500 mb-2">
                <CalendarIcon className="h-5 w-5 text-cyan-600 mr-1" />
                {new Date(post.created_at).toLocaleDateString()}
              </div>

              <div className="flex items-center space-x-6 text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <ChatBubbleLeftIcon className="h-5 w-5 text-cyan-600" />
                  {getCommentCount(post.id)} Comments
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                <FolderIcon className="h-5 w-5 text-cyan-600" />
                {post.categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-cyan-500 text-white text-xs font-bold mr-2 mb-2 px-2.5 py-0.5 rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <TagIcon className="h-5 w-5 text-cyan-600" />
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-cyan-500 text-white text-xs font-bold mr-2 mb-2 px-2.5 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <Link
                to={`/post/${post.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-cyan-600 bg-white border border-cyan-600 rounded-lg shadow hover:bg-cyan-600 hover:text-white transition-all duration-300"
                onClick={handleScrollToTop}
              >
                Read more <ChevronRightIcon className="h-5 w-5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-black w-1/3">
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

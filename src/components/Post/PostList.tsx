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

  // search/filter
  const [searchType, setSearchType] = useState("content");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<PostList[]>(posts);

  // pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

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

  // Reset till sida 1 när filter/sök/sidstorlek ändras
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchType, posts, pageSize]);

  const getExcerpt = (content: string) => {
    const clean = content.replace(/<[^>]+>/g, "");
    return clean.length > 180 ? clean.substring(0, 180) + "…" : clean;
  };

  const getCommentCount = (postId: string) => {
    const postComments = comments.filter((comment) => comment.post_id === postId);
    const postReplies = replies.filter((reply) =>
      postComments.some((comment) => comment.id === reply.comment_id)
    );
    return postComments.length + postReplies.length;
  };

  // Removed unused closeModal function

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20">
      {children}
    </span>
  );

  // Pagination calculations
  const totalItems = filteredPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pageItems = filteredPosts.slice(startIndex, endIndex);

  const goToPage = (p: number) => {
    const clamped = Math.min(Math.max(1, p), totalPages);
    setCurrentPage(clamped);
    handleScrollToTop();
  };


 return (
  // ändra: w-screen -> w-full, justera padding, och lägg till overflow-x-hidden
  <div className="bg-black min-h-screen text-white font-sans px-2 sm:px-4 lg:px-6 py-8 w-full overflow-x-hidden">
    {/* ändra: behåll full bredd; ta bort onödig extra padding här så vi inte dubblar */}
    <div className="w-full">
      {/* Header */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent mb-8">
        Posts
      </h1>

      {/* Filters & Search + Page size */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
        <select
          id="filter-dropdown"
          className="p-2.5 bg-slate-900 text-white border border-white/10 rounded-lg text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="content">Content</option>
          <option value="category">Category</option>
          <option value="tag">Tags</option>
        </select>

        <SearchBar value={searchTerm} onSearch={handleSearch} />

        <div className="ml-auto flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-gray-300">
            Per page
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="p-2.5 bg-slate-900 text-white border border-white/10 rounded-lg text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      {pageItems.length === 0 ? (
        <p className="text-gray-400">No posts found.</p>
      ) : (
        // ändra: gör grid mer flytande upp till 4 kolumner på riktigt stora skärmar
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {pageItems.map((post) => (
            <li key={post.id} className="group">
              <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
                <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-black p-5 shadow-2xl h-full">
                  {/* ändra: använd aspect-ratio istället för fasta höjder för stabil layout */}
                  {post.images?.[0] && (
                    <div className="mb-4 overflow-hidden rounded-xl ring-1 ring-white/10">
                      <div className="relative w-full aspect-[16/9]">
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {getExcerpt(post.content)}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarIcon className="h-4 w-4 text-cyan-400" />
                      {formatDate(post.created_at)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ChatBubbleLeftIcon className="h-4 w-4 text-cyan-400" />
                      {getCommentCount(post.id)} comments
                    </span>
                  </div>

                  {post.categories?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <FolderIcon className="h-4 w-4 text-cyan-400" />
                      <div className="flex flex-wrap gap-2">
                        {post.categories.map((category, i) => (
                          <Badge key={i}>{category}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <TagIcon className="h-4 w-4 text-cyan-400" />
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, i) => (
                          <Badge key={i}>#{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    to={`/post/${post.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30"
                    onClick={handleScrollToTop}
                    aria-label={`Read more about ${post.title}`}
                  >
                    Read more <ChevronRightIcon className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-400">
            Showing <span className="text-white">{totalItems === 0 ? 0 : startIndex + 1}</span>
            {"–"}
            <span className="text-white">{endIndex}</span> of{" "}
            <span className="text-white">{totalItems}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-2 rounded-lg bg-slate-900 text-white ring-1 ring-white/10 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              Prev
            </button>
            <span className="text-sm text-gray-300">
              Page <span className="text-white">{currentPage}</span> of{" "}
              <span className="text-white">{totalPages}</span>
            </span>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-2 rounded-lg bg-slate-900 text-white ring-1 ring-white/10 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>

    {modalVisible && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-2xl ring-1 ring-white/10 w-11/12 max-w-md">
          <h2 className="text-xl font-semibold mb-3">{modalMessage}</h2>
          <button
            onClick={() => {
              setModalVisible(false);
            }}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30"
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



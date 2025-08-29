import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import DOMPurify from "dompurify";
import { useParams, Link } from "react-router-dom";
import {
  CalendarIcon,
  FolderIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/20/solid";

// Typer
interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  images: string[];
  slug: string;
  categories: string[];
  tags: string[];
  likes: number;
  views: number;
}

interface Comment {
  parent_reply_id: unknown;
  id: string;
  post_id: string;
  content: string;
  user_id: string;
  user_name: string;
  user_email: string;
  created_at: string;
}

interface Reply {
  id: string;
  comment_id: string;
  content: string;
  user_id: string;
  user_name: string;
  user_email: string;
  created_at: string;
  parent_reply_id: string | null;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
}

const SinglePost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // State
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [, setLikesCount] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);

  // Forms
  const [newComment, setNewComment] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [newReply, setNewReply] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyEmail, setReplyEmail] = useState("");

  const [num1, setNum1] = useState<number>(Math.floor(Math.random() * 10) + 1);
  const [num2, setNum2] = useState<number>(Math.floor(Math.random() * 10) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const [replyNum1, setReplyNum1] = useState<number>(Math.floor(Math.random() * 10) + 1);
  const [replyNum2, setReplyNum2] = useState<number>(Math.floor(Math.random() * 10) + 1);
  const [replyCaptchaAnswer, setReplyCaptchaAnswer] = useState("");

  // Helpers
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const totalCommentCount = useMemo(() => {
    const main = comments.filter((c) => !c.parent_reply_id).length;
    const replyCount = comments
      .filter((c) => !c.parent_reply_id)
      .map((c) => replies.filter((r) => r.comment_id === c.id).length)
      .reduce((a, b) => a + b, 0);
    return main + replyCount;
  }, [comments, replies]);

  // Data
  const fetchUsers = async () => {
    const userId = "2db5aa97-71a0-43d4-a29d-b6a8670d00e9"; // TODO: byt till ditt user_id
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!userError && userData) setUsers([userData]);
  };

  const fetchCommentsAndLikes = async (postId: string) => {
    const { data: commentsData } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId);
    setComments(commentsData || []);

    const { data: repliesData } = await supabase.from("replies").select("*");
    setReplies(repliesData || []);

    const { data: likesData } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", postId);
    setLikesCount(likesData?.length || 0);
  };

  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const fetchRelatedPosts = async (categories: string[] = []) => {
    try {
      const catQuery = `{${categories.join(",")}}`;
      const { data } = await supabase
        .from("posts")
        .select("*")
        .filter("categories", "cs", catQuery)
        .neq("slug", slug)
        .limit(3);
      setRelatedPosts(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      if (!slug) return;
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching post by slug:", error.message);
        return;
      }

      setPost(data);
      await Promise.all([
        fetchCommentsAndLikes(data.id),
        fetchUsers(),
        fetchRelatedPosts(data.categories),
      ]);
    };

    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Handlers
  const toggleCommentReplies = (commentId: string) => {
    setExpandedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (parseInt(captchaAnswer) !== num1 + num2) {
      setErrorMessage("Incorrect answer. Please try again.");
      return;
    }

    if (!newComment || !commentName || !commentEmail) {
      setErrorMessage("All fields must be filled in!");
      return;
    }

    const { error } = await supabase.from("comments").insert([
      {
        post_id: post?.id,
        content: newComment,
        user_name: commentName,
        user_email: commentEmail,
      },
    ]);

    if (error) {
      setErrorMessage("An error occurred while submitting the comment.");
      return;
    }

    setNewComment("");
    setCommentName("");
    setCommentEmail("");
    setCaptchaAnswer("");
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setErrorMessage("");

    if (post) fetchCommentsAndLikes(post.id);
  };

  const handleReplySubmit = async (
    e: React.FormEvent,
    commentId: string
  ) => {
    e.preventDefault();

    if (parseInt(replyCaptchaAnswer) !== replyNum1 + replyNum2) {
      setErrorMessage("Incorrect answer. Please try again.");
      return;
    }

    if (!newReply || !replyName || !replyEmail) {
      setErrorMessage("All fields must be filled in!");
      return;
    }

    const { error } = await supabase.from("replies").insert([
      {
        comment_id: commentId,
        content: newReply,
        user_name: replyName,
        user_email: replyEmail,
      },
    ]);

    if (error) {
      setErrorMessage("An error occurred while submitting the reply.");
      return;
    }

    setNewReply("");
    setReplyName("");
    setReplyEmail("");
    setReplyCaptchaAnswer("");
    setReplyNum1(Math.floor(Math.random() * 10) + 1);
    setReplyNum2(Math.floor(Math.random() * 10) + 1);
    setErrorMessage("");
    if (post) fetchCommentsAndLikes(post.id);
  };

  // UI helpers
  const Badge = ({ children }: { children: React.ReactNode }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/20">
      {children}
    </span>
  );

  if (!post) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <div className="animate-pulse text-gray-400">Loading…</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans px-2 sm:px-4 lg:px-6 py-8 w-full overflow-x-hidden">
      <div className="w-full">
        {/* Header (fix för avklippta g/j) */}
        <div className="mb-6 sm:mb-8 overflow-visible">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] pb-1
                         bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
            {post.title}
          </h1>
        </div>

        {/* Post Card (tvåspalt som SingleReview) */}
        <div className="rounded-2xl p-[1px] bg-gradient-to-br from-cyan-500/30 via-white/10 to-transparent">
          <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black p-4 sm:p-8 shadow-2xl">
            {/* ÄNDRA ORDNINGEN MED order-utilities */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Högerspalt (bild + details) först på mobil: order-1, höger på desktop: lg:order-2 */}
              <aside className="order-1 lg:order-2 lg:col-span-5 space-y-4 lg:sticky lg:top-4">
                {/* Bild */}
                {post.images?.[0] && (
                  <div className="overflow-hidden rounded-xl ring-1 ring-white/10">
                    <div className="relative w-full aspect-[16/9]">
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                )}

                {/* Details-kort: Categories + Tags */}
                <div className="rounded-xl bg-slate-900/80 ring-1 ring-white/10 p-4 sm:p-5">
                  <h3 className="text-base font-semibold text-white mb-3">Details</h3>

                  {/* Categories */}
                  {post.categories?.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                        <FolderIcon className="h-4 w-4 text-cyan-400" />
                        <span>Categories</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.categories.map((c, i) => (
                          <Badge key={i}>{c}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-300">
                        <TagIcon className="h-4 w-4 text-cyan-400" />
                        <span>Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((t, i) => (
                          <Badge key={i}>#{t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              {/* Vänsterspalt (innehåll) efter på mobil: order-2, vänster på desktop: lg:order-1 */}
              <div className="order-2 lg:order-1 lg:col-span-7">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300/90 mb-4">
                  <div className="inline-flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-cyan-400" />
                    <span>{formatDate(post.created_at)}</span>
                  </div>

                  <span className="h-4 w-px bg-white/10" />

                  <div className="inline-flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-cyan-400" />
                    <span>{users[0]?.full_name ?? "Author"}</span>
                  </div>

                  {typeof post.views === "number" && (
                    <>
                      <span className="h-4 w-px bg-white/10" />
                      <span className="text-gray-400">{post.views} views</span>
                    </>
                  )}
                </div>

                {/* Content */}
                <div
                  className="text-gray-200 leading-relaxed space-y-4 break-words"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content),
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Comments ({totalCommentCount})
          </h2>

          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => {
                const repliesForComment = replies.filter(
                  (r) => r.comment_id === comment.id
                );
                const expanded = expandedComments.includes(comment.id);
                return (
                  <div key={comment.id} className="rounded-xl bg-slate-900/80 ring-1 ring-white/10 p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/20 ring-1 ring-cyan-400/30 text-cyan-200 font-semibold">
                        {comment.user_name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 text-sm">
                          <span className="font-semibold text-cyan-100 truncate max-w-[200px]">
                            {comment.user_name}
                          </span>
                          <span className="text-gray-400">• {formatDate(comment.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-200">{comment.content}</p>

                    <div className="mt-3 flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => toggleCommentReplies(comment.id)}
                        className="text-cyan-300 hover:text-cyan-200 underline-offset-4 hover:underline"
                        aria-expanded={expanded}
                      >
                        {expanded ? "Hide replies" : `Show replies (${repliesForComment.length})`}
                      </button>
                    </div>

                    {/* Replies list / Reply form */}
                    {expanded && (
                      <div className="mt-4 space-y-3">
                        {repliesForComment.length > 0 && (
                          <div className="space-y-3">
                            {repliesForComment.map((reply) => (
                              <div key={reply.id} className="ml-0 sm:ml-6 rounded-lg bg-slate-800/70 ring-1 ring-white/5 p-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-sm font-semibold text-cyan-200">
                                    {reply.user_name}
                                  </h4>
                                  <span className="text-xs text-gray-400">
                                    {formatDate(reply.created_at)}
                                  </span>
                                </div>
                                <p className="text-gray-200 mt-1">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply form */}
                        <form
                          onSubmit={(e) => handleReplySubmit(e, comment.id)}
                          className="rounded-lg bg-slate-900/70 ring-1 ring-white/10 p-4"
                        >
                          <label htmlFor={`reply-${comment.id}`} className="sr-only">Reply</label>
                          <textarea
                            id={`reply-${comment.id}`}
                            className="w-full p-2.5 mt-1 bg-slate-800 text-white placeholder-gray-400 rounded-md"
                            placeholder="Write your reply here"
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            required
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                            <input
                              type="text"
                              className="p-2.5 bg-slate-800 text-white placeholder-gray-400 rounded-md"
                              placeholder="Your name"
                              value={replyName}
                              onChange={(e) => setReplyName(e.target.value)}
                              required
                            />
                            <input
                              type="email"
                              className="p-2.5 bg-slate-800 text-white placeholder-gray-400 rounded-md"
                              placeholder="Your email"
                              value={replyEmail}
                              onChange={(e) => setReplyEmail(e.target.value)}
                              required
                            />
                            <div>
                              <label className="text-gray-300 text-sm">
                                What is {replyNum1} + {replyNum2}?
                              </label>
                              <input
                                type="number"
                                className="mt-1 w-full p-2.5 bg-slate-800 text-white placeholder-gray-400 rounded-md"
                                placeholder="Enter the sum"
                                value={replyCaptchaAnswer}
                                onChange={(e) => setReplyCaptchaAnswer(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30"
                          >
                            Submit reply
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">No comments yet. Be the first to comment!</p>
          )}
        </div>

        {/* Comment form */}
        <div className="mt-12">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Leave a Comment
          </h3>
          <form
            onSubmit={handleCommentSubmit}
            className="rounded-2xl bg-slate-900/80 ring-1 ring-white/10 p-5 sm:p-6"
          >
            {errorMessage && (
              <div className="mb-4 text-sm text-red-400" aria-live="polite">{errorMessage}</div>
            )}
            <label htmlFor="comment" className="sr-only">Comment</label>
            <textarea
              id="comment"
              className="w-full p-3 bg-slate-800 text-white placeholder-gray-400 rounded-md"
              placeholder="Write your comment here"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              <input
                type="text"
                className="p-3 bg-slate-800 text-white placeholder-gray-400 rounded-md"
                placeholder="Your name"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
              />
              <input
                type="email"
                className="p-3 bg-slate-800 text-white placeholder-gray-400 rounded-md"
                placeholder="Your email"
                value={commentEmail}
                onChange={(e) => setCommentEmail(e.target.value)}
                required
              />
              <div>
                <label className="text-gray-300 text-sm">
                  What is {num1} + {num2}?
                </label>
                <input
                  type="number"
                  className="mt-1 p-3 w-full bg-slate-800 text-white placeholder-gray-400 rounded-md"
                  placeholder="Enter the sum"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors ring-1 ring-cyan-400/30"
            >
              Submit Comment
            </button>
          </form>
        </div>

        {/* Related posts */}
        <div className="mt-12">
          <h3 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Related Posts
          </h3>
          {relatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/post/${rp.slug}`}
                  className="group rounded-xl overflow-hidden ring-1 ring-white/10 bg-slate-900/70 hover:ring-cyan-400/40 transition-all"
                >
                  <div className="relative">
                    {rp.images?.[0] && (
                      <div className="relative w-full aspect-[16/9] overflow-hidden">
                        <img
                          src={rp.images[0]}
                          alt={rp.title}
                          className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h4 className="text-base font-semibold text-white line-clamp-2">
                      {rp.title}
                    </h4>
                    <p className="mt-2 text-sm text-gray-400">{formatDate(rp.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No related posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
             



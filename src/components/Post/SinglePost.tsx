import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import DOMPurify from "dompurify";
import AdsSection from "../Ads/adsPage";
import {
  CalendarIcon,
  FolderIcon,
  TagIcon,
  UserIcon,
} from "@heroicons/react/20/solid";

// Post, Comment, and Reply interfaces
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

  // State for the post, comments, replies, form inputs, etc.
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showComments] = useState(true);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [, setLikesCount] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newReply, setNewReply] = useState("");
  const [replyName, setReplyName] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  const [showCommentForm] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [num1, setNum1] = useState<number>(Math.floor(Math.random() * 10) + 1);
  const [num2, setNum2] = useState<number>(Math.floor(Math.random() * 10) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [replyNum1, setReplyNum1] = useState<number>(
    Math.floor(Math.random() * 10) + 1
  );
  const [replyNum2, setReplyNum2] = useState<number>(
    Math.floor(Math.random() * 10) + 1
  );
  const [replyCaptchaAnswer, setReplyCaptchaAnswer] = useState("");

  // Fetches the post by slug when the component mounts
  useEffect(() => {
    const fetchPostBySlug = async () => {
      if (slug) {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) {
          console.error("Error fetching post by slug:", error.message);
        } else {
          setPost(data);
          await fetchCommentsAndLikes(data.id); // Fetch comments and likes
          await fetchRelatedPosts(data.categories, data.tags); // Fetch related posts
        }
      }
    };

    fetchPostBySlug();
  }, [slug]);

  const fetchUsers = async () => {
    const userId = "2db5aa97-71a0-43d4-a29d-b6a8670d00e9"; // Sätt ditt user_id här

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Kunde inte hämta användardata:", userError.message);
    } else {
      setUsers([userData]); // Uppdatera state med den hämtade användaren
    }
  };

  useEffect(() => {
    const fetchPostBySlug = async () => {
      if (slug) {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) {
          console.error("Error fetching post by slug:", error.message);
        } else {
          setPost(data);
          await fetchCommentsAndLikes(data.id); // Hämta kommentarer och likes
          await fetchUsers(); // Hämta den inloggade användaren
        }
      }
    };

    fetchPostBySlug();
  }, [slug]);
  const fetchCommentsAndLikes = async (postId: string) => {
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", postId);

    if (commentsError) {
      console.error("Error fetching comments:", commentsError.message);
    } else {
      setComments(commentsData || []);
    }

    const { data: repliesData, error: repliesError } = await supabase
      .from("replies")
      .select("*");

    if (repliesError) {
      console.error("Error fetching replies:", repliesError.message);
    } else {
      setReplies(repliesData || []);
    }

    // Fetch likes count
    const { data: likesData, error: likesError } = await supabase
      .from("likes")
      .select("*")
      .eq("post_id", postId);

    if (likesError) {
      console.error("Error fetching likes:", likesError.message);
    } else {
      setLikesCount(likesData?.length || 0);
    }
  };

  // Fetch related posts based on categories and tags
  const fetchRelatedPosts = async (categories: string[], _tags: string[]) => {
    try {
      const categoryQuery = `{${categories.join(",")}}`;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .filter("categories", "cs", categoryQuery)
        .neq("slug", slug) // Exclude the current post
        .limit(3);

      if (error) {
        console.error("Error fetching related posts:", error.message);
      } else {
        setRelatedPosts(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching related posts:", err);
    }
  };

  // Comment submit handler
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kontrollera om CAPTCHA-svaret är korrekt
    if (parseInt(captchaAnswer) !== num1 + num2) {
      setErrorMessage("Incorrect answer. Please try again.");
      return;
    }

    if (!newComment || !commentName || !commentEmail) {
      setErrorMessage("All fields must be filled in!");
      return;
    }

    try {
      const { error } = await supabase.from("comments").insert([
        {
          post_id: post?.id,
          content: newComment,
          user_name: commentName,
          user_email: commentEmail,
        },
      ]);

      if (error) {
        console.error("Error adding comment:", error.message);
        setErrorMessage("An error occurred while submitting the comment.");
      } else {
        setNewComment("");
        setCommentName("");
        setCommentEmail("");
        setCaptchaAnswer(""); // Återställ CAPTCHA
        setNum1(Math.floor(Math.random() * 10) + 1); // Generera nya siffror
        setNum2(Math.floor(Math.random() * 10) + 1);
        setErrorMessage("");

        fetchCommentsAndLikes(post!.id);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  // Reply submit handler
  const handleReplySubmit = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();

    // Kontrollera CAPTCHA
    if (parseInt(replyCaptchaAnswer) !== replyNum1 + replyNum2) {
      setErrorMessage("Incorrect answer. Please try again.");
      return;
    }

    if (!newReply || !replyName || !replyEmail) {
      setErrorMessage("All fields must be filled in!");
      return;
    }

    try {
      const { error } = await supabase.from("replies").insert([
        {
          comment_id: commentId,
          content: newReply,
          user_name: replyName,
          user_email: replyEmail,
        },
      ]);

      if (error) {
        console.error("Error adding reply:", error.message);
        setErrorMessage("An error occurred while submitting the reply.");
      } else {
        setNewReply("");
        setReplyName("");
        setReplyEmail("");
        setReplyCaptchaAnswer("");
        setReplyNum1(Math.floor(Math.random() * 10) + 1);
        setReplyNum2(Math.floor(Math.random() * 10) + 1);
        setErrorMessage("");
        fetchCommentsAndLikes(post!.id); // Uppdatera kommentarer och svar
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  // Toggle reply visibility for comments
  const toggleCommentReplies = (commentId: string) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter((id) => id !== commentId));
    } else {
      setExpandedComments([...expandedComments, commentId]);
    }
  };

  // Get the total number of comments and replies
  const getTotalCommentCount = () => {
    const mainCommentsCount = comments.filter(
      (comment) => !comment.parent_reply_id
    ).length;

    const repliesCount = comments
      .filter((comment) => !comment.parent_reply_id)
      .map(
        (comment) =>
          replies.filter((reply) => reply.comment_id === comment.id).length
      )
      .reduce((acc, curr) => acc + curr, 0);

    return mainCommentsCount + repliesCount;
  };

  const renderReplies = (commentId: string) => {
    const repliesToRender = replies.filter(
      (reply) => reply.comment_id === commentId
    );

    return repliesToRender.length > 0 ? (
      <div className="mt-4">
        {/* Conditionally display replies */}
        {expandedComments.includes(commentId) && (
          <div>
            {repliesToRender.map((reply) => (
              <div key={reply.id} className="ml-4 mt-2">
                <div className="bg-gray-700 p-3 rounded-lg shadow mb-2">
                  <div className="flex justify-between">
                    <h4 className="text-md font-semibold text-cyan-200">
                      {reply.user_name}
                    </h4>
                    <span className="text-sm text-gray-400">
                      {new Date(reply.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-1">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* This div acts as the button to toggle the replies */}
        <div
          className="text-sm text-cyan-400 mt-2 cursor-pointer hover:underline hover:text-cyan-500 transition duration-300 ease-in-out transform hover:scale-100 px-2 py-1 rounded-md hover:bg-gray-700"
          onClick={() => toggleCommentReplies(commentId)}
        >
          <span className="inline-block transform">
            {expandedComments.includes(commentId) ? "Hide" : "Show"}
          </span>
        </div>
      </div>
    ) : (
      <div className="ml-4 mt-2">
        Reply to this comment
        {showCommentForm && (
          <form
            onSubmit={(e) => handleReplySubmit(e, commentId)}
            className="mt-4 bg-gray-800 p-4 rounded-lg shadow-md"
          >
            <textarea
              className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
              placeholder="Write your reply here"
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
              placeholder="Your name"
              value={replyName}
              onChange={(e) => setReplyName(e.target.value)}
            />
            <input
              type="email"
              className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
              placeholder="Your email address"
              value={replyEmail}
              onChange={(e) => setReplyEmail(e.target.value)}
            />
            <div className="mt-4">
              <label className="text-gray-300">
                What is {replyNum1} + {replyNum2}?
              </label>
              <input
                type="number"
                className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                placeholder="Enter the sum"
                value={replyCaptchaAnswer}
                onChange={(e) => setReplyCaptchaAnswer(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-cyan-500 text-white p-2 rounded-lg"
            >
              Submit reply
            </button>
          </form>
        )}
      </div>
    );
  };

  if (!post) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
      <div className="w-full max-w-6xl">
        <div className="p-1 rounded-lg shadow-lg mp-2">
          <AdsSection placement="post-top" />
        </div>

        {/* Post Details Section */}
        <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">
          {post.title}
        </h1>
        <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg">
          {post.images[0] && (
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg mb-4 border-4 border-cyan-500 shadow-xl"
            />
          )}

          <div
            className="text-sm sm:text-lg text-gray-300 mb-4 whitespace-pre-wrap break-words overflow-auto"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(post.content),
            }}
          />

          <div className="mt-4 flex items-center">
            <FolderIcon className="w-4 h-4 text-cyan-700 mr-2" />{" "}
            {/* Kategori-ikon */}
            {post.categories.map((category, index) => (
              <span
                key={index}
                className="bg-cyan-700 text-white text-xs font-bold mr-2 px-2.5 py-0.5 rounded"
              >
                {category}
              </span>
            ))}
          </div>

          <div className="mt-4 flex items-center">
            <TagIcon className="w-4 h-4 text-cyan-700 mr-2" /> {/* Tagg-ikon */}
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-cyan-700 text-white text-xs font-bold mr-2 px-2.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Datum och användarnamn placerat under texten */}
          <div className="flex justify-between text-xs sm:text-sm text-gray-400 mt-4">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-cyan-400 mr-2" />
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-cyan-400 mr-2" />
              <span>{users.length > 0 && users[0].full_name}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-2xl text-cyan-500 font-semibold mb-4">
            Comments ({getTotalCommentCount()})
          </h2>
          {showComments ? (
            <>
              {" "}
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-800 p-4 rounded-lg shadow mb-4"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-cyan-400 rounded-full"></div>
                      <h4 className="text-lg font-semibold text-cyan-200">
                        {comment.user_name}
                      </h4>
                      <span className="text-sm text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-2">{comment.content}</p>
                    <div
                      className="text-sm text-cyan-400 mt-2 hover:underline"
                      onClick={() => toggleCommentReplies(comment.id)}
                    >
                      {expandedComments.includes(comment.id) ? "Hide" : "Show"}
                    </div>
                    {expandedComments.includes(comment.id) &&
                      renderReplies(comment.id)}
                  </div>
                ))
              ) : (
                <p className="text-gray-300">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-300">Comments are hidden.</p>
          )}
        </div>

        {/* Comment Form Section */}
        <div className="mt-8">
          <h2 className="text-2xl text-cyan-500 font-semibold mb-4">
            Leave a Comment
          </h2>
          <form
            onSubmit={handleCommentSubmit}
            className="bg-gray-800 p-6 rounded-lg shadow-md"
          >
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            <textarea
              className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
              placeholder="Write your comment here"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <input
              type="text"
              className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
              placeholder="Your name"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
            />
            <input
              type="email"
              className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
              placeholder="Your email"
              value={commentEmail}
              onChange={(e) => setCommentEmail(e.target.value)}
            />
            <div className="mt-4">
              <label className="text-gray-300">
                What is {num1} + {num2}?
              </label>
              <input
                type="number"
                className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                placeholder="Enter the sum"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-cyan-500 text-white p-2 rounded-lg"
            >
              Submit Comment
            </button>
          </form>
        </div>

        {/* Related Posts Section */}

        <h2 className="text-2xl text-cyan-500 font-semibold mb-4">
          Related Posts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedPosts.map((relatedPost) => (
            <div
              key={relatedPost.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <img src={relatedPost.images[0]} alt={relatedPost.title} />
              <Link
                to={`/post/${relatedPost.slug}`}
                className="text-xl font-semibold text-cyan-400"
              >
                {relatedPost.title}
              </Link>
              <p className="text-gray-300 mt-2">
                {new Date(relatedPost.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;

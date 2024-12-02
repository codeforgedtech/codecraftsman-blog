import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import DOMPurify from 'dompurify';
import {
  PencilIcon,
  CalendarIcon,
  HeartIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/solid';

interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  images: string[];
  slug: string;
  categories: string[];
  tags: string[];
  likes: number; // This will now be updated with the fetched likes count
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

const SinglePost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showComments] = useState(true);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [likesCount, setLikesCount] = useState<number>(0); // Add a state for likes count

  useEffect(() => {
    const fetchPostBySlug = async () => {
      if (slug) {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error fetching post by slug:', error.message);
        } else {
          setPost(data);
          if (data) {
            fetchCommentsAndReplies(data.id); // Fetch comments and replies
            fetchLikes(data.id); // Fetch likes count
          }
        }
      }
    };

    fetchPostBySlug();
  }, [slug]);

  const fetchCommentsAndReplies = async (postId: string) => {
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId);

    if (commentsError) {
      console.error('Error fetching comments:', commentsError.message);
    } else {
      setComments(commentsData || []);
    }

    const { data: repliesData, error: repliesError } = await supabase
      .from('replies')
      .select('*');

    if (repliesError) {
      console.error('Error fetching replies:', repliesError.message);
    } else {
      setReplies(repliesData || []);
    }
  };

  // Fetch likes count
  const fetchLikes = async (postId: string) => {
    const { data: likesData, error } = await supabase
      .from('likes') // Assuming your table is called 'likes'
      .select('*')
      .eq('post_id', postId);

    if (error) {
      console.error('Error fetching likes:', error.message);
    } else {
      setLikesCount(likesData?.length || 0); // Count the number of likes
    }
  };

  const toggleCommentReplies = (commentId: string) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments(expandedComments.filter((id) => id !== commentId));
    } else {
      setExpandedComments([...expandedComments, commentId]);
    }
  };

  const getTotalCommentCount = () => {
    const mainCommentsCount = comments.filter((comment) => !comment.parent_reply_id).length;

    const repliesCount = comments
      .filter((comment) => !comment.parent_reply_id)
      .map((comment) => replies.filter((reply) => reply.comment_id === comment.id).length)
      .reduce((acc, curr) => acc + curr, 0);

    return mainCommentsCount + repliesCount;
  };

  const getRepliesForComment = (commentId: string) => {
    return replies.filter((reply) => reply.comment_id === commentId);
  };

  const renderReplies = (commentId: string) => {
    const repliesToRender = getRepliesForComment(commentId);
    return repliesToRender.map((reply) => (
      <div key={reply.id} className="ml-4 mt-2">
        <div className="bg-gray-700 p-3 rounded-lg shadow mb-2">
          <div className="flex justify-between">
            <h4 className="text-md font-semibold text-cyan-200">{reply.user_name}</h4>
            <span className="text-sm text-gray-400">
              {new Date(reply.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-300 mt-1">{reply.content}</p>
          <button
            className="text-sm text-cyan-400 mt-1 hover:underline"
            onClick={() => toggleCommentReplies(reply.id)}
          >
            {expandedComments.includes(reply.id) ? 'Hide Replies' : 'Show Replies'}
          </button>
          {expandedComments.includes(reply.id) && renderReplies(reply.id)}
        </div>
      </div>
    ));
  };

  if (!post) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans p-8 flex items-center justify-center w-screen">
      <div className="w-full max-w-4xl bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg p-6">
        {post.images[0] && (
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-4 border-4 border-cyan-500 shadow-xl"
          />
        )}
        <div className="flex items-center space-x-2">
          <PencilIcon className="h-6 w-6 text-cyan-400" />
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">{post.title}</h1>
        </div>
        <div
          className="text-lg text-gray-300 mb-4"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content),
          }}
        />
        <div className="text-sm text-gray-400 italic">
          <CalendarIcon className="h-5 w-5 text-cyan-400 inline-block mr-1" />
          {new Date(post.created_at).toLocaleDateString()}
        </div>
        <div className="mt-4 flex space-x-4">
          <div className="flex items-center space-x-1">
            <HeartIcon className="h-5 w-5 text-red-500" />
            <span className="text-gray-300">{likesCount} Likes</span>
          </div>
          <div className="flex items-center space-x-1">
            <EyeIcon className="h-5 w-5 text-yellow-500" />
            <span className="text-gray-300">{post.views} Views</span>
          </div>
          <div className="flex items-center space-x-1">
            <ChatBubbleLeftIcon className="h-5 w-5 text-cyan-400" />
            <span className="text-gray-300">
              {getTotalCommentCount()} Comments
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
        <div className="text-sm text-gray-400 mt-2">
          Tags: {post.tags.join(', ')}
        </div>

        {/* Kommentarsektionen */}
        {showComments && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>
            {comments.map((comment) => (
              <div key={comment.id} className="mb-6">
                <div className="bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex justify-between">
                    <h4 className="text-md font-semibold text-cyan-200">
                      {comment.user_name}
                    </h4>
                    <span className="text-sm text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-1">{comment.content}</p>
                  <button
                    className="text-sm text-cyan-400 mt-1 hover:underline"
                    onClick={() => toggleCommentReplies(comment.id)}
                  >
                    {expandedComments.includes(comment.id) ? 'Hide Replies' : 'Show Replies'}
                  </button>
                  {expandedComments.includes(comment.id) && renderReplies(comment.id)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePost;









import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { supabase } from '../../supabaseClient';
import DOMPurify from 'dompurify';
import AdsSection from '../Ads/adsPage';
import {
 
  CalendarIcon,
  HeartIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ChevronRightIcon,
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
  const navigate = useNavigate(); 
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showComments] = useState(true);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [likesCount, setLikesCount] = useState<number>(0); 
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newReply, setNewReply] = useState('');
const [replyName, setReplyName] = useState('');
const [replyEmail, setReplyEmail] = useState('');
const [showCommentForm, setShowCommentForm] = useState(true);
const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);


  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment || !commentName || !commentEmail) {
      setErrorMessage('Alla fält måste fyllas i!');
      return;
    }

    try {
     
      const { error } = await supabase.from('comments').insert([
        {
          post_id: post?.id,
          content: newComment,
          user_name: commentName,
          user_email: commentEmail,
        },
      ]);

      if (error) {
        console.error('Error adding comment:', error.message);
        setErrorMessage('Ett fel uppstod när kommentaren skickades.');
      } else {
        setNewComment('');
        setCommentName('');
        setCommentEmail('');
        setErrorMessage('');
        fetchCommentsAndReplies(post!.id); // Uppdatera kommentarlistan
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrorMessage('Ett oväntat fel inträffade.');
    }
  };
  const handleScrollToTop = () => {
    window.scrollTo(0, 0);

  };
  const handleReplySubmit = async (
    e: React.FormEvent,
    commentId: string
  ) => {
    e.preventDefault();
  
    if (!newReply || !replyName || !replyEmail) {
      setErrorMessage('All fields must be filled in!');
      return;
    }
  
    try {
     
      const { error } = await supabase.from('replies').insert([
        {
          comment_id: commentId,
          content: newReply,
          user_name: replyName,
          user_email: replyEmail,
        },
      ]);
  
      if (error) {
        console.error('Error adding reply:', error.message);
        setErrorMessage('An error occurred while submitting the reply.');
      } else {
        setNewReply('');
        setReplyName('');
        setReplyEmail('');
        setErrorMessage('');
        fetchCommentsAndReplies(post!.id); // Update comments and replies
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setErrorMessage('An unexpected error occurred.');
    }
  };
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
            await fetchCommentsAndLikes(data.id); // Ensure this is awaited
            await fetchRelatedPosts(data.categories, data.tags); // Fetch related posts
          }
        }
      }
    };
  
    fetchPostBySlug();
  }, [slug]);
  
  const fetchCommentsAndLikes = async (_postId: any) => {
    try {
      // your code that may throw an error
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Error fetching comments and likes:', err.message);
      } else {
        console.error('An unknown error occurred');
      }
    };
  }
  

  const fetchRelatedPosts = async (categories: string[], _tags: string[]) => {
    try {
      // Convert categories to a format supported by Supabase for array overlap queries
      const categoryQuery = `{${categories.join(',')}}`;
  
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .filter('categories', 'cs', categoryQuery) // Use 'cs' to check for overlap
        .neq('slug', slug) // Exclude the current post
        .limit(3);
  
      if (error) {
        console.error('Error fetching related posts:', error.message);
      } else {
        setRelatedPosts(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching related posts:', err);
    }
  };
  

  if (!post) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }
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
    fetchLikes('somePostId');
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
    
    <div className="bg-black min-h-screen text-white font-sans px-4 py-8 flex items-start justify-start w-screen">
    <div className="w-full max-w-6xl">
    <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-black p-6 rounded-lg shadow-lg mb-8">

    <AdsSection placement="sidebar" />
    </div>
    <h1 className="text-3xl sm:text-4xl font-bold text-left text-cyan-500 mb-8">
   {post.title}</h1>
     
      <div className='p-4 sm:p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl shadow-lg'>
        {post.images[0] && (
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-4 border-4 border-cyan-500 shadow-xl"
          />
        )}
        <div className="flex items-center space-x-2">
         
       
        </div>
        <div
          className="text-sm sm:text-lg text-gray-300 mb-4"
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
        <div className="mt-8 text-center">
            <button
              onClick={() => navigate(-1)} // Navigates to the previous page
              className="bg-cyan-700 text-white text-xs font-bold px-6 py-2 rounded hover:bg-cyan-600 transition duration-300"
            >
              Tillbaka
            </button>
          </div>
          <div className="mt-12">
          <h2 className="text-2xl font-bold text-cyan-500 mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <div key={relatedPost.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                {relatedPost.images[0] && (
                  <img
                    src={relatedPost.images[0]}
                    alt={relatedPost.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                  {relatedPost.title}
                </h3>
                <Link
              to={`/post/${relatedPost.slug}`}
              className="inline-block text-cyan-400 hover:text-cyan-300 mt-4 transition duration-300"
              onClick={handleScrollToTop}
            >
              Read more <ChevronRightIcon className="h-5 w-5 inline-block" />
            </Link>
                
              </div>
            ))}
          </div>
        </div>
        </div>
        
        {showComments && (
          <div className="mt-6">
  <h3 className="text-2xl font-semibold mb-6 text-cyan-200">Comments</h3>
  {comments.map((comment) => (
    <div key={comment.id} className="mb-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h4 className="text-lg font-semibold text-cyan-200">{comment.user_name}</h4>
          <span className="text-sm text-gray-400 mt-2 sm:mt-0">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-300">{comment.content}</p>

        <button
          className="text-sm text-cyan-400 mt-3 hover:underline"
          onClick={() => {
            toggleCommentReplies(comment.id);
            setShowCommentForm(!showCommentForm);
          }}
        >
          {expandedComments.includes(comment.id) ? 'Hide Replies' : 'Show Replies'}
        </button>

        {expandedComments.includes(comment.id) && renderReplies(comment.id)}
        {expandedComments.includes(comment.id) && (
          <div className="mt-6 bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-4 text-cyan-200">
              Reply to {comment.user_name}
            </h4>
            {errorMessage && (
              <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
            )}
            <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1" htmlFor="replyName">
                  Name
                </label>
                <input
                  id="replyName"
                  type="text"
                  value={replyName}
                  onChange={(e) => setReplyName(e.target.value)}
                  className="w-full p-2 rounded bg-gray-600 text-white border border-cyan-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1" htmlFor="replyEmail">
                  E-mail
                </label>
                <input
                  id="replyEmail"
                  type="email"
                  value={replyEmail}
                  onChange={(e) => setReplyEmail(e.target.value)}
                  className="w-full p-2 rounded bg-gray-600 text-white border border-cyan-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-1" htmlFor="replyContent">
                  Reply
                </label>
                <textarea
                  id="replyContent"
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="w-full p-2 rounded bg-gray-600 text-white border border-cyan-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
              >
                Post Reply
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  ))}

  {showCommentForm && (
    <form onSubmit={handleCommentSubmit} className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h4 className="text-lg font-semibold mb-4 text-cyan-200">Add Comment</h4>
      {errorMessage && (
        <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
      )}
      <div className="mb-4">
        <label className="block text-gray-300 mb-1" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={commentName}
          onChange={(e) => setCommentName(e.target.value)}
          className="w-full p-2 rounded bg-gray-600 text-white border border-cyan-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={commentEmail}
          onChange={(e) => setCommentEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-600 text-white border border-cyan-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1" htmlFor="comment">
          Comment
        </label>
        <textarea
          id="comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 rounded bg-gray-600 text-white border border-cyan-500"
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
      >
        Post Comment
      </button>
    </form>
  )}
</div>

 )}


        
      </div>
    </div>
  );
};

export default SinglePost;









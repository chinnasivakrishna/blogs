import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import './Content.css';

function Content() {
  // Extracting the blog ID from the URL parameters
  const { id: blogId } = useParams();
  const [blog, setBlog] = useState(null); // State to store the blog data
  const [comment, setComment] = useState(''); // State to store new comment input
  const [comments, setComments] = useState([]); // State to store comments for the blog

  // Effect hook to fetch the blog and its comments when the component mounts or when blogId changes
  useEffect(() => {
    // Function to fetch the blog data by ID
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://blogs-backend-qn2y.onrender.com/api/blogs/${blogId}`);
        setBlog(response.data); // Set the blog data in the state
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    // Function to fetch comments for the blog
    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://blogs-backend-qn2y.onrender.com/api/blogs/${blogId}/comments`);
        setComments(response.data); // Set the comments in the state
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchBlog(); // Fetch the blog data
    fetchComments(); // Fetch the comments
  }, [blogId]); // Dependency array includes blogId to refetch data when it changes

  // Function to handle form submission for adding a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const token = Cookies.get('jwt_token'); // Retrieve JWT token from cookies for authentication
    try {
      await axios.post(
        `https://blogs-backend-qn2y.onrender.com/api/${blogId}/comments`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add authorization header with JWT token
          },
        }
      );
      setComment(''); // Clear the comment input field after submission

      // Refresh the comments list after adding a new comment
      const response = await axios.get(`https://blogs-backend-qn2y.onrender.com/api/${blogId}/comments`);
      setComments(response.data); // Update the comments state
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="content">
      {blog && ( // Render the blog content if the blog data is available
        <>
          <div className="content-header">
            <span className="badge">Useful Resources</span>
            <h1>{blog.title}</h1>
            <div className="content-meta">
              <span>Published {new Date(blog.createdAt).toLocaleDateString()}</span>
              <span>Read time 4 mins</span>
            </div>
          </div>
          <div className="content-image">
            <img src={blog.image} alt="Blog" />
          </div>
          <div className="content-footer">
            <h2>Contents</h2>
            <p>{blog.contents.map((c, i) => <span key={i}>{c.description}</span>)}</p>
          </div>
          <div className="comments-section">
            <h2>Comments</h2>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={comment} // Controlled input for new comment
                onChange={(e) => setComment(e.target.value)} // Update state on input change
                placeholder="Add a comment..."
                rows="4"
                required
              />
              <button type="submit">Submit Comment</button>
            </form>
            <ul className="comments-list">
              {comments.map((c, index) => (
                <li key={index} className="comment-item">
                  <strong>{c.user.name}:</strong> <p>{c.content}</p>
                  <span className="comment-date">{new Date(c.date).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Content;

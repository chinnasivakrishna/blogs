import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import './Content.css';

function Content() {
  const { id: blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://blogs-backend-qn2y.onrender.com/api/posts/${blogId}`);
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`https://blogs-backend-qn2y.onrender.com/api/posts/${blogId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchBlog();
    fetchComments();
  }, [blogId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get('jwt_token');
    try {
      await axios.post(
        `https://blogs-backend-qn2y.onrender.com/api/blogs/${blogId}/comments`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComment('');
      const response = await axios.get(`https://blogs-backend-qn2y.onrender.com/api/blogs/${blogId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="content">
      {blog && (
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
                value={comment}
                onChange={(e) => setComment(e.target.value)}
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

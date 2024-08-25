import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './MyBlogs.css';

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [editBlog, setEditBlog] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newContentPreview, setNewContentPreview] = useState('');
  const [newContent, setNewContent] = useState({ title: '', image: null, description: '' });
  const [editedContentIndex, setEditedContentIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBlogs = async () => {
      const token = Cookies.get('jwt_token');
      try {
        const response = await axios.get('https://blogs-backend-qn2y.onrender.com/api/posts/my-blogs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching user blogs:', error);
      }
    };

    fetchUserBlogs();
  }, []);

  useEffect(() => {
    if (editBlog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [editBlog]);

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  const handleDelete = async (blogId) => {
    const token = Cookies.get('jwt_token');
    try {
      await axios.delete(`https://blogs-backend-qn2y.onrender.com/api/posts/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleEdit = async (blogId) => {
    const token = Cookies.get('jwt_token');
    try {
      const response = await axios.get(`https://blogs-backend-qn2y.onrender.com/api/posts/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditBlog(response.data);
      setImagePreview(response.data.image); 
    } catch (error) {
      console.error('Error fetching blog for editing:', error);
    }
  };

  const handleUpdate = async () => {
    const token = Cookies.get('jwt_token');
    try {
      await axios.put(`https://blogs-backend-qn2y.onrender.com/api/posts/${editBlog._id}`, editBlog, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(blogs.map(blog => (blog._id === editBlog._id ? editBlog : blog)));
      setEditBlog(null);
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditBlog({ ...editBlog, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleContentImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewContent({ ...newContent, image: file });
      setNewContentPreview(URL.createObjectURL(file));
    }
  };

  const handleAddContent = () => {
    setEditBlog({
      ...editBlog,
      contents: [...editBlog.contents, newContent]
    });
    setNewContent({ title: '', image: null, description: '' });
    setNewContentPreview('');
  };

  const handleEditContent = (index) => {
    setEditedContentIndex(index);
    setNewContent(editBlog.contents[index]);
    setNewContentPreview(editBlog.contents[index].image);
  };

  const handleUpdateContent = () => {
    const updatedContents = editBlog.contents.map((content, index) =>
      index === editedContentIndex ? newContent : content
    );
    setEditBlog({ ...editBlog, contents: updatedContents });
    setEditedContentIndex(null);
    setNewContent({ title: '', image: null, description: '' });
    setNewContentPreview('');
  };

  const handleRemoveContent = (index) => {
    setEditBlog({
      ...editBlog,
      contents: editBlog.contents.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="my-blogs-container">
      <h1 className="my-blogs-title">My Blogs</h1>
      {blogs.length > 0 ? (
        <ul className="blogs-list">
          {blogs.map((blog) => (
            <li 
              key={blog._id} 
              className="blog-item"
              onClick={() => handleBlogClick(blog._id)}
              style={{ cursor: 'pointer' }}
            >
              <h1 className="blog-title">{blog.title}</h1>
              <button onClick={(e) => { e.stopPropagation(); handleEdit(blog._id); }}>Update</button>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(blog._id); }}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-blogs-message">You have not written any blogs yet.</p>
      )}
      
      {editBlog && (
        <div className="edit-blog-overlay" onClick={() => setEditBlog(null)}> {/* Close on overlay click */}
          <div className="edit-blog-form" onClick={(e) => e.stopPropagation()}> {/* Prevent click from closing the modal */}
            <h2>Edit Blog</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={editBlog.title} 
                  onChange={(e) => setEditBlog({ ...editBlog, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Main Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
                {imagePreview && <img src={imagePreview} alt="Main Blog" className="image-preview" />}
              </div>
              <div className="form-group">
                <label>Conclusion</label>
                <textarea 
                  value={editBlog.conclusion} 
                  onChange={(e) => setEditBlog({ ...editBlog, conclusion: e.target.value })}
                />
              </div>
              
              <h2>Contents</h2>
              {editBlog.contents && editBlog.contents.map((content, index) => (
                <div key={index} className="content-item">
                  <h3>{content.title}</h3>
                  {content.image && <img src={content.image} alt={content.title} className="image-preview" />}
                  <p>{content.description}</p>
                  <button type="button" onClick={() => handleEditContent(index)}>Edit</button>
                  <button type="button" onClick={() => handleRemoveContent(index)}>Remove</button>
                </div>
              ))}

              <div className="new-content-form">
                <div className="form-group">
                  <label>Content Title</label>
                  <input 
                    type="text" 
                    value={newContent.title} 
                    onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Content Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleContentImageUpload}
                  />
                  {newContentPreview && <img src={newContentPreview} alt="Content" className="image-preview" />}
                </div>
                <div className="form-group">
                  <label>Content Description</label>
                  <textarea 
                    value={newContent.description} 
                    onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}
                  />
                </div>
                <button type="button" onClick={editedContentIndex !== null ? handleUpdateContent : handleAddContent} className="add-content-btn">
                  {editedContentIndex !== null ? 'Update Content' : 'Add Content'}
                </button>
              </div>

              <button type="button" onClick={handleUpdate} className="submit-blog-btn">
                Save Changes
              </button>
              <button type="button" onClick={() => setEditBlog(null)} className="cancel-btn">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;

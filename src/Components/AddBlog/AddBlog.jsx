import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; 
import './AddBlog.css';

function AddBlog() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [contents, setContents] = useState([]);
  const [conclusion, setConclusion] = useState('');
  const [newContent, setNewContent] = useState({ title: '', image: null, description: '' });
  const [newContentPreview, setNewContentPreview] = useState('');
  
  const [imageUrl, setImageUrl] = useState('');
  const [contentImages, setContentImages] = useState([]); 

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'post_blog'); 

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dsbuzlxpw/image/upload',
        formData
      );
      setImageUrl(response.data.secure_url); 
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };

  const handleContentImageUpload = async (e) => {
    const file = e.target.files[0];
    setNewContent({ ...newContent, image: file });
    setNewContentPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'post_blog'); 

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dsbuzlxpw/image/upload',
        formData
      );
      const contentImageUrl = response.data.secure_url;
      setNewContent({ ...newContent, image: contentImageUrl });
    } catch (error) {
      console.error('Error uploading content image:', error);
    }
  };

  const handleAddContent = () => {
    setContents([...contents, newContent]);
    setNewContent({ title: '', image: null, description: '' });
    setNewContentPreview('');
  };

  const handleRemoveContent = (index) => {
    const updatedContents = contents.filter((_, i) => i !== index);
    setContents(updatedContents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const blog = {
      title,
      image: imageUrl,
      contents,
      conclusion,
    };

    const token = Cookies.get('jwt_token');

    try {
      const response = await axios.post(
        'https://blogs-backend-qn2y.onrender.com/api/posts',
        blog,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log('Blog saved to DB:', response.data);
      alert('Blog Submitted Successfully')
    } catch (error) {
      console.error('Error saving blog to DB:', error);
    }
  };

  return (
    <div className="add-blog-container">
      <h1>Add a New Blog</h1>
      <form onSubmit={handleSubmit} className="add-blog-form">
        <div className="form-group">
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Main Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} required />
          {imagePreview && <img src={imagePreview} alt="Main Blog" className="image-preview" />}
        </div>
        <div className="form-group">
          <label>Conclusion</label>
          <textarea value={conclusion} onChange={(e) => setConclusion(e.target.value)} required></textarea>
        </div>
        
        <h2>Contents</h2>
        {contents.map((content, index) => (
          <div key={index} className="content-item">
            <h3>{content.title}</h3>
            {content.image && <img src={content.image} alt={content.title} className="image-preview" />}
            <p>{content.description}</p>
            <button type="button" onClick={() => handleRemoveContent(index)} className="remove-content-btn">Remove</button>
          </div>
        ))}

        <div className="new-content-form">
          <div className="form-group">
            <label>Content Title</label>
            <input type="text" value={newContent.title} onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Content Image</label>
            <input type="file" accept="image/*" onChange={handleContentImageUpload} />
            {newContentPreview && <img src={newContentPreview} alt="Content" className="image-preview" />}
          </div>
          <div className="form-group">
            <label>Content Description</label>
            <textarea value={newContent.description} onChange={(e) => setNewContent({ ...newContent, description: e.target.value })}></textarea>
          </div>
          <button type="button" onClick={handleAddContent} className="add-content-btn">Add Content</button>
        </div>

        <button type="submit" className="submit-blog-btn">Submit Blog</button>
      </form>
    </div>
  );
}

export default AddBlog;

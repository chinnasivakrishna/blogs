import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HighlightText from '../HighlightText/HighlightText'; 
import { useLocation, useNavigate } from 'react-router-dom'; 
import './Home.css'; 

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); 

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('search') || '';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://blogs-backend-qn2y.onrender.com/api/posts');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="home-container">
      <ul className="blog-list">
        {filteredBlogs.map((blog) => (
          <li 
            key={blog._id} 
            className="blog-list-item"
            onClick={() => handleBlogClick(blog._id)} 
          >
            <HighlightText text={blog.title} highlight={searchQuery} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

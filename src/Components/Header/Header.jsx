import React, { useState, useEffect } from 'react';
import './Header.css';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import Cookies library

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to check if user is authenticated
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the JWT token is present in the cookies
    const token = Cookies.get('jwt_token');
    setIsAuthenticated(!!token); // Set isAuthenticated based on the presence of the token
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    navigate(`/?search=${encodeURIComponent(event.target.value)}`); // Update the URL with the search query
  };

  const handleLogout = () => {
    Cookies.remove('jwt_token'); // Remove the token from cookies
    setIsAuthenticated(false); // Set isAuthenticated to false after logout
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <div className="header">
      <div className="header-logo">ZuAi</div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="search-btn">Search</button>
      </div>

      <div className="header-buttons">
        {isAuthenticated ? (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login"><button className="login-btn">Login</button></Link>
            <button className="join-btn">Join Now</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;

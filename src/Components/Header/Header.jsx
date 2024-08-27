import React, { useState, useEffect } from 'react';
import './Header.css';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie'; 

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('jwt_token');
    setIsAuthenticated(!!token); 
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    navigate(`/?search=${encodeURIComponent(event.target.value)}`); 
  };

  const handleLogout = () => {
    Cookies.remove('jwt_token'); 
    setIsAuthenticated(false);
    navigate('/');
  };
  const home = () =>{
    navigate('/')
  }

  return (
    <div className="header">
      <div className="header-logo" onClick={home}>ZuAi</div>

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

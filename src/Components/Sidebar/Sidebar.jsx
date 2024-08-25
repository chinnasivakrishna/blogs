import React from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSquarePlus, faEnvelope, faBook, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; 

function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <Link to="/"><li><FontAwesomeIcon icon={faHome} /></li></Link>
        <Link to="/add-blog"><li><FontAwesomeIcon icon={faSquarePlus} /></li> </Link>
        <Link to="/my-blog"><li><FontAwesomeIcon icon={faBook} /></li></Link>
        <li><FontAwesomeIcon icon={faUser} /></li>
      </ul>
    </div>
  );
}

export default Sidebar;

import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Components/Sidebar/Sidebar';
import Header from './Components/Header/Header';
import AddBlog from './Components/AddBlog/AddBlog';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import ProtectedRoute from './Components/ProtectedRoute'; 
import MyBlogs from './Components/MyBlogs/MyBlogs';
import Content from './Components/Content/Content';

const Layout = ({ children }) => (
  <div className="app">
    <Sidebar />
    <div className="content">
      {children}
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/add-blog" element={<ProtectedRoute><Layout><AddBlog /></Layout></ProtectedRoute>} />
        <Route path="/my-blog" element={<ProtectedRoute><Layout><MyBlogs /></Layout></ProtectedRoute>} />
        <Route path="/blog/:id" element={<ProtectedRoute><Layout><Content /></Layout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

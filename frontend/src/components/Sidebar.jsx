import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Image as ImageIcon, 
  BookImage, 
  Link as LinkIcon, 
  Heart, 
  Trash2, 
  BarChart2, 
  Wand2, 
  Code,
  Crown,
  MoreVertical
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const mainNav = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'My Images', path: '/my-images', icon: ImageIcon },
    { name: 'Albums', path: '/albums', icon: BookImage },
    { name: 'Shared Links', path: '/shared-links', icon: LinkIcon },
    { name: 'Favorites', path: '/favorites', icon: Heart },
    { name: 'Trash', path: '/trash', icon: Trash2 },
  ];

  const toolsNav = [
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Image Tools', path: '/image-tools', icon: Wand2 },
    { name: 'API Access', path: '/api-access', icon: Code },
  ];

  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {mainNav.map((item) => (
            <li key={item.name} className="nav-item">
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                <item.icon className="nav-icon" size={20} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-section">
          <h3 className="nav-section-title">TOOLS</h3>
          <ul className="nav-list">
            {toolsNav.map((item) => (
              <li key={item.name} className="nav-item">
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                >
                  <item.icon className="nav-icon" size={20} />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="sidebar-bottom">
        <div className="storage-card">
          <h4>Storage Used</h4>
          <div className="storage-info">
            <span className="storage-used">23.4 GB</span>
            <span className="storage-total"> / 100 GB</span>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: '23.4%' }}></div>
          </div>
          <button className="upgrade-btn">
            <Crown size={16} /> Upgrade Plan
          </button>
        </div>

        <div className="user-profile">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
            alt="Nellie Viltia" 
            className="avatar"
          />
          <div className="user-info">
            <p className="user-name">Nellie Viltia</p>
            <p className="user-plan">Free Plan</p>
          </div>
          <button className="more-btn">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../components/Header';
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
  Crown
} from 'lucide-react';
import '../styles/dashboard.css';

const Analytics = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => document.body.classList.remove('dashboard-body');
    }, []);

    const statCards = [
        { title: 'Total Views', value: '12,458', trend: '+12.5%' },
        { title: 'Total Downloads', value: '1,245', trend: '+8.7%' },
        { title: 'Total Links', value: '320', trend: '+15.2%' },
        { title: 'Storage Used', value: '24.6GB', trend: '+4.5%' },
    ];

    return (
        <div className="dashboard-layout">
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
                <div className="sidebar-header">
                    <div className="logo" style={{ padding: '0', display: 'flex', alignItems: 'center' }}>
                        <div className="logo-icon"></div>
                        <span>Lumina</span>
                    </div>
                </div>
                
                <div style={{ padding: '0 20px', marginBottom: '15px' }}>
                    <div className="sidebar-search" style={{ background: 'white', borderRadius: '10px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', border: '1px solid #E5E5E5' }}>
                        <span style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </span>
                        <input type="text" placeholder="Search..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem', color: '#333' }} />
                    </div>
                </div>
                
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Home className="icon" size={20} /> Dashboard</NavLink>

                    <NavLink to="/my-images" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><ImageIcon className="icon" size={20} /> My Images</NavLink>


                    <NavLink to="/shared-links" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><LinkIcon className="icon" size={20} /> Shared Links</NavLink>
                    <NavLink to="/trash" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Trash2 className="icon" size={20} /> Trash</NavLink>
                    
                    
                    <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><BarChart2 className="icon" size={20} /> Analytics</NavLink>


                </nav>
                
                
            </aside>
            <div className="main-wrapper">
                <Header title="Analytics" breadcrumbs="Analytics" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="dashboard-content">
                    
                    {/* Stat Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '20px', marginBottom: '30px' }}>
                        {statCards.map((stat, i) => (
                            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #F0F0F0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '10px' }}>{stat.title}</div>
                                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '10px' }}>{stat.value}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', color: '#10B981', fontWeight: '500' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 17 9 11 13 15 21 7"></polyline><polyline points="14 7 21 7 21 14"></polyline></svg>
                                    {stat.trend}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                        
                        {/* Views Over Time (Mock Chart) */}
                        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', border: '1px solid #F0F0F0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ margin: '0 0 30px 0', fontSize: '1rem', color: '#1A1A1A' }}>Views Over Time</h3>
                            
                            <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                                {/* Y-axis Labels */}
                                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999', paddingBottom: '30px', boxSizing: 'border-box' }}>
                                    <span>4K</span>
                                    <span>3K</span>
                                    <span>2K</span>
                                    <span>0</span>
                                </div>
                                
                                {/* Mock Chart Line (SVG) */}
                                <div style={{ position: 'absolute', left: '30px', right: 0, top: 0, height: '190px' }}>
                                    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 500 200">
                                        <path d="M 0 150 C 50 150, 80 80, 150 120 C 220 160, 240 50, 310 70 C 370 90, 420 20, 500 80" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                
                                {/* Horizontal Grid Lines */}
                                <div style={{ position: 'absolute', left: '30px', right: 0, top: '10px', height: '1px', background: '#F5F5F5' }}></div>
                                <div style={{ position: 'absolute', left: '30px', right: 0, top: '70px', height: '1px', background: '#F5F5F5' }}></div>
                                <div style={{ position: 'absolute', left: '30px', right: 0, top: '130px', height: '1px', background: '#F5F5F5' }}></div>
                                <div style={{ position: 'absolute', left: '30px', right: 0, bottom: '30px', height: '1px', background: '#F5F5F5' }}></div>
                                
                                {/* X-axis Labels */}
                                <div style={{ position: 'absolute', left: '30px', right: 0, bottom: 0, display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
                                    <span>May 20</span>
                                    <span>May 21</span>
                                    <span>May 22</span>
                                    <span>May 23</span>
                                    <span>May 24</span>
                                    <span>May 25</span>
                                    <span>May 26</span>
                                </div>
                            </div>
                        </div>

                        {/* Top File Types (Mock Donut Chart) */}
                        <div style={{ background: 'white', borderRadius: '12px', padding: '25px', border: '1px solid #F0F0F0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ margin: '0 0 30px 0', fontSize: '1rem', color: '#1A1A1A' }}>Top File Types</h3>
                            
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px' }}>
                                {/* Mock CSS Donut Chart */}
                                <div style={{ 
                                    width: '140px', 
                                    height: '140px', 
                                    borderRadius: '50%', 
                                    background: 'conic-gradient(#4F46E5 0% 60%, #818CF8 60% 85%, #C7D2FE 85% 95%, #E0E7FF 95% 100%)',
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {/* Inner white circle to make it a donut */}
                                    <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'white' }}></div>
                                </div>
                                
                                {/* Legend */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#666' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4F46E5' }}></div>
                                        <div style={{ width: '40px' }}>JPG</div>
                                        <div style={{ fontWeight: '600', color: '#333' }}>60%</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#666' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#818CF8' }}></div>
                                        <div style={{ width: '40px' }}>PNG</div>
                                        <div style={{ fontWeight: '600', color: '#333' }}>25%</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#666' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C7D2FE' }}></div>
                                        <div style={{ width: '40px' }}>WEBP</div>
                                        <div style={{ fontWeight: '600', color: '#333' }}>10%</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#666' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E0E7FF' }}></div>
                                        <div style={{ width: '40px' }}>GIF</div>
                                        <div style={{ fontWeight: '600', color: '#333' }}>5%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
};

export default Analytics;

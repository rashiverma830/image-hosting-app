import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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

const Pricing = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [yearly, setYearly] = useState(false);

    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => document.body.classList.remove('dashboard-body');
    }, []);

    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: '/month',
            desc: 'For getting started',
            features: ['5 GB Storage', 'Up to 50 images', 'Public & Shared Links'],
            btnText: 'Get Started',
            btnType: 'outline'
        },
        {
            name: 'Pro',
            price: yearly ? '$49.90' : '$4.99',
            period: yearly ? '/year' : '/month',
            desc: 'For professionals',
            features: ['50 GB Storage', 'Up to 10,000 images', 'Advanced Analytics', 'Priority Support'],
            btnText: 'Get Pro',
            btnType: 'solid'
        },
        {
            name: 'Business',
            price: yearly ? '$99.90' : '$9.99',
            period: yearly ? '/year' : '/month',
            desc: 'For teams',
            popular: true,
            features: ['200 GB Storage', 'Up to 20,000 images', 'Team Collaboration', 'Priority Support'],
            btnText: 'Get Business',
            btnType: 'solid'
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            desc: 'For large organizations',
            features: ['Custom Storage', 'Advanced Security', 'API Access', 'Dedicated Support'],
            btnText: 'Contact Sales',
            btnType: 'outline'
        }
    ];

    return (
        <div className="dashboard-layout">
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
                <div className="sidebar-header">
                    <div className="logo" style={{ padding: '0', display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png" alt="Lumina Logo" style={{ height: '32px', objectFit: 'contain' }} />
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
                    <NavLink to="/saved" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Heart className="icon" size={20} /> Favorites</NavLink>
                    <NavLink to="/my-images" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><ImageIcon className="icon" size={20} /> My Images</NavLink>
                    <NavLink to="/image/1" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><ImageIcon className="icon" size={20} /> Image Details</NavLink>
                    <NavLink to="/albums" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><BookImage className="icon" size={20} /> Albums</NavLink>
                    <NavLink to="/shared-links" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><LinkIcon className="icon" size={20} /> Shared Links</NavLink>
                    <NavLink to="/trash" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Trash2 className="icon" size={20} /> Trash</NavLink>
                    
                    
                    <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><BarChart2 className="icon" size={20} /> Analytics</NavLink>
                    <NavLink to="/image-tools" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Wand2 className="icon" size={20} /> Image Tools</NavLink>
                    <NavLink to="/api-access" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Code className="icon" size={20} /> API Access</NavLink>
                </nav>
                
                <div className="storage-card" style={{ margin: '20px', background: 'white', borderRadius: '16px', padding: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#666' }}>Storage Used</h4>
                    <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>23.4 GB</span>
                        <span style={{ fontSize: '0.85rem', color: '#999' }}> / 100 GB</span>
                    </div>
                    <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '10px', marginBottom: '15px', overflow: 'hidden' }}>
                        <div style={{ width: '23.4%', height: '100%', background: '#6366f1', borderRadius: '10px' }}></div>
                    </div>
                    <button onClick={() => navigate('/pricing')} style={{ width: '100%', padding: '10px', background: '#EEF2FF', color: '#6366f1', border: 'none', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Crown size={16} /> Upgrade Plan
                    </button>
                </div>
            </aside>
            <div className="main-wrapper">
                <Header title="Pricing Plans" breadcrumbs="Pricing" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="dashboard-content">
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px', marginBottom: '30px', marginTop: '-60px' }}>
                        <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '500' }}>Monthly</span>
                        <div 
                            onClick={() => setYearly(!yearly)}
                            style={{ 
                                width: '44px', height: '24px', 
                                background: '#6366f1', 
                                borderRadius: '12px', 
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'background 0.3s'
                            }}
                        >
                            <div style={{ 
                                position: 'absolute', top: '2px', 
                                left: yearly ? '22px' : '2px', 
                                width: '20px', height: '20px', 
                                background: 'white', 
                                borderRadius: '50%', 
                                transition: 'left 0.3s',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }}></div>
                        </div>
                        <span style={{ fontSize: '0.9rem', color: '#6366f1', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Yearly
                            <span style={{ background: '#EEF2FF', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>Popular</span>
                        </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {plans.map((plan, index) => (
                            <div key={index} style={{ 
                                background: 'white', 
                                borderRadius: '16px', 
                                padding: '30px', 
                                border: plan.popular ? '2px solid #6366f1' : '1px solid #E5E5E5', 
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                boxShadow: plan.popular ? '0 10px 30px rgba(99, 102, 241, 0.1)' : '0 2px 10px rgba(0,0,0,0.02)'
                            }}>
                                {plan.popular && (
                                    <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#EEF2FF', color: '#6366f1', fontSize: '0.75rem', fontWeight: '600', padding: '6px 16px', borderRadius: '20px', border: '1px solid #C7D2FE', whiteSpace: 'nowrap' }}>
                                        ★ Most Popular
                                    </div>
                                )}
                                
                                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: plan.popular ? '#6366f1' : '#1A1A1A', marginBottom: '15px' }}>{plan.name}</div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '5px' }}>
                                    <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1A1A1A' }}>{plan.price}</span>
                                    <span style={{ fontSize: '0.9rem', color: '#666' }}>{plan.period}</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '30px' }}>{plan.desc}</div>
                                
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                                    {plan.features.map((feature, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#333' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                                
                                <button 
                                    onClick={() => {
                                        fetch('http://localhost:5000/api/subscribe', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                planName: plan.name,
                                                billingCycle: yearly ? 'Yearly' : 'Monthly',
                                                price: plan.price
                                            })
                                        })
                                        .then(res => res.json())
                                        .then(data => {
                                            if (data.success) {
                                                alert(`Success! ${data.message}`);
                                            } else {
                                                alert(`Error: ${data.error}`);
                                            }
                                        })
                                        .catch(err => {
                                            console.error("Subscription error:", err);
                                            alert("Failed to connect to backend for subscription.");
                                        });
                                    }}
                                    style={{ 
                                    width: '100%', 
                                    padding: '12px', 
                                    borderRadius: '8px', 
                                    fontWeight: '600', 
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    border: plan.btnType === 'solid' ? 'none' : '1px solid #E5E5E5',
                                    background: plan.btnType === 'solid' ? '#6366f1' : 'white',
                                    color: plan.btnType === 'solid' ? 'white' : '#6366f1',
                                    transition: 'all 0.2s'
                                }}>
                                    {plan.btnText}
                                </button>
                            </div>
                        ))}
                    </div>
                    
                </main>
            </div>
        </div>
    );
};

export default Pricing;

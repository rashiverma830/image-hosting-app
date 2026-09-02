import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { 
  Home, 
  Image as ImageIcon, 
  Trash2, 
  RotateCcw,
  Eye,
  EyeOff,
  Lock,
  ShieldAlert,
  Check,
  Folder
} from 'lucide-react';
import '../styles/dashboard.css';

const DEFAULT_TRASH_ITEMS = [
    { id: 't1', name: 'Landscape.jpg', date: 'Deleted 2 days ago', size: '2.4 MB', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=500' },
    { id: 't2', name: 'Interior.png', date: 'Deleted 5 days ago', size: '1.8 MB', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500' },
    { id: 't3', name: 'Project Brief.pdf', date: 'Deleted 6 days ago', size: '1.2 MB', img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=500' },
    { id: 't4', name: 'Notes.txt', date: 'Deleted 1 day ago', size: '320 KB', img: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=500' },
    { id: 't5', name: 'Architecture.jpg', date: 'Deleted 3 days ago', size: '3.1 MB', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=500' }
];

const Trash = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [trashItems, setTrashItems] = useState([]);
    
    // Empty Trash & Restore All Modals State
    const [showEmptyModal, setShowEmptyModal] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const loadTrashItems = () => {
        const raw = localStorage.getItem('trashedItems');
        if (!raw) {
            localStorage.setItem('trashedItems', JSON.stringify(DEFAULT_TRASH_ITEMS));
            setTrashItems(DEFAULT_TRASH_ITEMS);
        } else {
            const stored = JSON.parse(raw);
            if (stored.length === 0) {
                // If empty array, reset to default items for demo
                localStorage.setItem('trashedItems', JSON.stringify(DEFAULT_TRASH_ITEMS));
                setTrashItems(DEFAULT_TRASH_ITEMS);
            } else {
                setTrashItems(stored);
            }
        }
    };

    useEffect(() => {
        document.body.classList.add('dashboard-body');
        loadTrashItems();

        const handleEmpty = () => {
            setShowEmptyModal(true);
        };

        const handleRestoreAllEvent = () => {
            setShowRestoreModal(true);
        };

        window.addEventListener('empty-trash', handleEmpty);
        window.addEventListener('restore-trash', handleRestoreAllEvent);

        return () => {
            document.body.classList.remove('dashboard-body');
            window.removeEventListener('empty-trash', handleEmpty);
            window.removeEventListener('restore-trash', handleRestoreAllEvent);
        };
    }, []);

    const deleteItemPermanently = async (id) => {
        const updated = trashItems.filter(item => item.id !== id);
        setTrashItems(updated);
        localStorage.setItem('trashedItems', JSON.stringify(updated));
        
        try {
            await fetch(`http://localhost:5000/api/images/${id}`, { method: 'DELETE' });
        } catch (err) {
            console.error("Failed to delete permanently from backend:", err);
        }
    };

    const restoreItem = (itemToRestore) => {
        const updated = trashItems.filter(item => item.id !== itemToRestore.id);
        setTrashItems(updated);
        localStorage.setItem('trashedItems', JSON.stringify(updated));
    };

    const handleRestoreAll = () => {
        setShowRestoreModal(true);
    };

    const confirmRestoreAll = () => {
        localStorage.setItem('trashedItems', JSON.stringify([]));
        setTrashItems([]);
        setShowRestoreModal(false);
    };

    const handleConfirmEmptyTrash = (e) => {
        e.preventDefault();
        const current = JSON.parse(localStorage.getItem('trashedItems') || '[]');
        current.forEach(item => {
            fetch(`http://localhost:5000/api/images/${item.id}`, { method: 'DELETE' }).catch(() => {});
        });
        localStorage.setItem('trashedItems', JSON.stringify([]));
        setTrashItems([]);
        setShowEmptyModal(false);
        setPassword('');
    };

    return (
        <div className="dashboard-layout">
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
                <div className="sidebar-header">
                    <div className="logo" style={{ padding: '0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="logo-icon" style={{ width: "32px", height: "32px" }}></div>
                        <span style={{ fontSize: "1.4rem", fontWeight: "800", color: "#6366f1" }}>Lumina</span>
                    </div>
                </div>
                
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Home className="icon" size={20} /> Dashboard</NavLink>
                    <NavLink to="/my-images" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><ImageIcon className="icon" size={20} /> My Images</NavLink>
                    <NavLink to="/trash" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Trash2 className="icon" size={20} /> Trash</NavLink>
                </nav>
            </aside>

            <div className="main-wrapper">
                <Header title="Trash" breadcrumbs="Trash" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                
                <main className="dashboard-content" style={{ padding: '30px' }}>
                    
                    {/* Top Page Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '24px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Trash2 size={24} color="#6366f1" />
                                <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '700', color: '#1A1A1A' }}>Trash</h1>
                            </div>
                            <p style={{ margin: '6px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                                Files in trash will be permanently deleted after 30 days
                            </p>
                        </div>

                        {/* Top Action Buttons (Restore All & Empty Trash) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <button
                                onClick={handleRestoreAll}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 20px', background: 'white', border: '1px solid #E2E8F0',
                                    borderRadius: '12px', fontWeight: '600', fontSize: '0.9rem',
                                    color: '#334155', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.background='#F8FAFC'}
                                onMouseOut={e => e.currentTarget.style.background='white'}
                            >
                                <RotateCcw size={16} /> Restore All
                            </button>
                            <button
                                onClick={() => {
                                    if (trashItems.length === 0) {
                                        alert("Trash is already empty!");
                                        return;
                                    }
                                    setShowEmptyModal(true);
                                }}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 20px', background: 'white', border: '1px solid #E2E8F0',
                                    borderRadius: '12px', fontWeight: '600', fontSize: '0.9rem',
                                    color: '#DC2626', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.background='#FEF2F2'}
                                onMouseOut={e => e.currentTarget.style.background='white'}
                            >
                                <Trash2 size={16} color="#DC2626" /> Empty Trash
                            </button>
                        </div>
                    </div>

                    {/* Selected Count Pill Badge */}
                    <div style={{ marginBottom: '24px' }}>
                        <span style={{
                            background: '#EEF2FF', color: '#6366f1', padding: '6px 14px',
                            borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700'
                        }}>
                            {trashItems.length} selected
                        </span>
                    </div>

                    {/* Trash Cards Grid */}
                    <div className="bids-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' }}>
                        {trashItems.map((item) => {
                            const ext = item.name.includes('.') ? item.name.split('.').pop().toUpperCase() : 'JPG';
                            return (
                                <div 
                                    key={item.id}
                                    style={{
                                        background: 'white', borderRadius: '18px', border: '1px solid #E2E8F0',
                                        overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                                        display: 'flex', flexDirection: 'column'
                                    }}
                                >
                                    {/* Image Thumbnail Area with Checked Circle */}
                                    <div style={{ height: '160px', position: 'relative', overflow: 'hidden', background: '#F1F5F9' }}>
                                        <img 
                                            src={item.img || item.url} 
                                            alt={item.name} 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                        />
                                        <div style={{
                                            position: 'absolute', top: '12px', left: '12px',
                                            width: '26px', height: '26px', borderRadius: '50%',
                                            background: '#6366f1', color: 'white', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                        }}>
                                            <Check size={16} strokeWidth={3} />
                                        </div>
                                    </div>

                                    {/* Info Area */}
                                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.name}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                                            {item.size || '2.4 MB'} • {ext}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                                            Deleted {item.date || 'recently'}
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                            <button
                                                onClick={() => restoreItem(item)}
                                                style={{
                                                    flex: 1, padding: '7px 10px', background: '#EEF2FF', color: '#6366f1',
                                                    border: 'none', borderRadius: '8px', fontWeight: '600',
                                                    fontSize: '0.78rem', cursor: 'pointer', display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center', gap: '4px'
                                                }}
                                            >
                                                <RotateCcw size={12} /> Restore
                                            </button>
                                            <button
                                                onClick={() => deleteItemPermanently(item.id)}
                                                style={{
                                                    flex: 1, padding: '7px 10px', background: 'white', color: '#DC2626',
                                                    border: '1px solid #FCA5A5', borderRadius: '8px', fontWeight: '600',
                                                    fontSize: '0.78rem', cursor: 'pointer'
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Dashed Information Card Placeholder */}
                        <div style={{
                            border: '2px dashed #C7D2FE',
                            background: '#F5F7FF',
                            borderRadius: '18px',
                            minHeight: '260px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '30px 20px',
                            textAlign: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: '#EEF2FF', color: '#6366f1', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Trash2 size={24} />
                            </div>
                            <span style={{ fontSize: '0.88rem', fontWeight: '600', color: '#6366f1', maxWidth: '180px', lineHeight: '1.4' }}>
                                Items in trash are permanently deleted after 30 days.
                            </span>
                        </div>
                    </div>
                </main>
            </div>

            {/* Empty Trash Confirmation Modal */}
            {showEmptyModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, padding: '20px'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '24px', padding: '36px',
                        width: '100%', maxWidth: '460px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px'
                    }}>
                        {/* Close Button */}
                        <button 
                            onClick={() => setShowEmptyModal(false)}
                            style={{
                                position: 'absolute', top: '24px', right: '24px',
                                background: 'none', border: 'none', color: '#94A3B8',
                                fontSize: '1.2rem', cursor: 'pointer', padding: '4px'
                            }}
                        >
                            ✕
                        </button>

                        {/* Top Red Trash Icon Badge */}
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: '#FEE2E2', color: '#DC2626', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', margin: '0 auto'
                        }}>
                            <Trash2 size={28} />
                        </div>

                        {/* Title & Description */}
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: '700', color: '#0F172A' }}>
                                Empty Trash?
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748B', lineHeight: '1.5' }}>
                                You are about to permanently delete <span style={{ color: '#DC2626', fontWeight: '700' }}>{trashItems.length} items</span> from your trash. This action cannot be undone.
                            </p>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleConfirmEmptyTrash} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#1E293B', marginBottom: '4px' }}>
                                    Confirm with your permission
                                </label>
                                <div style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '10px' }}>
                                    To continue, please enter your password
                                </div>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 14px',
                                    background: 'white'
                                }}>
                                    <Lock size={18} color="#94A3B8" />
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Purple Warning Notice Box */}
                            <div style={{
                                background: '#F4F3FF', border: '1px solid #E0E0FE',
                                borderRadius: '14px', padding: '14px 16px', display: 'flex',
                                alignItems: 'flex-start', gap: '12px'
                            }}>
                                <ShieldAlert size={20} color="#6366f1" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#312E81' }}>
                                        This action is permanent
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#4338CA', marginTop: '2px' }}>
                                        All files will be deleted forever and cannot be recovered.
                                    </div>
                                </div>
                            </div>

                            {/* Buttons Footer */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
                                <button 
                                    type="button"
                                    onClick={() => setShowEmptyModal(false)}
                                    style={{
                                        padding: '12px 24px', background: 'white', color: '#1E293B',
                                        border: '1px solid #E2E8F0', borderRadius: '12px', fontWeight: '600',
                                        fontSize: '0.95rem', cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    style={{
                                        padding: '12px 24px', background: '#DC2626', color: 'white',
                                        border: 'none', borderRadius: '12px', fontWeight: '600',
                                        fontSize: '0.95rem', cursor: 'pointer', display: 'flex',
                                        alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
                                    }}
                                >
                                    <Trash2 size={16} /> Empty Trash
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Restore All Confirmation Modal */}
            {showRestoreModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9999, padding: '20px'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '24px', padding: '36px',
                        width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        position: 'relative', display: 'flex', flexDirection: 'column', gap: '20px',
                        alignItems: 'center', textAlign: 'center'
                    }}>
                        {/* Close Button */}
                        <button 
                            onClick={() => setShowRestoreModal(false)}
                            style={{
                                position: 'absolute', top: '24px', right: '24px',
                                background: 'none', border: 'none', color: '#94A3B8',
                                fontSize: '1.2rem', cursor: 'pointer', padding: '4px'
                            }}
                        >
                            ✕
                        </button>

                        {/* Purple Restore Icon Badge */}
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: '#EEF2FF', color: '#6366f1', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', margin: '0 auto'
                        }}>
                            <RotateCcw size={28} />
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: '700', color: '#0F172A' }}>
                                Restore All Files?
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748B', lineHeight: '1.5' }}>
                                You are about to restore <span style={{ color: '#6366f1', fontWeight: '700' }}>{trashItems.length} items</span> from trash.<br />
                                All files will be restored to their original location.
                            </p>
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', background: '#F1F5F9', width: '100%', margin: '4px 0' }}></div>

                        {/* Notice / Location Info Box */}
                        <div style={{
                            background: '#F4F3FF', border: '1px solid #E0E0FE',
                            borderRadius: '16px', padding: '16px 20px', display: 'flex',
                            alignItems: 'flex-start', gap: '14px', width: '100%', textAlign: 'left'
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: '#E0E0FE', color: '#6366f1', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <Folder size={20} />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1E1B4B' }}>
                                    Restore to original location
                                </div>
                                <div style={{ fontSize: '0.82rem', color: '#4338CA', marginTop: '3px' }}>
                                    Files will be restored to the folders where they were before deletion.
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', width: '100%', marginTop: '6px' }}>
                            <button
                                onClick={() => setShowRestoreModal(false)}
                                style={{
                                    padding: '12px 26px', background: 'white', color: '#1E293B',
                                    border: '1px solid #E2E8F0', borderRadius: '12px', fontWeight: '600',
                                    fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.background='#F8FAFC'}
                                onMouseOut={e => e.currentTarget.style.background='white'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRestoreAll}
                                style={{
                                    padding: '12px 24px', background: '#6366f1', color: 'white',
                                    border: 'none', borderRadius: '12px', fontWeight: '600',
                                    fontSize: '0.95rem', cursor: 'pointer', display: 'flex',
                                    alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={e => e.currentTarget.style.background='#4f46e5'}
                                onMouseOut={e => e.currentTarget.style.background='#6366f1'}
                            >
                                <RotateCcw size={16} /> Restore All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trash;

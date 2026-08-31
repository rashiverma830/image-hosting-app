import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/dashboard.css';

const Bids = () => {
    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => {
            document.body.classList.remove('dashboard-body');
        };
    }, []);

    const bidItems = [
        { id: 1, title: 'Abstract 3D Design', bid: '2.55 ETH', time: '20h 45m', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop' },
        { id: 2, title: 'Neon Cyberpunk City', bid: '1.20 ETH', time: '12h 10m', img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=200&auto=format&fit=crop' },
        { id: 3, title: 'Golden Hour Portrait', bid: '0.85 ETH', time: '5h 30m', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
        { id: 4, title: 'Minimalist Architecture', bid: '3.10 ETH', time: '1d 4h', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=200&auto=format&fit=crop' }
    ];

    return (
        <>
            
            <div className="main-wrapper" style={{ marginLeft: 0 }}>
                <Header title="Active Bids" breadcrumbs="Bids" />
                <main className="dashboard-content">
                    <div className="bids-summary">
                        <div className="summary-card">
                            <h4>Total Active Bids</h4>
                            <h2>12</h2>
                        </div>
                        <div className="summary-card">
                            <h4>Highest Bid Made</h4>
                            <h2>4.50 ETH</h2>
                        </div>
                        <div className="summary-card">
                            <h4>Auctions Won</h4>
                            <h2>3</h2>
                        </div>
                    </div>

                    <h3 className="section-title">Current Bidding List</h3>
                    <div className="bids-grid">
                        {bidItems.map(item => (
                            <div key={item.id} className="bid-card">
                                <div className="bid-img">
                                    <img src={item.img} alt={item.title} />
                                    <div className="time-badge">⏳ {item.time}</div>
                                </div>
                                <div className="bid-info-box">
                                    <h4>{item.title}</h4>
                                    <div className="bid-stats">
                                        <div className="stat">
                                            <span>Current Bid</span>
                                            <strong>{item.bid}</strong>
                                        </div>
                                    </div>
                                    <button className="btn-purple full-btn">Increase Bid</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
};

export default Bids;



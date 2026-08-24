import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/dashboard.css';

const Wallet = () => {
    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => {
            document.body.classList.remove('dashboard-body');
        };
    }, []);

    const [walletAddress, setWalletAddress] = useState(null);
    const [balance, setBalance] = useState(12.45);
    const [transactions, setTransactions] = useState([
        { id: 1, type: 'Received', asset: 'Abstract 3D Design', amount: '+ 2.55 ETH', usd: '+$5,100', date: 'Today, 14:30', status: 'Completed', isPositive: true },
        { id: 2, type: 'Purchased', asset: 'Ethereal Forest', amount: '- 0.90 ETH', usd: '-$1,800', date: 'Yesterday, 09:15', status: 'Completed', isPositive: false },
        { id: 3, type: 'Deposit', asset: 'Wallet Top-up', amount: '+ 5.00 ETH', usd: '+$10,000', date: 'Aug 20, 2026', status: 'Completed', isPositive: true },
    ]);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWalletAddress(accounts[0]);
                alert("Wallet Connected Successfully!");
            } catch (error) {
                console.error(error);
                alert("Failed to connect wallet.");
            }
        } else {
            alert("Please install MetaMask to use this feature!");
        }
    };

    const handleDeposit = () => {
        const amount = parseFloat(prompt("Enter amount to deposit (ETH):", "1.0"));
        if (!isNaN(amount) && amount > 0) {
            setBalance(prev => prev + amount);
            const newTx = {
                id: Date.now(), type: 'Deposit', asset: 'Manual Top-up', 
                amount: `+ ${amount.toFixed(2)} ETH`, usd: `+$${(amount*2000).toLocaleString()}`, 
                date: new Date().toLocaleString(), status: 'Completed', isPositive: true
            };
            setTransactions([newTx, ...transactions]);
            alert(`Successfully deposited ${amount} ETH!`);
        }
    };

    const handleWithdraw = () => {
        const amount = parseFloat(prompt("Enter amount to withdraw (ETH):", "1.0"));
        if (!isNaN(amount) && amount > 0) {
            if (amount > balance) {
                alert("Insufficient balance!");
                return;
            }
            setBalance(prev => prev - amount);
            const newTx = {
                id: Date.now(), type: 'Withdrawal', asset: 'Bank Transfer', 
                amount: `- ${amount.toFixed(2)} ETH`, usd: `-$${(amount*2000).toLocaleString()}`, 
                date: new Date().toLocaleString(), status: 'Pending', isPositive: false
            };
            setTransactions([newTx, ...transactions]);
            alert(`Withdrawal request for ${amount} ETH submitted!`);
        }
    };

    const formatAddress = (addr) => {
        if (!addr) return '';
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar open" id="sidebar">
                <div className="sidebar-header">
                    <div className="logo"><div className="logo-icon"></div><span>Lumina</span></div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item"><span className="icon">⊞</span> Dashboard</Link>
                    <Link to="/bids" className="nav-item"><span className="icon">📈</span> Bids</Link>
                    <Link to="/saved" className="nav-item"><span className="icon">♡</span> Saved</Link>
                    <Link to="/creators" className="nav-item"><span className="icon">👥</span> Creators</Link>
                    <Link to="/wallet" className="nav-item active"><span className="icon">👛</span> Wallet</Link>
                </nav>
            </aside>
            <div className="main-wrapper">
                <Header title="My Wallet" breadcrumbs="Wallet" />
                <main className="dashboard-content">
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                        
                        {/* Balance Card */}
                        <div style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #a855f7 100%)', borderRadius: '20px', padding: '30px', color: 'white', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)' }}>
                            <div style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '10px' }}>Total Balance</div>
                            <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '5px' }}>{balance.toFixed(2)} ETH</div>
                            <div style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '25px' }}>≈ ${(balance * 2000).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD</div>
                            
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button onClick={handleDeposit} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'white', color: '#FF6B6B', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform='scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform='scale(1)'}>Deposit</button>
                                <button onClick={handleWithdraw} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', background: 'transparent', color: 'white', fontWeight: '600', cursor: 'pointer', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform='scale(0.95)'} onMouseUp={e => e.currentTarget.style.transform='scale(1)'}>Withdraw</button>
                            </div>
                        </div>

                        {/* Connected Wallets Card */}
                        <div style={{ background: 'white', borderRadius: '20px', padding: '30px', border: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 20px 0' }}>Connected Wallets</h3>
                            
                            {walletAddress ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px solid #E5E5E5', borderRadius: '12px', marginBottom: '15px', background: '#FAFAFA' }}>
                                    <div style={{ width: '40px', height: '40px', background: '#F6851B', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>M</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600' }}>MetaMask</div>
                                        <div style={{ fontSize: '0.85rem', color: '#999' }}>{formatAddress(walletAddress)}</div>
                                    </div>
                                    <div style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: '500', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '10px' }}>Active</div>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#999', fontSize: '0.9rem' }}>
                                    No wallet connected yet.
                                </div>
                            )}
                            
                            <div onClick={connectWallet} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px dashed #D9D9D9', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', marginTop: 'auto' }} onMouseOver={e => e.currentTarget.style.borderColor = '#FF6B6B'} onMouseOut={e => e.currentTarget.style.borderColor = '#D9D9D9'}>
                                <div style={{ width: '40px', height: '40px', background: '#F8F9FA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '1.2rem' }}>+</div>
                                <div style={{ fontWeight: '500', color: '#666' }}>{walletAddress ? 'Switch Wallet' : 'Connect MetaMask'}</div>
                            </div>
                        </div>
                    </div>

                    <h3 className="section-title">Recent Transactions</h3>
                    <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #F0F0F0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                                    <th style={{ padding: '20px', color: '#999', fontWeight: '500', fontSize: '0.9rem' }}>Type</th>
                                    <th style={{ padding: '20px', color: '#999', fontWeight: '500', fontSize: '0.9rem' }}>Asset/Details</th>
                                    <th style={{ padding: '20px', color: '#999', fontWeight: '500', fontSize: '0.9rem' }}>Amount</th>
                                    <th style={{ padding: '20px', color: '#999', fontWeight: '500', fontSize: '0.9rem' }}>Date</th>
                                    <th style={{ padding: '20px', color: '#999', fontWeight: '500', fontSize: '0.9rem' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#999' }}>No transactions yet.</td></tr>
                                ) : (
                                    transactions.map(tx => (
                                        <tr key={tx.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                                            <td style={{ padding: '20px', fontWeight: '500' }}>{tx.type}</td>
                                            <td style={{ padding: '20px' }}>{tx.asset}</td>
                                            <td style={{ padding: '20px' }}>
                                                <div style={{ fontWeight: '600', color: tx.isPositive ? '#10B981' : '#1A1A1A' }}>{tx.amount}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#999' }}>{tx.usd}</div>
                                            </td>
                                            <td style={{ padding: '20px', color: '#666', fontSize: '0.9rem' }}>{tx.date}</td>
                                            <td style={{ padding: '20px' }}>
                                                <span style={{ 
                                                    background: tx.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                    color: tx.status === 'Completed' ? '#10B981' : '#F59E0B',
                                                    padding: '6px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: '500'
                                                }}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Wallet;


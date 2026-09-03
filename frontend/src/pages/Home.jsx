import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeBg from '../assets/welcome-bg.png';
import '../styles/style.css';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.remove('dashboard-body');
        document.body.classList.remove('dark-mode');
        // Prevent any duplicate body backgrounds
        document.body.style.backgroundImage = 'none';
        document.body.style.backgroundColor = '#0b3b6f';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '';
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            overflow: 'hidden'
        }}>
            {/* Direct High-Resolution Wallpaper Image */}
            <img 
                src={welcomeBg} 
                alt="Wallpaper Background" 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    zIndex: 1
                }} 
            />

            {/* Soft Cinematic Tone Overlay Matching User Screenshot */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(10, 25, 50, 0.38)',
                zIndex: 2
            }} />

            {/* Centered Content */}
            <main style={{
                position: 'relative',
                zIndex: 3,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '0 20px'
            }}>
                <h1 style={{ 
                    color: '#FFFFFF', 
                    fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)', 
                    fontWeight: 800, 
                    marginBottom: '0.5rem',
                    textShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    letterSpacing: '-0.5px'
                }}>
                    Welcome Back!
                </h1>

                {/* Exactly 2 lines paragraph matching screenshot with extra top padding */}
                <p style={{ 
                    color: 'rgba(255, 255, 255, 0.92)', 
                    fontSize: 'clamp(0.82rem, 1.2vw, 0.92rem)', 
                    maxWidth: '320px', 
                    lineHeight: 1.5,
                    margin: '0 auto',
                    padding: '28px 0 22px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.25)',
                    fontWeight: 400
                }}>
                    Enter personal details to your employee<br />account
                </p>

                {/* Pill Button Container - Larger Size */}
                <div className="actions" style={{
                    display: 'flex',
                    height: '62px',
                    width: '100%',
                    maxWidth: '320px',
                    margin: '12px auto 0',
                    alignItems: 'center',
                    background: 'rgba(32, 70, 98, 0.74)',
                    borderRadius: '45px',
                    padding: '5px 6px',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: 'none',
                    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.25)'
                }}>
                    <button 
                        className="btn-signin" 
                        onClick={() => navigate('/signin')}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: '#FFFFFF',
                            fontSize: '1.08rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            height: '100%',
                            borderRadius: '35px',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            letterSpacing: '0.2px'
                        }}
                    >
                        Sign in
                    </button>
                    <div className="signup-container" style={{ flex: 1, height: '100%' }}>
                        <button 
                            className="btn-signup" 
                            onClick={() => navigate('/signup')}
                            style={{
                                width: '100%',
                                height: '100%',
                                background: '#FFFFFF',
                                border: 'none',
                                color: '#3452C9',
                                fontSize: '1.08rem',
                                fontWeight: '700',
                                borderRadius: '35px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                letterSpacing: '0.2px'
                            }}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <main className="content">
                <h1>Welcome Back!</h1>
                <p>Enter personal details to your employee account</p>
                <div className="actions">
                    <button className="btn-signin" onClick={() => navigate('/signin')}>Sign in</button>
                    <div className="signup-container">
                        <button className="btn-signup" onClick={() => navigate('/signup')}>Sign up</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;


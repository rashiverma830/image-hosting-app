import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/style.css';

const SignIn = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="signin-page">
            <div className="signin-container">
                <header className="signin-header">
                    <Link to="/" className="back-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        Back
                    </Link>
                </header>

                <main className="signin-card">
                    <h2>Welcome back</h2>
                    
                    <form className="signin-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" defaultValue="kristin.watson@example.com" placeholder="Email address" required />
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" defaultValue="1234567890" placeholder="Password" required />
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        </div>
                        
                        <div className="form-actions">
                            <label className="remember-me">
                                <input type="checkbox" defaultChecked />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="forgot-pwd">Forgot password?</a>
                        </div>
                        
                        <button type="submit" className="btn-primary">Sign in</button>
                    </form>
                    
                    <div className="divider">
                        <span>Sign in with</span>
                    </div>
                    
                    <div className="social-login">
                        <button className="social-btn facebook"><svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.33h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07"/></svg></button>
                        <button className="social-btn twitter"><svg viewBox="0 0 24 24" fill="#1DA1F2"><path d="M23.95 4.57c-.88.39-1.83.65-2.83.77 1.02-.61 1.8-1.57 2.17-2.73-.95.56-2 1-3.13 1.22-.9-.96-2.18-1.56-3.6-1.56-2.73 0-4.94 2.21-4.94 4.94 0 .39.04.77.13 1.13-4.1-.21-7.74-2.17-10.18-5.16-.43.74-.68 1.59-.68 2.48 0 1.71.87 3.22 2.2 4.11-.8-.03-1.56-.25-2.22-.62v.06c0 2.38 1.69 4.37 3.94 4.82-.41.11-.85.17-1.3.17-.32 0-.63-.03-.94-.09.63 1.95 2.44 3.37 4.58 3.41-1.68 1.32-3.8 2.1-6.11 2.1-.4 0-.79-.02-1.18-.07 2.17 1.39 4.75 2.2 7.51 2.2 9.02 0 13.95-7.47 13.95-13.95 0-.21-.01-.43-.02-.64.96-.69 1.79-1.56 2.45-2.55"/></svg></button>
                        <button className="social-btn google"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg></button>
                        <button className="social-btn apple"><svg viewBox="0 0 24 24" fill="#000000"><path d="M17.05 16.57c-.52.74-1.04 1.5-1.68 1.51-.62 0-.84-.38-1.54-.38-.72 0-.96.38-1.56.38-.63.01-1.09-.67-1.63-1.44-1.24-1.78-2.18-5.01-1.53-7.23.32-1.07 1.04-1.83 2-2.2.61-.24 1.3-.33 1.95-.12.63.19 1.14.6 1.48.6.35 0 .93-.46 1.7-.63 1.06-.24 1.95-.03 2.59.39.81.54 1.1 1.25 1.14 1.34-.03.02-1.25.73-1.22 2.17.03 1.71 1.49 2.32 1.54 2.34-.02.04-.24.81-.8 1.63M14.97 4.14c.3-.35.5-.83.45-1.3-.43.02-.95.28-1.26.63-.26.29-.49.77-.42 1.23.47.04.93-.2 1.23-.56"/></svg></button>
                    </div>
                    
                    <p className="signup-prompt">Don't have an account? <Link to="/signup">Sign up</Link></p>
                </main>
            </div>
        </div>
    );
};

export default SignIn;


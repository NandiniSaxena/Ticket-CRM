import { Head } from "@inertiajs/react";

export default function Home() {
    return (
        <>
            <Head title="Ticket CRM - Professional Support Management" />

            <style jsx>{`
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Helvetica', 'Arial', sans-serif;
                    background: white;
                    color: #1e293b;
                    min-height: 100vh;
                }

                .navbar {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 90%;
                    max-width: 1200px;
                    height: 80px;
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 40px;
                    z-index: 1000;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                }

                .logo {
                    display: flex;
                    align-items: center;
                    text-decoration: none;
                    color: #1e293b;
                    font-size: 28px;
                    font-weight: 900;
                }

                .logo img {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    margin-right: 12px;
                }

                .nav-links {
                    display: flex;
                    list-style: none;
                    gap: 40px;
                }

                .nav-links a {
                    color: #475569;
                    text-decoration: none;
                    font-size: 18px;
                    font-weight: 600;
                    padding: 10px 20px;
                    border-radius: 30px;
                    transition: all 0.3s;
                }

                .nav-links a.active, .nav-links a:hover {
                    background: #0f172a;
                    color: white;
                }

                .nav-login-btn {
                    background: #0f172a;
                    color: white;
                    padding: 12px 28px;
                    border-radius: 50px;
                    font-size: 18px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.3s;
                }

                .nav-login-btn:hover {
                    background: #1e293b;
                }

                .hero {
                    padding: 280px 5% 100px;
                    position: relative;
                    overflow: hidden;
                }

                .hero-bg {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: url('/back.jpeg') right center/cover no-repeat; /* Your hero image */
                    z-index: -2;
                }

                .hero-overlay {
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: -1;
                }

                .hero-content {
                    max-width: 600px;
                    color: white;
                }

                .hero h1 {
                    font-size: 64px;
                    font-weight: 900;
                    line-height: 1.1;
                    margin-bottom: 20px;
                }

                .hero p {
                    font-size: 20px;
                    opacity: 0.9;
                    margin-bottom: 40px;
                }

                .cta-btn {
                    background: white;
                    color: #0f172a;
                    padding: 16px 36px;
                    border-radius: 50px;
                    font-size: 18px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.3s;
                }

                .cta-btn:hover {
                    background: #f1f5f9;
                    transform: translateY(-3px);
                }

                .features {
                    padding: 100px 5%;
                    background: white;
                    text-align: center;
                }

                .section-title {
                    font-size: 40px;
                    font-weight: 900;
                    margin-bottom: 60px;
                    color: #0f172a;
                }

                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .feature-card {
                    background: #f8fafc;
                    padding: 30px;
                    border-radius: 30px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
                    transition: transform 0.3s;
                }

                .feature-card:hover {
                    transform: translateY(-10px);
                }

                .feature-icon {
                    font-size: 40px;
                    margin-bottom: 20px;
                }

                .feature-card h3 {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: #0f172a;
                }

                .feature-card p {
                    font-size: 16px;
                    color: #64748b;
                    line-height: 1.6;
                }

                .cta-section {
                    padding: 100px 5%;
                    background: #f8fafc;
                    text-align: center;
                    border-radius: 40px;
                    margin: 0 5%;
                }

                .cta-title {
                    font-size: 48px;
                    font-weight: 900;
                    margin-bottom: 20px;
                    color: #0f172a;
                }

                .cta-desc {
                    font-size: 20px;
                    color: #64748b;
                    max-width: 800px;
                    margin: 0 auto 50px;
                }

                .cta-buttons {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn-register {
                    background: white;
                    color: #0f172a;
                    border: 2px solid #0f172a;
                    padding: 18px 40px;
                    border-radius: 50px;
                    font-size: 20px;
                    font-weight: 700;
                    text-decoration: none;
                }

                .btn-login {
                    background: #0f172a;
                    color: white;
                    padding: 18px 40px;
                    border-radius: 50px;
                    font-size: 20px;
                    font-weight: 700;
                    text-decoration: none;
                }

                .bottom-image-section {
                    padding: 100px 5%;
                    text-align: center;
                    background: #f8fafc;
                }

                .bottom-image {
                    width: 100%;
                    max-width: 1200px;
                    height: auto;
                    border-radius: 20px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }

                .footer {
                    background: #0f172a;
                    color: white;
                    padding: 80px 5% 40px;
                    text-align: center;
                }

                .footer p {
                    font-size: 16px;
                    opacity: 0.7;
                    margin-bottom: 10px;
                }

                @media (max-width: 768px) {
                    .navbar { padding: 0 20px; height: 70px; }
                    .nav-links { display: none; }
                    .hero h1 { font-size: 48px; }
                    .hero p { font-size: 18px; }
                    .cta-buttons { flex-direction: column; align-items: center; }
                    .bottom-image { height: 300px; object-fit: cover; }
                }
            `}</style>

            {/* NAVBAR */}
            <nav className="navbar">
                <a href="/" className="logo">
                    <img src="https://cdn-icons-png.flaticon.com/512/833/833593.png" alt="Ticket CRM" />
                    <span>Ticket CRM</span>
                </a>

                <ul className="nav-links">
                    <li><a href="#home" className="active">Home</a></li>
                    <li><a href="#features">Features</a></li>
                </ul>

                {/* Login Button */}
                <a href="/login" className="nav-login-btn">Login</a>
            </nav>

            {/* HERO SECTION */}
            <section className="hero" id="home">
                <div className="hero-bg"></div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Ticket Management CRM</h1>
                    <p>A clean, secure & efficient system to manage issues and workflows.</p>
                    <a href="/register" className="cta-btn">Start for free</a>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="features" id="features">
                <h2 className="section-title">Core Features</h2>

                <div className="feature-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔐</div>
                        <h3>Authentication</h3>
                        <p>Secure login, registration, and role-based access control for users, assignees, and admins.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📝</div>
                        <h3>Ticket Creation</h3>
                        <p>Create tickets with subject, description, priority, team, and attachments.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">👥</div>
                        <h3>User Management</h3>
                        <p>Admin panel to manage users, assignees, and roles with full control.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3>Ticket Listing</h3>
                        <p>View, filter, and track all tickets in real-time with status updates.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Assignment System</h3>
                        <p>Assign tickets to team members with automatic notifications and tracking.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🛡️</div>
                        <h3>Access Control</h3>
                        <p>Precise permissions ensuring data security and privacy.</p>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="cta-section">
                <h2 className="cta-title">Let's streamline your support!</h2>
                <p className="cta-desc">Join thousands of teams using Ticket CRM to deliver exceptional customer support.</p>
                <div className="cta-buttons">
                    <a href="/register" className="btn-register">Register</a>
                    <a href="/login" className="btn-login">Login</a>
                </div>
            </section>

            <section className="bottom-image-section">
                <img src="back2.jpeg" alt="Team collaboration or support illustration" className="bottom-image" />
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <p>© 2025 Ticket CRM. All Rights Reserved.</p>
                <p>Professional Support Ticket Management System</p>
            </footer>
        </>
    );
}

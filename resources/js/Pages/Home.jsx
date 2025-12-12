import { Head } from "@inertiajs/react";

export default function Home() {
    return (
        <>
            <Head title="Ticket CRM - Landing Page" />

            <style>{`
                * { margin: 0; padding: 0; box-sizing: border-box; font-family: "Nunito", sans-serif; }
                body {
                    background: url('/background.jpeg') center/cover no-repeat fixed;
                }
                body::before {
                    content: "";
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background-image: url('/background.jpeg');
                    background-size: cover; background-position: center;
                    opacity: 0.18; z-index: -1;
                }
                .nav {
                    width: 90%; height: 80px;
                    background: white; backdrop-filter: blur(8px); border-radius: 45px;
                    position: fixed; top: 15px; left: 5%;
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 40px; color: black; z-index: 1000;
                }
                .logo { height: 60px; width: 60px; border-radius: 50%; }
                .logo-section { display: flex; align-items: center; text-decoration: none; }
                .logo-text { font-size: 26px; font-weight: 900; margin-left: 10px; }

                .menu { display: flex; list-style: none; }
                .menu li { margin: 0 15px; }
                .menu a { text-decoration: none; font-size: 18px; font-weight: bold; color: black; transition: 0.3s; }
                .menu a:hover { color: #df343dff; }

                .nav-btn { background: #0d8b94; color: white; padding: 14px 30px; border-radius: 45px; font-size: 20px; font-weight: bold; text-decoration: none; transition: 0.3s; }
                .nav-btn:hover { background: white; color: #0d8b94; }

                .hamburger { display: none; flex-direction: column; cursor: pointer; }
                .hamburger div { width: 28px; height: 3px; background-color: black; margin: 4px 0; transition: 0.4s; }

                .mobile-menu {
                    display: none;
                    position: absolute;
                    top: 80px;
                    right: 5%;
                    background: white;
                    width: 200px;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    flex-direction: column;
                    z-index: 1000;
                }
                .mobile-menu a { padding: 15px 20px; text-decoration: none; color: black; font-weight: 600; border-bottom: 1px solid #ddd; }
                .mobile-menu a:hover { background: #f1f1f1; }

                .hero { width: 100%; padding-top: 160px; text-align: center; padding-bottom: 80px; }
                .hero h1 { font-size: 60px; font-weight: 900; color: white; }
                .hero p { font-size: 22px; margin-top: 15px; color: white; }

                .features { padding: 80px 5%; }
                .section-title { text-align: center; font-size: 44px; font-weight: 900; margin-bottom: 40px; color: white; }

                .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
                .feature-box { background: white; padding: 30px; border-radius: 20px; border: 1px solid #dce6e8; box-shadow: 0 4px 20px rgba(0,0,0,0.06); transition: 0.3s; }
                .feature-box:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0,0,0,0.12); }
                .feature-box h3 { font-size: 24px; margin-bottom: 10px; color: #0f5f68; }

                .buttons { text-align: center; margin-top: 50px; }
                .btn { padding: 16px 38px; font-size: 20px; border-radius: 50px; text-decoration: none; margin: 0 15px; font-weight: 700; transition: 0.3s; }
                .btn-register { background: #0d8b94; color: white; }
                .btn-register:hover { background: #094e53; }
                .btn-login { background: #111; color: white; }
                .btn-login:hover { background: #0d8b94; }

                .footer { background: #0d4d56; color: white; padding: 50px; text-align: center; margin-top: 60px; }

                @media (max-width: 768px) {
                    .menu, .nav-btn { display: none; }
                    .hamburger { display: flex; }
                    .hero h1 { font-size: 42px; }
                    .hero p { font-size: 18px; }

                    .buttons { display: flex; flex-direction: column; gap: 15px; }
                    .buttons .btn { width: 100%; text-align: center; }
                }
            `}</style>

            <nav className="nav">
                <a href="#" className="logo-section">
                    <img src="https://cdn-icons-png.flaticon.com/512/833/833593.png" className="logo" />
                    <span className="logo-text">Ticket CRM</span>
                </a>

                <ul className="menu">
                    <li><a href="/">Home</a></li>
                    <li><a href="#features">Features</a></li>
                </ul>

                <a href="/login" className="nav-btn">Login</a>

                <div className="hamburger" onClick={() => toggleMenu()}>
                    <div></div><div></div><div></div>
                </div>

                <div id="mobileMenu" className="mobile-menu">
                    <a href="/login">Login</a>
                    <a href="/register">Register</a>
                    <a href="#features">Features</a>
                    <a href="/users">Users</a>
                </div>
            </nav>

            <section className="hero">
                <h1>Ticket Management CRM</h1>
                <p>A clean, secure & efficient system to manage issues and workflows.</p>
            </section>

            <section id="features" className="features">
                <h2 className="section-title">Core Features</h2>

                <div className="feature-grid">
                    <div className="feature-box"><h3>🔐 Authentication</h3><p>Secure Login, Registration & Session Management</p></div>
                    <div className="feature-box"><h3>📝 Ticket Creation</h3><p>Create tickets with attachments, status & details</p></div>
                    <div className="feature-box"><h3>👤 User Management</h3><p>Manage user roles, assignments & permissions</p></div>
                    <div className="feature-box"><h3>📊 Ticket Listing</h3><p>View, sort & filter tickets in real-time</p></div>
                    <div className="feature-box"><h3>⚙ Access Control</h3><p>Only authors & assignees can manage their own tickets</p></div>
                </div>

                <div className="buttons">
                    <a href="/register" className="btn btn-register">Register</a>
                    <a href="/login" className="btn btn-login">Login</a>
                </div>
            </section>

            <footer className="footer">
                <p>© 2025 TicketCRM. All Rights Reserved.</p>
            </footer>

            <script>
                {`
                function toggleMenu() {
                    const menu = document.getElementById('mobileMenu');
                    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
                }
                `}
            </script>
        </>
    );
}

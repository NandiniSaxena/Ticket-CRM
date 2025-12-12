import { useState } from "react";
import { Head, router } from "@inertiajs/react";

export default function Login() {

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    function submit(e) {
        e.preventDefault();
        router.post("/login", form);
    }

    return (
        <>
            <Head title="Login - Ticket CRM">
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="body-bg">
                <div className="container">
                    <div className="left">
                        <h1>Welcome<br />Back</h1>
                        <p>Login to manage your support tickets easily.</p>
                    </div>

                    <div className="right">
                        <h2>Login</h2>

                        <form onSubmit={submit}>
                            <div className="input-box">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    required
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                />
                            </div>

                            <div className="input-box">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                />
                            </div>

                            <button className="btn-main" type="submit">Login</button>
                        </form>

                        <p className="login-link">
                            Don't have an account? <a href="/register">Create one</a>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                * { box-sizing: border-box; }
                .body-bg {
                    margin: 0;
                    padding: 0;
                    font-family: "Poppins", sans-serif;
                    background: linear-gradient(to bottom right, #1a1e21, #011c24);
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .container {
                    width: 100%;
                    max-width: 900px;
                    background: white;
                    display: flex;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                }
                .left {
                    width: 45%;
                    background: url('/reg.jpg') center/cover no-repeat;
                    color: white;
                    padding: 50px 30px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .left h1 {
                    font-size: 32px;
                    margin-bottom: 15px;
                    font-weight: 700;
                }
                .left p {
                    font-size: 15px;
                    opacity: 0.9;
                }
                .right {
                    width: 55%;
                    padding: 50px 40px;
                }
                .right h2 {
                    font-size: 28px;
                    margin-bottom: 25px;
                    font-weight: 700;
                    text-align: center;
                }
                .input-box input {
                    width: 100%;
                    padding: 14px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    font-size: 15px;
                    margin-bottom: 15px;
                }
                .btn-main {
                    width: 100%;
                    padding: 16px;
                    background: #000;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: 0.3s;
                }
                .btn-main:hover { background: #333; }
                .login-link {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 14px;
                }
                @media (max-width: 768px) {
                    .container { flex-direction: column; }
                    .left, .right { width: 100%; }
                    .left { height: 200px; }
                }
            `}</style>
        </>
    );
}

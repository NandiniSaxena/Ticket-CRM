import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";

export default function Login() {
    const { errors, flash } = usePage().props;

    const [form, setForm] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const [touched, setTouched] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
        setTouched({ ...touched, [name]: true });
    };

    const submit = (e) => {
        e.preventDefault();

        router.post("/login", form, {
            onError: (err) => {
                // Inertia will preserve input and show errors
            },
        });
    };

    const getError = (field) => {
        return errors[field];
    };

    return (
        <>
            <Head title="Login - Ticket CRM">
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div className="body-bg">
                <div className="container">
                    <div className="left">
                        <h1>Welcome<br />Back</h1>
                        <p>Login to manage your support tickets easily.</p>
                    </div>

                    <div className="right">
                        <h2>Login</h2>

                        {/* Success Message */}
                        {flash?.success && (
                            <div className="alert alert-success mb-3">
                                {flash.success}
                            </div>
                        )}

                        {/* General Error (Wrong credentials) */}
                        {errors.email && (
                            <div className="alert alert-danger mb-3">
                                {errors.email}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="input-box">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                                {touched.email && getError("email") && !errors.email && (
                                    <small className="text-danger">{getError("email")}</small>
                                )}
                            </div>

                            <div className="input-box">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                                {touched.password && getError("password") && (
                                    <small className="text-danger">{getError("password")}</small>
                                )}
                            </div>

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div className="form-check">
                                    <input
                                        type="  checkbox"
                                        name="remember"
                                        id="remember"
                                        className="form-check-input"
                                        checked={form.remember}
                                        onChange={handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="remember">
                                        Remember me
                                    </label>
                                </div>
                                {/* Optional: Forgot password link */}
                                {/* <a href="/forgot-password" className="text-muted small">Forgot password?</a> */}
                            </div>

                            <button className="btn-main" type="submit">
                                Login
                            </button>
                        </form>

                        <p className="login-link">
                            Don't have an account? <a href="/register">Create one</a>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .body-bg {
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
                .left h1 { font-size: 32px; margin-bottom: 15px; font-weight: 700; }
                .left p { font-size: 15px; opacity: 0.9; }
                .right {
                    width: 55%;
                    padding: 50px 40px;
                }
                .right h2 { font-size: 28px; margin-bottom: 25px; font-weight: 700; text-align: center; }
                .input-box { margin-bottom: 8px; }
                .input-box input {
                    width: 100%;
                    padding: 14px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                    font-size: 15px;
                }
                .input-box input:focus {
                    outline: none;
                    border-color: #000;
                }
                .text-danger, .alert-danger {
                    display: block;
                    margin-top: 5px;
                    font-size: 13px;
                }
                .alert {
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .alert-danger { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
                .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
                .form-check-input { cursor: pointer; }
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
                    .left { height: 200px; padding: 30px; }
                }
            `}</style>
        </>
    );
}

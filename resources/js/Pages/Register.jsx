import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";

export default function Register() {
    const { errors, flash } = usePage().props; // Get server-side errors & flash

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const [touched, setTouched] = useState({}); // Track which fields user touched
    const [clientErrors, setClientErrors] = useState({}); // Client-side validation

    // Client-side validation
    const validateField = (name, value) => {
        let error = "";

        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) error = "Email is required";
            else if (!emailRegex.test(value)) error = "Please enter a valid email address";
        }

        if (name === "password" && value && value.length < 6) {
            error = "Password must be at least 6 characters";
        }

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Real-time validation
        const error = validateField(name, value);
        setClientErrors({ ...clientErrors, [name]: error });

        setTouched({ ...touched, [name]: true });
    };

    const submit = (e) => {
        e.preventDefault();

        // Final client validation before submit
        const newErrors = {};
        Object.keys(form).forEach((key) => {
            const error = validateField(key, form[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setClientErrors(newErrors);
            return;
        }

        router.post("/register", form, {
            onError: (errors) => {
                setClientErrors(errors); // Show server errors
            },
        });
    };

    // Combine client + server errors
    const getError = (field) => {
        return clientErrors[field] || errors[field];
    };

    return (
        <>
            <Head title="Create Account - Ticket CRM">
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div className="body-bg">
                <div className="container">
                    <div className="left">
                        <h1>Create your<br />Account</h1>
                        <p>Join our Ticket CRM system and manage support tickets efficiently.</p>
                    </div>

                    <div className="right">
                        <h2>Sign Up</h2>

                        {/* Success Message */}
                        {flash?.success && (
                            <div className="alert alert-success mb-3">
                                {flash.success}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="input-box">
                                <input
                                    type="text"
                                    name="first_name"
                                    placeholder="First name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    required
                                />
                                {touched.first_name && getError("first_name") && (
                                    <small className="text-danger">{getError("first_name")}</small>
                                )}
                            </div>

                            <div className="input-box">
                                <input
                                    type="text"
                                    name="last_name"
                                    placeholder="Last name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    required
                                />
                                {touched.last_name && getError("last_name") && (
                                    <small className="text-danger">{getError("last_name")}</small>
                                )}
                            </div>

                            <div className="input-box">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email address"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                                {touched.email && getError("email") && (
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
                                    minLength="6"
                                />
                                {touched.password && getError("password") && (
                                    <small className="text-danger">{getError("password")}</small>
                                )}
                            </div>

                            <div className="terms">
                                <input type="checkbox" id="terms" required />
                                <label htmlFor="terms">
                                    I accept the <a href="#">Terms & Conditions</a>
                                </label>
                            </div>

                            <button className="btn-main" type="submit">
                                Join us
                            </button>
                        </form>

                        <p className="login-link">
                            Already have an account? <a href="/login">Login here</a>
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
                .text-danger { display: block; margin-top: 5px; font-size: 13px; }
                .terms {
                    margin: 15px 0;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .terms label { cursor: pointer; }
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
                .alert {
                    padding: 12px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
                @media (max-width: 768px) {
                    .container { flex-direction: column; }
                    .left, .right { width: 100%; }
                    .left { height: 200px; padding: 30px; }
                }
            `}</style>
        </>
    );
}

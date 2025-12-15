import React, { useState, useEffect } from "react";
import { Head, Link, usePage, useForm, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function Profile() {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || "User";

    const { data, setData, patch, processing, errors, reset } = useForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"), {
            preserveScroll: true,
            onSuccess: () => reset("password", "password_confirmation"),
        });
    };

    useEffect(() => {
        if (!window.bootstrap) {
            const script = document.createElement("script");
            script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js";
            script.async = true;
            document.body.appendChild(script);
            window.bootstrap = true;
        }
    }, []);

    return (
        <>
            <Head title="Profile - Helpdesk" />

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />

            <style jsx>{`
                body { background: #f0f2f5; font-family: 'Segoe UI', Arial, sans-serif; }
                .sidebar {
                    width: 230px; height: 100vh; background: #1a1e21; position: fixed; top: 0; left: 0;
                    color: white; padding-top: 20px; z-index: 1000; transition: left 0.3s;
                }
                .sidebar a { padding: 14px 20px; display: block; color: #c9c9c9;
                    text-decoration: none; border-left: 3px solid transparent; }
                .sidebar a:hover, .sidebar a.active { background: #2d3238; color: white; border-left-color: #0d6efd; }

                .topbar {
                    height: 60px; background: #fff; margin-left: 230px; display: flex;
                    align-items: center; justify-content: space-between; padding: 0 25px;
                    border-bottom: 1px solid #dcdcdc; position: fixed; width: calc(100% - 230px); z-index: 999;
                }
                .content { margin-left: 240px; padding: 90px 30px 30px; }

                .profile-card { max-width: 650px; margin: 0 auto; background: white; border-radius: 16px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.08); overflow: hidden; }
                .profile-header { background: #1a1e21; color: white; padding: center; padding: 30px 20px; }
                .profile-avatar { width: 90px; height: 90px; border-radius: 50%; background: rgba(255,255,255,0.15);
                    display: flex; align-items: center; justify-content: center; margin: 0 auto 15px;
                    font-size: 2.8rem; border: 4px solid rgba(255,255,255,0.2); }
                .profile-body { padding: 35px 40px; }

                .btn-save { background: #0d6efd; border: none; padding: 12px 40px; border-radius: 50px;
                    font-weight: 600; transition: all 0.3s; }
                .btn-save:hover { background: #0b5ed7; transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(13,110,253,0.3); }

                @media (max-width: 991px) {
                    .sidebar { left: -250px; }
                    .sidebar.show { left: 0; }
                    .topbar { margin-left: 0; width: 100%; }
                    .content { margin-left: 0; padding: 90px 15px 30px; }
                }
            `}</style>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>
                <h4 className="text-center fw-bold mb-4">Helpdesk</h4>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/alltickets">All Tickets</Link>
                <Link href="/unassigned">Unassigned</Link>
                <Link href="/pending">Pending</Link>
                <Link href="/create">Create Ticket</Link>
                <Link href="/profile" className="active">My Profile</Link>
            </div>

            {/* Topbar */}
            <div className="topbar">
                <div className="d-flex align-items-center">
                    <span className="hamburger d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        Menu
                    </span>
                    <strong>My Profile</strong>
                </div>
                <div className="d-flex align-items-center">
                    <span className="fw-bold me-3">{fullName}</span>
                     <Dropdown>
            <Dropdown.Trigger>
                <button
                    type="button"
                    className="btn btn-link text-dark p-0 border-0"
                    style={{ background: "transparent", lineHeight: "1" }}
                >
                    <i className="bi bi-person-circle fs-3"></i>
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content align="right" width="220px">
                <div className="px-4 py-3 border-bottom text-center">
                    <div className="fw-bold">{user.name}</div>
                    <small className="text-muted">{user.email}</small>
                </div>
                <Dropdown.Link href="/profile">
                    My Profile
                </Dropdown.Link>
                <Dropdown.Link href="/logout" method="post" as="button" className="text-danger">
                    Logout
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
                </div>
            </div>

            {/* Main Content */}
            <div className="content">
                <div className="container-fluid">
                    <h2 className="mb-4 text-center">My Profile</h2>

                    {flash?.message && (
                        <div className="alert alert-success alert-dismissible fade show" dangerouslySetInnerHTML={{ __html: flash.message }} />
                    )}

                    {Object.keys(errors).length > 0 && (
                        <div className="alert alert-danger alert-dismissible fade show">
                            Please fix the errors below.
                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    )}

                    <div className="profile-card mx-auto">
                        <div className="profile-header text-center">
                            <div className="profile-avatar">
                                <i className="bi bi-person"></i>
                            </div>
                            <h3 className="profile-name">{fullName}</h3>
                            <p className="profile-role">Helpdesk User</p>
                        </div>

                        <div className="profile-body">
                            <form onSubmit={submit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">First Name</label>
                                        <input type="text" className="form-control" value={data.first_name}
                                            onChange={e => setData('first_name', e.target.value)} required />
                                        {errors.first_name && <div className="text-danger small mt-1">{errors.first_name}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Last Name</label>
                                        <input type="text" className="form-control" value={data.last_name}
                                            onChange={e => setData('last_name', e.target.value)} required />
                                        {errors.last_name && <div className="text-danger small mt-1">{errors.last_name}</div>}
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Email Address</label>
                                        <input type="email" className="form-control" value={data.email}
                                            onChange={e => setData('email', e.target.value)} required />
                                        {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">
                                            New Password <small className="text-muted">(leave blank to keep current)</small>
                                        </label>
                                        <input type="password" className="form-control" placeholder="••••••••"
                                            value={data.password} onChange={e => setData('password', e.target.value)} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Confirm New Password</label>
                                        <input type="password" className="form-control" placeholder="••••••••"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)} />
                                    </div>
                                </div>

                                <div className="text-center mt-4">
                                    <button type="submit" className="btn btn-save text-white" disabled={processing}>
                                        <i className="bi bi-check2-circle me-2"></i>
                                        {processing ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

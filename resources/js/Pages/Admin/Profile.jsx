import React from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function AdminProfile() {
    const { auth, flash } = usePage().props;
    const user = auth?.user || {};

    const fullName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : "Admin";
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        password: "",
        confirm_password: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("admin.profile.update"), {
            onSuccess: () => {
                reset("password", "confirm_password");
            },
        });
    };

    return (
        <>
            <Head title="My Profile - Admin Panel" />

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />

            <style>{`
                body { background: #f0f2f5; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; }
                .sidebar { width: 250px; height: 100vh; background: #1a1e21; position: fixed; top: 0; left: 0; color: white; padding-top: 20px; z-index: 1000; overflow-y: auto; }
                .sidebar h4 { text-align: center; margin-bottom: 30px; font-weight: bold; color: #0d6efd; }
                .sidebar a { padding: 14px 25px; display: block; color: #c9c9c9; font-size: 15px; text-decoration: none; border-left: 4px solid transparent; transition: all 0.3s; }
                .sidebar a:hover, .sidebar a.active { background: #2d3238; color: white; border-left-color: #0d6efd; }
                .sidebar .section-title { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 15px 25px 5px; font-weight: bold; }
                .topbar { height: 60px; background: #fff; margin-left: 250px; display: flex; align-items: center; justify-content: space-between; padding: 0 30px; border-bottom: 1px solid #dcdcdc; position: fixed; width: calc(100% - 250px); z-index: 999; }
                .content { margin-left: 260px; padding: 90px 30px 30px; }
                .profile-card { max-width: 650px; margin: 0 auto; background: white; border-radius: 16px; box-shadow: 0 8px 25px rgba(0,0,0,0.08); overflow: hidden; }
                .profile-header { background: #1a1e21; color: white; padding: 30px 20px; text-align: center; }
                .profile-avatar { width: 90px; height: 90px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 2.8rem; border: 4px solid rgba(255,255,255,0.2); }
                .profile-body { padding: 35px 40px; }
                .form-label { font-weight: 600; }
                .btn-save { background: #0d6efd; border: none; padding: 12px 40px; border-radius: 50px; color: white; font-weight: 600; }
                .btn-save:hover { background: #0b5ed7; }
                @media (max-width: 991px) { .sidebar { left: -250px; } .sidebar.show { left: 0; } .topbar, .content { margin-left: 0; } }
            `}</style>

            {/* SIDEBAR - 100% SAME */}
            <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>
                <h4><i className="bi bi-shield-lock"></i> Admin Panel</h4>

                <Link href="/admin/dashboard"><i className="bi bi-speedometer2 me-2"></i> Dashboard</Link>

                <div className="section-title">Ticket Management</div>
                <Link href="/admin/all-tickets"><i className="bi bi-ticket-detailed me-2"></i> All Tickets</Link>
                <Link href="/admin/assign-tickets" className="active"><i className="bi bi-person-check me-2"></i> Assign Tickets</Link>

                <div className="section-title">User Management</div>
                <Link href="/admin/users"><i className="bi bi-people me-2"></i> All Users</Link>
                <Link href="/admin/assignees"><i className="bi bi-person-badge me-2"></i> All Assignees</Link>
                <Link href="/admin/admins"><i className="bi bi-shield-shaded me-2"></i> Manage Administrator</Link>

                <div className="section-title">System</div>
                {/* <Link href="/admin/settings"><i className="bi bi-gear me-2"></i> Settings</Link> */}
                <Link href="/admin/activity-log"><i className="bi bi-clock-history me-2"></i> Activity Log</Link>
                <Link href="/admin/profile"><i className="bi bi-person me-2"></i> My Profile</Link>
                <Link href="/logout" className="text-danger"><i className="bi bi-box-arrow-right me-2"></i> Logout</Link>
            </div>


            {/* TOPBAR */}
            <div className="topbar">
                <div><strong>Admin / My Profile</strong></div>
                <div className="d-flex align-items-center">
                    <span className="fw-bold me-3 text-primary">{fullName} (Admin)</span>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button type="button" className="btn btn-link text-dark p-0">
                                <i className="bi bi-person-circle fs-3"></i>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right">
                            <div className="px-4 py-3 border-bottom text-center">
                                <div className="fw-bold">{fullName}</div>
                                <small className="text-muted">{user.email}</small>
                            </div>
                            <Dropdown.Link href="/admin/profile" className="active">My Profile</Dropdown.Link>
                            <Dropdown.Link href="/logout" method="post" as="button" className="text-danger">Logout</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="content">
                <h2 className="mb-4 text-center">My Profile</h2>

                {flash?.success && <div className="alert alert-success alert-dismissible fade show text-center">{flash.success}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}
                {flash?.error && <div className="alert alert-danger alert-dismissible fade show text-center">{flash.error}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}

                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <i className="bi bi-person"></i>
                        </div>
                        <h3>{fullName}</h3>
                        <p>System Administrator</p>
                    </div>

                    <div className="profile-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.first_name}
                                        onChange={(e) => setData("first_name", e.target.value)}
                                        required
                                    />
                                    {errors.first_name && <div className="text-danger small mt-1">{errors.first_name}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={data.last_name}
                                        onChange={(e) => setData("last_name", e.target.value)}
                                        required
                                    />
                                    {errors.last_name && <div className="text-danger small mt-1">{errors.last_name}</div>}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={data.email}
                                        onChange={(e) => setData("email", e.target.value)}
                                        required
                                    />
                                    {errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        placeholder="Leave blank to keep current"
                                    />
                                    {errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={data.confirm_password}
                                        onChange={(e) => setData("confirm_password", e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                    {errors.confirm_password && <div className="text-danger small mt-1">{errors.confirm_password}</div>}
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <button type="submit" className="btn btn-save" disabled={processing}>
                                    {processing ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

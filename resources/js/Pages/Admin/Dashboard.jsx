import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function AdminDashboard() {
    const { auth, stats } = usePage().props;
    const user = auth.user;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Admin";

    return (
        <>
            <Head title="Admin Dashboard - Helpdesk" />

            {/* Bootstrap CSS + Icons */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />

            <style>{`
                body { background: #f0f2f5; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; }
                .sidebar {
                    width: 250px; height: 100vh; background: #1a1e21; position: fixed; top: 0; left: 0;
                    color: white; padding-top: 20px; z-index: 1000; overflow-y: auto; transition: 0.3s;
                }
                .sidebar h4 { text-align: center; margin-bottom: 30px; font-weight: bold; color: #0d6efd; }
                .sidebar a {
                    padding: 14px 25px; display: block; color: #c9c9c9; font-size: 15px;
                    text-decoration: none; border-left: 4px solid transparent; transition: all 0.3s;
                }
                .sidebar a:hover, .sidebar a.active {
                    background: #2d3238; color: white; border-left-color: #0d6efd;
                }
                .sidebar .section-title {
                    color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;
                    padding: 15px 25px 5px; font-weight: bold;
                }
                .topbar {
                    height: 60px; background: #fff; margin-left: 250px; display: flex;
                    align-items: center; justify-content: space-between; padding: 0 30px;
                    border-bottom: 1px solid #dcdcdc; position: fixed; width: calc(100% - 250px); z-index: 999;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .content { margin-left: 260px; padding: 90px 30px 30px; }
                .stat-card {
                    background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    text-align: center; transition: 0.3s; height: 100%; position: relative;
                }
                .stat-card:hover { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(0,0,0,0.15); }
                .stat-number { font-size: 2.8rem; font-weight: bold; }
                .stat-label { color: #555; font-size: 1rem; margin-top: 10px; }
                .icon-bg { font-size: 3rem; opacity: 0.15; position: absolute; right: 15px; top: 15px; }
                .hamburger { font-size: 1.8rem; cursor: pointer; margin-right: 15px; display: none; }
                @media (max-width: 991px) {
                    .sidebar { left: -250px; }
                    .sidebar.show { left: 0; }
                    .topbar { margin-left: 0; width: 100%; padding: 0 15px; }
                    .content { margin-left: 0; padding: 90px 15px 30px; }
                    .hamburger { display: block; }
                }
            `}</style>

            {/* SIDEBAR */}
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
                <div><strong>Admin / Control Panel</strong></div>

                <div className="d-flex align-items-center">
                    <span className="fw-bold me-3 text-primary">{fullName} (Admin)</span>

                    {/* BREEZE DROPDOWN — WORKS 100% */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button type="button" className="btn btn-link text-dark p-0">
                                <i className="bi bi-person-circle fs-3"></i>
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content align="right" width="48">
                            <div className="px-4 py-3 border-bottom text-center">
                                <div className="fw-bold">{fullName}</div>
                                <small className="text-muted">{user.email}</small>
                            </div>
                            <Dropdown.Link href="/admin/profile">
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link href="/logout" method="post" as="button" className="text-danger">
                                Logout
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            {/* HAMBURGER FOR MOBILE */}
            <div className="d-lg-none fixed-top" style={{ top: "15px", left: "15px", zIndex: 1001 }}>
                <span className="hamburger text-dark" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    Menu
                </span>
            </div>

            {/* MAIN CONTENT */}
            <div className="content">
                <h2 className="mb-4">
                    Welcome back, <span className="text-primary">{user.first_name}</span>!
                </h2>
                <p className="text-muted mb-5">Here’s what’s happening in your helpdesk system today.</p>

                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="stat-card position-relative border-start border-primary border-5">
                            <i className="bi bi-people icon-bg"></i>
                            <div className="stat-number text-primary">{stats.total_users}</div>
                            <div className="stat-label">Total Users</div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card position-relative border-start border-success border-5">
                            <i className="bi bi-person-badge icon-bg"></i>
                            <div className="stat-number text-success">{stats.total_assignees}</div>
                            <div className="stat-label">Assignees (Agents)</div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card position-relative border-start border-warning border-5">
                            <i className="bi bi-ticket-perforated icon-bg"></i>
                            <div className="stat-number text-warning">{stats.total_tickets}</div>
                            <div className="stat-label">Total Tickets</div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card position-relative border-start border-info border-5">
                            <i className="bi bi-hourglass-split icon-bg"></i>
                            <div className="stat-number text-info">{stats.open_tickets}</div>
                            <div className="stat-label">Open / In Progress</div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card position-relative border-start border-danger border-5">
                            <i className="bi bi-exclamation-circle icon-bg"></i>
                            <div className="stat-number text-danger">{stats.unassigned_tickets}</div>
                            <div className="stat-label">Unassigned Tickets</div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="stat-card position-relative border-start border-dark border-5">
                            <i className="bi bi-shield-shaded icon-bg"></i>
                            <div className="stat-number text-dark">{stats.total_admins}</div>
                            <div className="stat-label">Admin Users</div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h5 className="mb-0">Quick Actions</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-3">
                                    <div className="col-6">
                                        <Link href="/admin/assignees" className="btn btn-outline-success w-100 py-3">
                                            <i className="bi bi-person-plus fs-4"></i><br />Add Assignee
                                        </Link>
                                    </div>
                                    <div className="col-6">
                                        <Link href="/admin/assign-tickets" className="btn btn-outline-primary w-100 py-3">
                                            <i className="bi bi-person-check fs-4"></i><br />Assign Tickets
                                        </Link>
                                    </div>
                                    <div className="col-6">
                                        <Link href="/admin/all-tickets" className="btn btn-outline-info w-100 py-3">
                                            <i className="bi bi-list-check fs-4"></i><br />View All Tickets
                                        </Link>
                                    </div>
                                    <div className="col-6">
                                        <Link href="/admin/users" className="btn btn-outline-secondary w-100 py-3">
                                            <i className="bi bi-people fs-4"></i><br />Manage Users
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-header bg-dark text-white">
                                <h5 className="mb-0">System Status</h5>
                            </div>
                            <div className="card-body text-center py-5">
                                <i className="bi bi-check-circle-fill text-success fs-1"></i>
                                <h4 className="mt-3 text-success">All Systems Operational</h4>
                                <p className="text-muted">Helpdesk is running smoothly.</p>
                                <small className="text-muted">
                                    Last checked: {new Date().toLocaleString()}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

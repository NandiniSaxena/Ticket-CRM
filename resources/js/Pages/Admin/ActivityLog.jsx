import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function ActivityLog() {
    const { auth, activities = [], flash } = usePage().props;
    const user = auth?.user || {};

    const fullName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : "Admin";

    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <>
            <Head title="Activity Log - Admin Panel" />

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

            <style>{`
                body { background: #f0f2f5; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; }
                .sidebar { width: 250px; height: 100vh; background: #1a1e21; position: fixed; top: 0; left: 0; color: white; padding-top: 20px; z-index: 1000; overflow-y: auto; }
                .sidebar h4 { text-align: center; margin-bottom: 30px; font-weight: bold; color: #0d6efd; }
                .sidebar a { padding: 14px 25px; display: block; color: #c9c9c9; font-size: 15px; text-decoration: none; border-left: 4px solid transparent; transition: all 0.3s; }
                .sidebar a:hover, .sidebar a.active { background: #2d3238; color: white; border-left-color: #0d6efd; }
                .sidebar .section-title { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 15px 25px 5px; font-weight: bold; }
                .topbar { height: 60px; background: #fff; margin-left: 250px; display: flex; align-items: center; justify-content: space-between; padding: 0 30px; border-bottom: 1px solid #dcdcdc; position: fixed; width: calc(100% - 250px); z-index: 999; }
                .content { margin-left: 260px; padding: 90px 30px 30px; }

                /* PERFECT TEXT WRAPPING IN ACTIVITY LOG */
                .activity-item {
                    padding: 18px 0;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                }
                .activity-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    flex-shrink: 0;
                }
                .activity-content {
                    flex: 1;
                    min-width: 0; /* Allows flex child to shrink properly */
                }
                .activity-text {
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                    white-space: pre-wrap;
                    line-height: 1.6;
                    font-size: 15px;
                    color: #333;
                }
                .activity-time {
                    display: block;
                    margin-top: 6px;
                    font-size: 13px;
                    color: #888;
                }

                @media (max-width: 991px) {
                    .sidebar { left: -250px; }
                    .sidebar.show { left: 0; }
                    .topbar, .content { margin-left: 0; }
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
                <Link href="/admin/activity-log"><i className="bi bi-clock-history me-2"></i> Activity Log</Link>
                <Link href="/admin/profile"><i className="bi bi-person me-2"></i> My Profile</Link>
                <Link href="/logout" className="text-danger"><i className="bi bi-box-arrow-right me-2"></i> Logout</Link>
            </div>

            {/* TOPBAR */}
            <div className="topbar">
                <div><strong>Admin / Activity Log</strong></div>
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
                            <Dropdown.Link href="/admin/profile">Profile</Dropdown.Link>
                            <Dropdown.Link href="/logout" method="post" as="button" className="text-danger">Logout</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="content">
                <h2 className="mb-4">Activity Log</h2>
                <p className="text-muted mb-5">Recent ticket creations, assignments, and status updates.</p>

                {flash?.success && <div className="alert alert-success alert-dismissible fade show">{flash.success}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}
                {flash?.error && <div className="alert alert-danger alert-dismissible fade show">{flash.error}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}

                <div className="card shadow-sm">
                    <div className="card-body">
                        {activities.length > 0 ? (
                            activities.map((act, index) => (
                                <div key={index} className="activity-item">
                                    <div className={`activity-icon ${act.color} text-white`}>
                                        <i className={`bi ${act.icon}`}></i>
                                    </div>
                                    <div className="activity-content">
                                        <div
                                            className="activity-text"
                                            dangerouslySetInnerHTML={{ __html: act.text }}
                                        />
                                        <small className="activity-time">
                                            {new Date(act.time).toLocaleDateString("en-US", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted py-5">No activity recorded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

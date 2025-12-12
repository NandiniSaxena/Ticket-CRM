import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Dashboard() {
    const { auth, stats, recentTickets } = usePage().props;

    const user = auth?.user || { name: "User", email: "user@example.com" };

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <>
            <Head title="Dashboard - Helpdesk" />

            {/* Bootstrap CSS */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
            />
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
            />

            <style>{`
                body {
                    background: #f0f2f5;
                    font-family: 'Segoe UI', Arial, sans-serif;
                }

                .sidebar {
                    width: 230px;
                    height: 100vh;
                    background: #1a1e21;
                    position: fixed;
                    top: 0;
                    left: 0;
                    color: white;
                    padding-top: 20px;
                    z-index: 1000;
                    transition: 0.3s;
                }

                .sidebar h4 {
                    text-align: center;
                    margin-bottom: 30px;
                    font-weight: bold;
                }

                .sidebar a {
                    padding: 14px 20px;
                    display: block;
                    color: #c9c9c9;
                    text-decoration: none;
                    border-left: 3px solid transparent;
                }
                .sidebar a:hover, .sidebar a.active {
                    background: #2d3238;
                    color: white;
                    border-left-color: #0d6efd;
                }

                .topbar {
                    height: 60px;
                    background: #fff;
                    margin-left: 230px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 25px;
                    border-bottom: 1px solid #dcdcdc;
                    position: fixed;
                    width: calc(100% - 230px);
                    z-index: 999;
                }

                .content {
                    margin-left: 240px;
                    padding: 90px 20px 30px;
                }

                .stat-card {
                    background: white;
                    border-radius: 12px;
                    padding: 22px;
                    height: 140px;
                    text-align: center;
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                }
                .stat-number { font-size: 2.3rem; font-weight: bold; }

                @media (max-width: 991px) {
                    .sidebar { left: -250px; }
                    .sidebar.show { left: 0; }
                    .topbar { margin-left: 0; width: 100%; }
                    .content { margin-left: 0; padding: 90px 15px; }
                    .hamburger { font-size: 1.8rem; cursor: pointer; margin-right: 15px; }
                }
            `}</style>

            {/* SIDEBAR */}
            <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>
                <h4>Helpdesk</h4>
                <Link href="/dashboard" className="active">Dashboard</Link>
                <Link href="/alltickets">All Tickets</Link>
                <Link href="/unassigned">Unassigned</Link>
                <Link href="/pending">Pending</Link>
                <Link href="/create">Create Ticket</Link>
                <Link href="/profile">My Profile</Link>
            </div>

            {/* TOPBAR */}
            <div className="topbar d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <span
                        className="hamburger d-lg-none"
                        role="button"
                        onClick={toggleSidebar}
                    >
                        ☰
                    </span>
                    <strong>Dashboard / Overview</strong>
                </div>

                <div className="d-flex align-items-center">
                    <span className="fw-bold me-3">{user.name}</span>

                    <div className="dropdown">
                        <button className="btn btn-link" data-bs-toggle="dropdown">
                            <i className="bi bi-person-circle fs-3 text-dark"></i>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                            <li className="dropdown-header text-center">
                                <strong>{user.name}</strong>
                                <br />
                                <small>{user.email}</small>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><Link className="dropdown-item" href="/profile">My Profile</Link></li>
                            <li>
                                <Link as="button" method="post" href="/logout" className="dropdown-item text-danger">
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="content">

                {/* ==== Stats Cards ==== */}
                <div className="row g-3 mb-4">
                    <div className="col-6 col-md-3">
                        <div className="stat-card border-start border-primary border-5">
                            <div className="stat-number text-primary">{stats?.total ?? 0}</div>
                            <div>Total Tickets</div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="stat-card border-start border-warning border-5">
                            <div className="stat-number text-warning">{stats?.open ?? 0}</div>
                            <div>Open / In Progress</div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="stat-card border-start border-success border-5">
                            <div className="stat-number text-success">{stats?.completed ?? 0}</div>
                            <div>Completed</div>
                        </div>
                    </div>

                    <div className="col-6 col-md-3">
                        <div className="stat-card border-start border-danger border-5">
                            <div className="stat-number text-danger">{stats?.pending ?? 0}</div>
                            <div>Pending</div>
                        </div>
                    </div>
                </div>

                {/* ==== Recent Tickets Table ==== */}
                <div className="card shadow-sm">
                    <div className="card-header bg-white">
                        <h5 className="mb-0">Recent Tickets</h5>
                    </div>

                    <div className="card-body p-0">
                        {recentTickets.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>S.No</th>
                                            <th>Subject</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Priority</th>
                                            <th>Team</th>
                                            <th>Created</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {recentTickets.map((t, index) => {
                                            const statusBadge =
                                                t.status === "completed"
                                                    ? "bg-success"
                                                    : t.status === "pending"
                                                    ? "bg-warning text-dark"
                                                    : t.status === "onhold"
                                                    ? "bg-secondary"
                                                    : "bg-primary";

                                            const statusText =
                                                t.status === "inprogress"
                                                    ? "In Progress"
                                                    : t.status === "onhold"
                                                    ? "On Hold"
                                                    : t.status.charAt(0).toUpperCase() + t.status.slice(1);

                                            return (
                                                <tr key={t.id}>
                                                    <td><strong>{index + 1}</strong></td>
                                                    <td style={{ maxWidth: "200px" }}>{t.subject}</td>
                                                    <td style={{ maxWidth: "300px", whiteSpace: "pre-wrap" }}>
                                                        {t.description}
                                                    </td>
                                                    <td>
                                                        <span className={`badge rounded-pill ${statusBadge}`}>
                                                            {statusText}
                                                        </span>
                                                    </td>
                                                    <td className={`text-${
                                                        t.priority === "high"
                                                            ? "danger"
                                                            : t.priority === "medium"
                                                            ? "warning"
                                                            : "success"
                                                    }`}>
                                                        {t.priority}
                                                    </td>
                                                    <td>{t.team || "Not Set"}</td>
                                                    <td>{formatDate(t.created_at)}</td>

                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            data-bs-toggle="modal"
                                                            data-bs-target={`#ticketModal${t.id}`}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-inbox fs-1"></i>
                                <h5>No tickets yet</h5>
                                <Link href="/create" className="btn btn-primary mt-3">
                                    Create Your First Ticket
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* ==== MODALS ==== */}
                {recentTickets.map((t) => {
                    const statusBadge =
                        t.status === "completed"
                            ? "bg-success"
                            : t.status === "pending"
                            ? "bg-warning text-dark"
                            : t.status === "onhold"
                            ? "bg-secondary"
                            : "bg-primary";

                    const statusText =
                        t.status === "inprogress"
                            ? "In Progress"
                            : t.status === "onhold"
                            ? "On Hold"
                            : t.status.charAt(0).toUpperCase() + t.status.slice(1);

                    return (
                        <div key={t.id}>
                            <div className="modal fade" id={`ticketModal${t.id}`} tabIndex="-1">
                                <div className="modal-dialog modal-lg">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">
                                                <i className="bi bi-ticket-perforated"></i> Ticket #{t.id} - {t.subject}
                                            </h5>
                                            <button className="btn-close" data-bs-dismiss="modal"></button>
                                        </div>

                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <h6><strong>Full Description</strong></h6>
                                                    <div className="bg-light p-4 rounded" style={{ whiteSpace: "pre-wrap" }}>
                                                        {t.description}
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="p-3 border rounded shadow-sm">
                                                        <p><strong>Status:</strong> <span className={`badge ${statusBadge}`}>{statusText}</span></p>
                                                        <p><strong>Priority:</strong> {t.priority}</p>
                                                        <p><strong>Team:</strong> {t.team || "Not Set"}</p>
                                                        <p><strong>Created:</strong> {formatDate(t.created_at)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <Link href="/alltickets" className="btn btn-primary">Open All Tickets</Link>
                                            <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bootstrap JS */}
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </>
    );
}

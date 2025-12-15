import React, { useEffect, useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Unassigned() {
    const { auth, tickets } = usePage().props;
    const user = auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "User";

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);


    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <>
            <Head title="Unassigned Tickets" />

            
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />

            <style>{`
                body { background: #f0f2f5; font-family: 'Segoe UI', Arial, sans-serif; }

                .sidebar {
                    width: 230px; height: 100vh; background: #1a1e21; position: fixed;
                    top: 0; left: 0; color: white; padding-top: 20px; z-index: 1000; transition: 0.3s;
                }
                .sidebar h4 { text-align: center; margin-bottom: 30px; font-weight: bold; }
                .sidebar a {
                    padding: 14px 20px; display: block; color: #c9c9c9; font-size: 15px;
                    text-decoration: none; border-left: 3px solid transparent;
                }
                .sidebar a:hover, .sidebar a.active {
                    background: #2d3238; color: white; border-left-color: #0d6efd;
                }

                .topbar {
                    height: 60px; background: #fff; margin-left: 230px; display: flex;
                    align-items: center; justify-content: space-between; padding: 0 25px;
                    border-bottom: 1px solid #dcdcdc; position: fixed; width: calc(100% - 230px); z-index: 999;
                }

                .content { margin-left: 240px; padding: 90px 30px 30px; }

                .subject-col { max-width: 200px; word-wrap: break-word; }
                .desc-col { max-width: 300px; word-wrap: break-word; }

                .modal-description-box {
                    max-height: 300px; overflow-y: auto; background: #f8f9fa;
                    padding: 15px; border-radius: 8px; word-wrap: break-word;
                }

                @media (max-width: 991px) {
                    .sidebar { left: -250px; }
                    .sidebar.show { left: 0; }
                    .topbar { margin-left: 0; width: 100%; padding: 0 15px; }
                    .content { margin-left: 0; padding: 90px 15px; }
                    .hamburger { font-size: 1.8rem; cursor: pointer; margin-right: 15px; }
                }
            `}</style>

            {/* SIDEBAR */}
            <div className={`sidebar ${sidebarOpen ? "show" : ""}`} id="sidebar">
                <h4>Helpdesk</h4>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/alltickets">All Tickets</Link>
                <Link href="/unassigned" className="active">Unassigned</Link>
                <Link href="/pending">Pending</Link>
                <Link href="/create">Create Ticket</Link>
                <Link href="/profile">My Profile</Link>
            </div>

            {/* TOPBAR */}
            <div className="topbar">
                <div className="d-flex align-items-center">
                    <span className="hamburger d-lg-none" onClick={toggleSidebar}>&#9776;</span>
                    <strong>Unassigned Tickets</strong>
                </div>
                <div className="d-flex align-items-center">
                    <span className="fw-bold me-3">{fullName}</span>
                    <div className="dropdown">
                        <button className="btn btn-link text-dark p-0" data-bs-toggle="dropdown">
                            <i className="bi bi-person-circle fs-3"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li className="dropdown-header text-center">
                                <div className="fw-bold">{fullName}</div>
                                <small>{user.email}</small>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><Link href="/profile" className="dropdown-item">My Profile</Link></li>
                            <li><Link href="/logout" method="post" className="dropdown-item text-danger">Logout</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="content">
                <h2 className="mb-4">My Unassigned Tickets ({tickets.length})</h2>

                {tickets.length > 0 ? (
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>S.No</th>
                                            <th>Subject</th>
                                            <th>Description</th>
                                            <th>Priority</th>
                                            <th>Team</th>
                                            <th>Created</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map((t, i) => (
                                            <tr key={t.id}>
                                                <td><strong>{i + 1}</strong></td>
                                                <td className="subject-col">{t.subject}</td>
                                                <td className="desc-col">
                                                    {t.description.length > 200
                                                        ? t.description.substring(0, 200) + "..."
                                                        : t.description}
                                                </td>

                                                <td>
                                                    <span className={`text-${
                                                        t.priority === "high"
                                                            ? "danger"
                                                            : t.priority === "medium"
                                                            ? "warning"
                                                            : "success"
                                                    }`}>
                                                        {t.priority}
                                                    </span>
                                                </td>

                                                <td>{t.team}</td>
                                                <td>{new Date(t.created_at).toLocaleDateString()}</td>

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
                                        ))}

                                        {tickets.map((t) => (
                                            <div className="modal fade" id={`ticketModal${t.id}`} tabIndex="-1" key={`modal-${t.id}`}>
                                                <div className="modal-dialog modal-lg">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title">
                                                                <i className="bi bi-ticket-perforated"></i>
                                                                &nbsp; Ticket #{t.id} - {t.subject}
                                                            </h5>
                                                            <button className="btn-close" data-bs-dismiss="modal"></button>
                                                        </div>

                                                        <div className="modal-body">
                                                            <div className="row">
                                                                <div className="col-md-8">
                                                                    <h6><strong>Full Description</strong></h6>
                                                                    <div className="modal-description-box">
                                                                        {t.description}
                                                                    </div>
                                                                </div>

                                                                <div className="col-md-4">
                                                                    <div className="bg-white p-3 border rounded shadow-sm">
                                                                        <p><strong>Status:</strong> <span className="badge bg-secondary">Unassigned</span></p>
                                                                        <p>
                                                                            <strong>Priority:</strong>
                                                                            <span className={`text-${
                                                                                t.priority === "high"
                                                                                    ? "danger"
                                                                                    : t.priority === "medium"
                                                                                    ? "warning"
                                                                                    : "success"
                                                                            }`}> {t.priority}</span>
                                                                        </p>
                                                                        <p><strong>Team:</strong> {t.team}</p>
                                                                        <p><strong>Created:</strong> {new Date(t.created_at).toLocaleString()}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="modal-footer">
                                                            <Link href="/alltickets" className="btn btn-primary">View All Tickets</Link>
                                                            <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <i className="bi bi-check2-all text-success fs-1"></i>
                        <h4 className="mt-3 text-success">All your tickets are assigned!</h4>
                        <p className="text-muted">Great job staying on top of things!</p>
                    </div>
                )}
            </div>
        </>
    );
}

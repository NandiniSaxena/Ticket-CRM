import React, { useState, useEffect } from "react";
import { Head, Link, usePage, useForm, router } from "@inertiajs/react";

export default function Pending() {
    const { tickets, auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "User";
    const email = user?.email || "user@example.com";

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); // e.g., 11 Dec 2025
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }).replace(",", " at");
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
        <><Head title="All Tickets - Helpdesk" />

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
            <div>
                {/* Inline Styles */}
                <style jsx>{`
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
                    .sidebar a {
                        padding: 14px 20px;
                        display: block;
                        color: #c9c9c9;
                        font-size: 15px;
                        text-decoration: none;
                        border-left: 3px solid transparent;
                    }
                    .sidebar a:hover,
                    .sidebar a.active {
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
                        padding: 90px 30px 30px;
                    }

                    .hamburger {
                        font-size: 2rem;
                        cursor: pointer;
                        margin-right: 15px;
                    }

                    .subject-wrap,
                    .desc-wrap,
                    .modal-title-wrap,
                    .modal-description {
                        white-space: normal !important;
                        word-wrap: break-word !important;
                        overflow-wrap: break-word !important;
                    }

                    .subject-wrap {
                        max-width: 200px;
                    }

                    .desc-wrap {
                        max-width: 300px;
                    }

                    .modal-title-wrap {
                        max-width: 90%;
                        display: inline-block;
                    }

                    @media (max-width: 991.98px) {
                        .sidebar {
                            left: -250px;
                        }
                        .sidebar.show {
                            left: 0;
                        }
                        .topbar {
                            margin-left: 0;
                            width: 100%;
                        }
                        .content {
                            margin-left: 0;
                            padding: 90px 15px 30px;
                        }
                        body,
                        .content,
                        .table,
                        .table td,
                        .table th {
                            font-size: 17px !important;
                        }
                        .table td,
                        .table th {
                            padding: 14px !important;
                        }
                        h2 {
                            font-size: 24px;
                        }
                        .modal-body {
                            font-size: 16px !important;
                        }
                    }

                    @media (max-width: 576px) {
                        .table-responsive {
                            overflow-x: auto;
                        }
                    }
                `}</style>

                {/* SIDEBAR */}
                <div className={`sidebar ${sidebarOpen ? "show" : ""}`} id="sidebar">
                    <h4 className="text-center fw-bold mb-4">Helpdesk</h4>
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/alltickets">All Tickets</Link>
                    <Link href="/unassigned">Unassigned</Link>
                    <Link href="/pending" className="active">
                        Pending
                    </Link>
                    <Link href="/create">Create Ticket</Link>
                    <Link href="/profile">My Profile</Link>
                </div>

                {/* TOPBAR */}
                <div className="topbar d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <span
                            className="hamburger d-lg-none"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            ☰
                        </span>
                        <strong>Pending Tickets</strong>
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
                            <li><hr className="dropdown-divider"/></li>
                            <li><Link href="/profile" className="dropdown-item">My Profile</Link></li>
                            <li><Link method="post" href="/logout" as="button" className="dropdown-item text-danger">Logout</Link></li>
                        </ul>
                    </div>
                </div>
                </div>



                {/* CONTENT */}
                <div className="content">
                    <h2 className="mb-4">My Pending Tickets ({tickets.length})</h2>

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
                                            {tickets.map((t, index) => (
                                                <tr key={t.id}>
                                                    <td>
                                                        <strong>{index + 1}</strong>
                                                    </td>
                                                    <td className="subject-wrap">{t.subject}</td>
                                                    <td className="desc-wrap">
                                                        {t.description.substring(0, 150)}
                                                        {t.description.length > 150 ? "..." : ""}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`text-${
                                                                t.priority === "high"
                                                                    ? "danger"
                                                                    : t.priority === "medium"
                                                                    ? "warning"
                                                                    : "success"
                                                            }`}
                                                        >
                                                            {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td>{t.team || "-"}</td>
                                                    <td>{formatDate(t.created_at)}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            data-bs-toggle="modal"
                                                            data-bs-target={`#ticketModal${t.id}`}
                                                        >
                                                            View
                                                            View
                                                        </button>
                                                    </td>

                                                    {/* Modal - Exact Same */}
                                                    <div
                                                        className="modal fade"
                                                        id={`ticketModal${t.id}`}
                                                        tabIndex="-1"
                                                        aria-hidden="true"
                                                    >
                                                        <div className="modal-dialog modal-lg">
                                                            <div className="modal-content">
                                                                <div className="modal-header">
                                                                    <h5 className="modal-title modal-title-wrap">
                                                                        <i className="bi bi-ticket-perforated"></i>
                                                                        &nbsp; Ticket #{t.id} - {t.subject}
                                                                    </h5>
                                                                    <button
                                                                        type="button"
                                                                        className="btn-close"
                                                                        data-bs-dismiss="modal"
                                                                        aria-label="Close"
                                                                    ></button>
                                                                </div>

                                                                <div className="modal-body">
                                                                    <div className="row">
                                                                        <div className="col-md-8">
                                                                            <h6>
                                                                                <strong>Description</strong>
                                                                            </h6>
                                                                            <div className="bg-light p-3 rounded modal-description">
                                                                                {t.description ? (
                                                                                    t.description.split("\n").map((line, i) => (
                                                                                        <span key={i}>
                                                                                            {line}
                                                                                            <br />
                                                                                        </span>
                                                                                    ))
                                                                                ) : (
                                                                                    "No description provided."
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-4 mt-3 mt-md-0">
                                                                            <div className="bg-white p-3 border rounded shadow-sm">
                                                                                <p>
                                                                                    <strong>Status:</strong>{" "}
                                                                                    <span className="badge bg-warning">
                                                                                        Pending
                                                                                    </span>
                                                                                </p>
                                                                                <p>
                                                                                    <strong>Priority:</strong>{" "}
                                                                                    {t.priority.charAt(0).toUpperCase() +
                                                                                        t.priority.slice(1)}
                                                                                </p>
                                                                                <p>
                                                                                    <strong>Team:</strong> {t.team || "-"}
                                                                                </p>
                                                                                <p>
                                                                                    <strong>Created:</strong>{" "}
                                                                                    {formatDateTime(t.created_at)}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="modal-footer">
                                                                    <Link
                                                                        href="/alltickets"
                                                                        className="btn btn-primary"
                                                                    >
                                                                        View All Tickets
                                                                    </Link>
                                                                    <button
                                                                        className="btn btn-secondary"
                                                                        data-bs-dismiss="modal"
                                                                    >
                                                                        Close
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="bi bi-check2-all text-success fs-1"></i>
                            <h4 className="mt-3 text-success">No pending tickets!</h4>
                            <p className="text-muted">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function Pending() {
    const { auth, tickets, stats, recentTickets, flash } = usePage().props;
    const user = auth?.user || {};

    const fullName = `${user.first_name} ${user.last_name}`;

    const [showModal, setShowModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const openTicketModal = (ticket) => {
        setSelectedTicket(ticket);
        setShowModal(true);
    };

    return (
        <>
            <Head title="Pending Tickets - Agent Panel" />

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

            <style>{`
                body { background: #f0f2f5; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; }
                .sidebar { width: 250px; height: 100vh; background: #1a1e21; position: fixed; top: 0; left: 0; color: white; padding-top: 20px; z-index: 1000; overflow-y: auto; }
                .sidebar h4 { text-align: center; margin-bottom: 30px; font-weight: bold; color: #28a745; }
                .sidebar a { padding: 14px 25px; display: block; color: #c9c9c9; font-size: 15px; text-decoration: none; border-left: 4px solid transparent; transition: all 0.3s; }
                .sidebar a:hover, .sidebar a.active { background: #2d3238; color: white; border-left-color: #28a745; }
                .topbar { height: 60px; background: #fff; margin-left: 250px; display: flex; align-items: center; justify-content: space-between; padding: 0 30px; border-bottom: 1px solid #dcdcdc; position: fixed; width: calc(100% - 250px); z-index: 999; }
                .content { margin-left: 260px; padding: 90px 30px 30px; }
                .wrap-100 { max-width: 120px; word-wrap: break-word; white-space: normal; }
                .wrap-200 { max-width: 250px; word-wrap: break-word; white-space: normal; }
                @media (max-width: 991px) {
                    .sidebar { left: -250px; }
                    .sidebar.show { left: 0; }
                    .topbar, .content { margin-left: 0; }
                }
            `}</style>

            {/* SIDEBAR */}
            <div className="sidebar">
                <h4>Agent Panel</h4>
                <Link href="/assignee/dashboard" className="active">Dashboard</Link>
                <Link href="/assignee/my-tickets">All My Tickets (<span>{stats.total}</span>)</Link>
                <Link href="/assignee/inprogress">In Progress (<span>{stats.inprogress}</span>)</Link>
                <Link href="/assignee/pending">Pending (<span>{stats.pending}</span>)</Link>
                <Link href="/assignee/onhold">On Hold (<span>{stats.onhold}</span>)</Link>
                <Link href="/assignee/completed">Completed (<span>{stats.completed}</span>)</Link>
                <Link href="/logout" className="text-warning">Logout</Link>
            </div>

            {/* TOPBAR */}
            <div className="topbar">
                <div><strong>Agent / Pending Tickets</strong></div>
                <div className="d-flex align-items-center">
                    <span className="fw-bold me-3 text-success">{fullName} (Agent)</span>
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
                            <Dropdown.Link href="/assignee/profile">Profile</Dropdown.Link>
                            <Dropdown.Link href="/logout" method="post" as="button" className="text-warning">Logout</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="content">
                <h2 className="mb-4">Pending Tickets ({tickets.length})</h2>

                {flash?.success && <div className="alert alert-success alert-dismissible fade show">{flash.success}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}

                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        {tickets.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>S.No</th>
                                            <th>Subject</th>
                                            <th>Description</th>
                                            <th>Requester</th>
                                            <th>Priority</th>
                                            <th>Created</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map((t, i) => (
                                            <tr key={t.id}>
                                                <td><strong>{i + 1}</strong></td>
                                                <td className="wrap-100">{t.subject}</td>
                                                <td className="wrap-200">
                                                    {t.description.substring(0, 200)}{t.description.length > 200 && "..."}
                                                </td>
                                                <td>{t.req_first} {t.req_last}</td>
                                                <td>
                                                    <span className={`badge bg-${t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'secondary'}`}>
                                                        {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                                                    </span>
                                                </td>
                                                <td>{new Date(t.created_at).toLocaleDateString('en-GB')}</td>
                                                <td>
                                                    <button
                                                        onClick={() => openTicketModal(t)}
                                                        className="btn btn-sm btn-success"
                                                    >
                                                        Open
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <p>No pending tickets.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* TICKET MODAL */}
            {showModal && selectedTicket && (
                <div className="modal fade show" style={{display: "block", backgroundColor: "rgba(0,0,0,0.5)"}} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header text-white" style={{background: "linear-gradient(135deg, #667eea, #764ba2)"}}>
                                <div className="w-100 text-center">
                                    <h5 className="modal-title mb-2">
                                        <strong>Ticket #{selectedTicket.id}</strong>
                                    </h5>
                                    <div style={{fontSize: "1.1rem", fontWeight: "500", wordWrap: "break-word", maxWidth: "90%", margin: "0 auto"}}>
                                        {selectedTicket.subject}
                                    </div>
                                </div>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}
                                    style={{position: "absolute", right: "20px", top: "20px"}}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <p><strong>Requester:</strong> {selectedTicket.req_first} {selectedTicket.req_last}</p>
                                        <p><strong>Created:</strong> {new Date(selectedTicket.created_at).toLocaleDateString('en-GB')}</p>
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <p><strong>Priority:</strong>
                                            <span className={`badge bg-${selectedTicket.priority === 'high' ? 'danger' : selectedTicket.priority === 'medium' ? 'warning' : 'secondary'} ms-2`}>
                                                {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                                            </span>
                                        </p>
                                        <p><strong>Status:</strong>
                                            <span className="badge bg-warning text-dark ms-2">Pending</span>
                                        </p>
                                    </div>
                                </div>
                                <hr />
                                <h6>Description</h6>
                                <div className="bg-light p-4 rounded border"
                                    style={{
                                        minHeight: "150px",
                                        lineHeight: "1.8",
                                        whiteSpace: "pre-wrap",
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word"
                                    }}
                                >
                                    {selectedTicket.description || <em className="text-muted">No description provided.</em>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

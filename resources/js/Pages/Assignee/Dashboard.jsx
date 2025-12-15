import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function AssigneeDashboard() {
    const { auth, stats, recentTickets, flash } = usePage().props;
    const user = auth?.user || {};

    const fullName = `${user.first_name} ${user.last_name}`;

    const [showModal, setShowModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const tickets = recentTickets || [];
    const totalTickets = tickets.length;
    const totalPages = Math.ceil(totalTickets / perPage);
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const currentTickets = tickets.slice(startIndex, endIndex);

    const handleStatusChange = (ticketId, newStatus) => {
        if (!newStatus) return;

        router.post(
            route("assignee.tickets.updateStatus", ticketId),
            { status: newStatus },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const openTicketModal = (ticket) => {
        setSelectedTicket(ticket);
        setShowModal(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed": return "bg-success";
            case "onhold": return "bg-secondary";
            case "pending": return "bg-warning text-dark";
            default: return "bg-primary";
        }
    };

    const getStatusText = (status) => {
        return status === "inprogress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <>
            <Head title="Agent Dashboard" />

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
                .stat-card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center; transition: all 0.4s; height: 100%; }
                .stat-card:hover { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(0,0,0,0.15); }
                .stat-number { font-size: 2.8rem; font-weight: bold; }
                .btn-open { background: linear-gradient(135deg, #667eea, #764ba2); border: none; color: white; }
                .btn-open:hover { background: linear-gradient(135deg, #764ba2, #667eea); }
                .pagination .page-link { color: #28a745; }
                .pagination .page-item.active .page-link { background: #28a745; border-color: #28a745; }
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

            {/* TOPBAR*/}
            <div className="topbar">
                <div><strong>Agent / My Workspace</strong></div>
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
                <h2 className="mb-4">Welcome back, <span className="text-success">{user.first_name}!</span></h2>

                {flash?.success && <div className="alert alert-success alert-dismissible fade show">{flash.success}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}

                {/* STATS */}
                <div className="row g-4 mb-5">
                    <div className="col-md-3"><div className="stat-card border-start border-primary border-5"><div className="stat-number text-primary">{stats.total}</div><div className="stat-label">Total Assigned</div></div></div>
                    <div className="col-md-3"><div className="stat-card border-start border-warning border-5"><div className="stat-number text-warning">{stats.inprogress}</div><div className="stat-label">In Progress</div></div></div>
                    <div className="col-md-3"><div className="stat-card border-start border-secondary border-5"><div className="stat-number text-secondary">{stats.waiting}</div><div className="stat-label">Waiting</div></div></div>
                    <div className="col-md-3"><div className="stat-card border-start border-success border-5"><div className="stat-number text-success">{stats.completed}</div><div className="stat-label">Completed</div></div></div>
                </div>

                {/* TICKETS TABLE WITH PAGINATION */}
                <div className="card shadow-sm">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">My Tickets ({totalTickets})</h5>
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-muted small">Show</span>
                            <select
                                className="form-select form-select-sm"
                                style={{width: '80px'}}
                                value={perPage}
                                onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span className="text-muted small">entries</span>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        {currentTickets.length > 0 ? (
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>S.No</th>
                                        <th>Ticket</th>
                                        <th>Description</th>
                                        <th>Requester</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th>Quick Update</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTickets.map((t, i) => (
                                        <tr key={t.id}>
                                            <td><strong>{String(startIndex + i + 1).padStart(3, '0')}</strong></td>
                                            <td style={{maxWidth: '120px', wordWrap: 'break-word'}}>{t.subject}</td>
                                            <td style={{maxWidth: '200px', wordWrap: 'break-word'}}>
                                                {t.description.substring(0, 100)}{t.description.length > 100 && '...'}
                                            </td>
                                            <td>{t.req_first} {t.req_last}</td>
                                            <td>
                                                <span className={`badge bg-${t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'secondary'}`}>
                                                    {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusColor(t.status)}`}>
                                                    {getStatusText(t.status)}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    className="form-select form-select-sm"
                                                    value={t.status}
                                                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                                >
                                                    <option value="">Change...</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="inprogress">In Progress</option>
                                                    <option value="onhold">On Hold</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button onClick={() => openTicketModal(t)} className="btn btn-sm btn-open">
                                                    Open
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <p>No tickets assigned yet.</p>
                            </div>
                        )}
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                            <div className="text-muted small">
                                Showing {startIndex + 1} to {Math.min(endIndex, totalTickets)} of {totalTickets} entries
                            </div>
                            <nav>
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                                    </li>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>




        </>
    );
}

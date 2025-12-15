import React, { useState, useEffect } from "react";
import { Head, Link, usePage, useForm, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function AllTickets() {
    const { auth, tickets: initialTickets, flash } = usePage().props;
    const teams = ["Support", "Technical", "Billing", "Sales"]; // teams from controller
    const user = auth?.user || {};
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tickets, setTickets] = useState(initialTickets || []);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "User";

    // Form for editing ticket
    const { data, setData, patch, processing, errors, reset } = useForm({
        subject: "",
        description: "",
        priority: "medium",
        team: "Support",
    });

    const openEditModal = (ticket) => {
        setSelectedTicket(ticket);
        setData({
            subject: ticket.subject,
            description: ticket.description,
            priority: ticket.priority || "medium",
            team: ticket.team || "Support",
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();

        patch(route("ticket.update", selectedTicket.id), {
            preserveScroll: true,
            onSuccess: () => {
                setTickets(tickets.map(t =>
                    t.id === selectedTicket.id ? { ...t, ...data } : t
                ));

                // Close modal
                const modal = document.getElementById(`editModal${selectedTicket.id}`);
                const bsModal = bootstrap.Modal.getInstance(modal);
                bsModal?.hide();

                reset();
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this ticket permanently?")) return;

        router.delete(route("ticket.delete", id), {
            preserveScroll: true,
            onSuccess: () => {
                setTickets(tickets.filter(t => t.id !== id));
            }
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
            <Head title="All Tickets - Helpdesk" />

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />

            <style>{`
                body { background: #f0f2f5; font-family: 'Segoe UI', Arial, sans-serif; }
                .sidebar { width: 230px; height: 100vh; background: #1a1e21; position: fixed; top: 0; left: 0;
                    color: white; padding-top: 20px; z-index: 1000; transition: 0.3s; }
                .sidebar a { padding: 14px 20px; display: block; color: #c9c9c9; font-size: 15px;
                    text-decoration: none; border-left: 3px solid transparent; }
                .sidebar a:hover, .sidebar a.active { background: #2d3238; color: white; border-left-color: #0d6efd; }
                .topbar { height: 60px; background: #fff; margin-left: 230px; display: flex;
                    align-items: center; justify-content: space-between; padding: 0 25px;
                    border-bottom: 1px solid #dcdcdc; position: fixed; width: calc(100% - 230px); z-index: 999; }
                .content { margin-left: 240px; padding: 90px 30px 30px; }
                .status-btn { padding: 6px 16px; border-radius: 50px; font-size: 13px; font-weight: 600; }
                .status-pending    { background: #fff3cd; color: #856404; }
                .status-inprogress { background: #d1ecf1; color: #0c5460; }
                .status-completed  { background: #d4edda; color: #155724; }
                .status-onhold     { background: #f8d7da; color: #721c24; }
                .subject-col { max-width: 220px; white-space: normal; word-wrap: break-word; }
                .desc-col { max-width: 300px; white-space: normal; word-wrap: break-word; }
                @media (max-width: 991px) {
                    .sidebar { left: -250px; }
                    .sidebar.show { left: 0; }
                    .topbar { margin-left: 0; width: 100%; }
                    .content { margin-left: 0; padding: 90px 15px 15px; }
                }
            `}</style>

            {/* SIDEBAR & TOPBAR  */}
            <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>
                <h4 className="text-center fw-bold mb-4">Helpdesk</h4>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/alltickets" className="active">All Tickets</Link>
                <Link href="/unassigned">Unassigned</Link>
                <Link href="/pending">Pending</Link>
                <Link href="/create">Create Ticket</Link>
                <Link href="/profile">My Profile</Link>
            </div>

            <div className="topbar">
                <div className="d-flex align-items-center">
                    <span className="hamburger d-lg-none" onClick={() => setSidebarOpen(!sidebarOpen)}>Menu</span>
                    <strong>All Tickets</strong>
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


            <div className="content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3>All Support Tickets</h3>
                    <Link href="/create" className="btn btn-primary">New Ticket</Link>
                </div>

                {flash?.success && <div className="alert alert-success">{flash.success}</div>}
                {flash?.error && <div className="alert alert-danger">{flash.error}</div>}

                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        {tickets.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>S.No</th>
                                            <th>Subject</th>
                                            <th>Description</th>
                                            <th>Priority</th>
                                            <th>Team</th>
                                            <th>Status</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.map((ticket, idx) => (
                                            <tr key={ticket.id}>
                                                <td><strong>{idx + 1}</strong></td>
                                                <td className="subject-col">{ticket.subject}</td>
                                                <td className="desc-col">
                                                    {ticket.description.substring(0, 100)}{ticket.description.length > 100 && "..."}
                                                </td>
                                                <td>
                                                    <span className={`text-${ticket.priority === 'high' ? 'danger' : ticket.priority === 'medium' ? 'warning' : 'success'} fw-bold`}>
                                                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                                                    </span>
                                                </td>
                                                <td>{ticket.team}</td>
                                                <td>
                                                    <span className={`status-btn status-${ticket.status}`}>
                                                        {ticket.status === 'inprogress' ? 'In Progress' :
                                                         ticket.status === 'onhold' ? 'On Hold' :
                                                         ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-1"
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#editModal${ticket.id}`}
                                                        onClick={() => openEditModal(ticket)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(ticket.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-5">
                                <i className="bi bi-inbox fs-1 text-muted"></i>
                                <h5>No tickets found</h5>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Modal */}
                {selectedTicket && (
                    <div className="modal fade" id={`editModal${selectedTicket.id}`} tabIndex="-1">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <form onSubmit={handleUpdate}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Ticket #{selectedTicket.id}</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Subject</label>
                                            <input type="text" className="form-control" value={data.subject} onChange={e => setData('subject', e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Description</label>
                                            <textarea className="form-control" rows="5" value={data.description} onChange={e => setData('description', e.target.value)} required />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Priority</label>
                                                <select className="form-select" value={data.priority} onChange={e => setData('priority', e.target.value)}>
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Team</label>
                                               <select className="form-select" value={data.team} onChange={e => setData('team', e.target.value)}>
                                                    <option value="Support">Support</option>
                                                    <option value="Technical">Technical</option>
                                                    <option value="Billing">Billing</option>
                                                    <option value="Sales">Sales</option>
                                                </select>
                                            </div>
                                        </div>
                                        {/* Status is READ-ONLY for users */}
                                        <div className="mb-3">
                                            <label className="form-label">Status</label>
                                            <input type="text" className="form-control" value={selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)} disabled />
                                            <small className="text-muted">Status can only be changed by support team.</small>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                            {processing ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

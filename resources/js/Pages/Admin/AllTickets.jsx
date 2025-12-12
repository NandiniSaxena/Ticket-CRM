// resources/js/Pages/Admin/AllTickets.jsx
import React, { useState } from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function AdminAllTickets() {
    const { auth, tickets: initialTickets, flash } = usePage().props;
    const user = auth.user;

    const [tickets, setTickets] = useState(initialTickets || []);
    const [search, setSearch] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Admin";

    // Create Ticket
    const createForm = useForm({
        subject: "",
        description: "",
        priority: "medium",
        team: "",
    });

    // Edit Ticket
    const [editTicket, setEditTicket] = useState(null);
    const editForm = useForm({
        subject: "",
        description: "",
        priority: "medium",
        team: "",
    });

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route("admin.tickets.store"), {
            onSuccess: () => {
                createForm.reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById("addTicketModal"));
                modal?.hide();
            },
        });
    };

    const openEdit = (ticket) => {
        setEditTicket(ticket);
        editForm.setData({
            subject: ticket.subject,
            description: ticket.description,
            priority: ticket.priority || "medium",
            team: ticket.team || "",
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.patch(route("admin.tickets.update", editTicket.id), {
            preserveScroll: true,
            onSuccess: () => {
                setTickets(tickets.map(t =>
                    t.id === editTicket.id
                        ? { ...t, subject: editForm.data.subject, description: editForm.data.description, priority: editForm.data.priority, team: editForm.data.team }
                        : t
                ));
                const modal = bootstrap.Modal.getInstance(document.getElementById(`editModal${editTicket.id}`));
                modal?.hide();
            },
        });
    };

    const handleUnassign = (id) => {
        if (!confirm("Unassign this ticket?")) return;
        router.post(route("admin.tickets.unassign", id), {}, {
            onSuccess: () => {
                setTickets(tickets.map(t => t.id === id ? { ...t, assignee_id: null, ass_first: null, ass_last: null } : t));
            },
        });
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this ticket permanently?")) return;
        router.delete(route("admin.tickets.delete", id), {
            onSuccess: () => {
                setTickets(tickets.filter(t => t.id !== id));
            },
        });
    };

    const filteredTickets = tickets.filter(t =>
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        `${t.req_first} ${t.req_last}`.toLowerCase().includes(search.toLowerCase()) ||
        (t.ass_first && `${t.ass_first} ${t.ass_last}`.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <>
            <Head title="All Tickets - Admin Panel" />

            {/* Bootstrap CSS + Icons */}
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
                .wrap-text { white-space: normal; word-wrap: break-word; }
                .action-dropdown .dropdown-toggle::after { display: none; }
                .action-dropdown .btn-link { color: #495057; }
                @media (max-width: 991px) {
                    .sidebar { left: -250px; }
                    .sidebar.show { left: 0; }
                    .topbar { margin-left: 0; width: 100%; }
                    .content { margin-left: 0; padding: 90px 15px 30px; }
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
                <div><strong>Admin / All Tickets</strong></div>
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>All Tickets ({filteredTickets.length})</h2>
                    <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addTicketModal">
                        Create Ticket
                    </button>
                </div>

                {flash?.success && <div className="alert alert-success alert-dismissible fade show">{flash.success}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}
                {flash?.error && <div className="alert alert-danger alert-dismissible fade show">{flash.error}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}

                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        {filteredTickets.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>S.No</th>
                                            <th>Subject</th>
                                            <th>Description</th>
                                            <th>Requester</th>
                                            <th>Assignee</th>
                                            <th>Department</th>
                                            <th>Priority</th>
                                            <th>Created</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTickets.map((t, i) => (
                                            <tr key={t.id}>
                                                <td><strong>{i + 1}</strong></td>
                                                <td className="wrap-text" style={{ maxWidth: "200px" }}>{t.subject}</td>
                                                <td className="wrap-text" style={{ maxWidth: "300px" }}>
                                                    {t.description.substring(0, 100)}{t.description.length > 100 && "..."}
                                                </td>
                                                <td>{t.req_first} {t.req_last}</td>
                                                <td>
                                                    {t.assignee_id ? `${t.ass_first} ${t.ass_last}` : <span className="text-muted">Unassigned</span>}
                                                </td>
                                                <td><span className="badge bg-info">{t.team || "Not Set"}</span></td>
                                                <td>
                                                    <span className={`text-${t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'success'} fw-bold`}>
                                                        {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                                                    </span>
                                                </td>
                                                <td>{new Date(t.created_at).toLocaleDateString()}</td>
                                                <td className="text-center">
    <Dropdown>
        <Dropdown.Trigger>
            <button type="button" className="btn btn-link text-dark p-0">
                <i className="bi bi-three-dots-vertical fs-5"></i>
            </button>
        </Dropdown.Trigger>

        <Dropdown.Content align="right">
            {/* EDIT – NOW WORKS 100% */}
            <button
                type="button"
                className="dropdown-item text-primary"
                onClick={() => {
                    openEdit(t);
                    // Manually open Bootstrap modal
                    const modal = new bootstrap.Modal(document.getElementById(`editModal${t.id}`));
                    modal.show();
                }}
            >
                Edit Ticket
            </button>

            {/* UNASSIGN */}
            {t.assignee_id && (
                <button
                    type="button"
                    className="dropdown-item text-warning"
                    onClick={() => handleUnassign(t.id)}
                >
                    Unassign
                </button>
            )}

            <hr className="dropdown-divider" />

            {/* DELETE */}
            <button
                type="button"
                className="dropdown-item text-danger"
                onClick={() => handleDelete(t.id)}
            >
                Delete Ticket
            </button>
        </Dropdown.Content>
    </Dropdown>
</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-inbox fs-1"></i>
                                <h5>No tickets found</h5>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CREATE TICKET MODAL */}
            <div className="modal fade" id="addTicketModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <form onSubmit={handleCreate}>
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">Create New Ticket</h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Created by:</strong> {fullName} (Admin)</p>
                                <div className="mb-3">
                                    <label>Subject</label>
                                    <input type="text" className="form-control" value={createForm.data.subject} onChange={e => createForm.setData("subject", e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label>Description</label>
                                    <textarea className="form-control" rows="6" value={createForm.data.description} onChange={e => createForm.setData("description", e.target.value)} required />
                                </div>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label>Priority</label>
                                        <select className="form-select" value={createForm.data.priority} onChange={e => createForm.setData("priority", e.target.value)}>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <label>Department</label>
                                        <select className="form-select" value={createForm.data.team} onChange={e => createForm.setData("team", e.target.value)}>
                                            <option value="">-- No Department --</option>
                                            <option>Support</option>
                                            <option>Technical</option>
                                            <option>Billing</option>
                                            <option>Sales</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-success" disabled={createForm.processing}>
                                    {createForm.processing ? "Creating..." : "Create Ticket"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* EDIT MODAL - ONE PER TICKET */}
            {editTicket && (
                <div className="modal fade" id={`editModal${editTicket.id}`} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <form onSubmit={handleUpdate}>
                            <div className="modal-content">
                                <div className="modal-header bg-primary text-white">
                                    <h5>Edit Ticket #{editTicket.id}</h5>
                                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label>Subject</label>
                                        <input type="text" className="form-control" value={editForm.data.subject} onChange={e => editForm.setData("subject", e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label>Description</label>
                                        <textarea className="form-control" rows="6" value={editForm.data.description} onChange={e => editForm.setData("description", e.target.value)} required />
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label>Priority</label>
                                            <select className="form-select" value={editForm.data.priority} onChange={e => editForm.setData("priority", e.target.value)}>
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label>Department</label>
                                            <select className="form-select" value={editForm.data.team} onChange={e => editForm.setData("team", e.target.value)}>
                                                <option value="">-- No Department --</option>
                                                <option>Support</option>
                                                <option>Technical</option>
                                                <option>Billing</option>
                                                <option>Sales</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary" disabled={editForm.processing}>
                                        {editForm.processing ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

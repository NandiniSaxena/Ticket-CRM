import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function AssignTickets() {
    const { auth, tickets, assignees: initialAssignees, flash } = usePage().props;
    const user = auth.user;

    const [unassignedTickets, setUnassignedTickets] = useState(tickets || []);
    const [assignees, setAssignees] = useState(initialAssignees || []);
    const [teamFilter, setTeamFilter] = useState("");
    const [draggedTicket, setDraggedTicket] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Admin";

    const handleAssign = (ticketId, assigneeId) => {
        router.post(route("admin.tickets.assign"), {
            ticket_id: ticketId,
            assignee_id: assigneeId,
        }, {
            onSuccess: () => {
                setUnassignedTickets(prev => prev.filter(t => t.id !== ticketId));
                setAssignees(prev => prev.map(a =>
                    a.id === assigneeId ? { ...a, current_load: a.current_load + 1 } : a
                ));
            },
            onError: (errors) => {
    // errors come from $request->validate()
    const msg = Object.values(errors).flat().join(" ");
    alert(msg || "Assignment failed");
}
        });
    };

    const handleDragStart = (e, ticket) => {
        setDraggedTicket(ticket);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e, assignee) => {
        e.preventDefault();
        if (!draggedTicket) return;

        const ticketTeam = draggedTicket.team || "";
        const assigneeDept = assignee.team || "";

        if (!ticketTeam || !assigneeDept || ticketTeam === assigneeDept) {
            handleAssign(draggedTicket.id, assignee.id);
        } else {
            alert(`Cannot assign: Ticket team (${ticketTeam}) ≠ Assignee department (${assigneeDept})`);
        }
        setDraggedTicket(null);
    };

    const filteredAssignees = teamFilter
        ? assignees.filter(a => a.team === teamFilter)
        : assignees;

    const filteredTickets = teamFilter
        ? unassignedTickets.filter(t => t.team === teamFilter)
        : unassignedTickets;

    return (
        <>
            <Head title="Assign Tickets - Admin Panel" />

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
                .ticket-card { background: white; border-radius: 12px; padding: 15px; margin-bottom: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); cursor: grab; transition: all 0.2s; position: relative; }
                .ticket-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
                .ticket-card.dragging { opacity: 0.6; }
                .ticket-number { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; z-index: 1; }
                .assignee-box { background: white; border: 2px dashed #ccc; border-radius: 15px; padding: 20px; text-align: center; min-height: 150px; transition: all 0.3s; }
                .assignee-box:hover, .assignee-box.drag-over { border-color: #0d6efd; background: #f0f8ff; }
                .priority-high { border-left: 5px solid #dc3545; }
                .priority-medium { border-left: 5px solid #ffc107; }
                .priority-low { border-left: 5px solid #28a745; }
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
                <div><strong>Admin / Assign Tickets</strong></div>
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
                <h2 className="mb-4">Assign Tickets to Assignees</h2>
                <p className="text-muted mb-4">Drag a ticket to an assignee or click to assign instantly. <strong>Only same department allowed!</strong></p>

                <div className="row mb-4">
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Filter by Team</label>
                        <select className="form-select form-select-lg" value={teamFilter} onChange={e => setTeamFilter(e.target.value)}>
                            <option value="">All Teams</option>
                            <option>Support</option>
                            <option>Technical</option>
                            <option>Billing</option>
                            <option>Sales</option>
                        </select>
                    </div>
                </div>

                <div className="row">
                    {/* UNASSIGNED TICKETS */}
                    <div className="col-lg-5">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white">
                                <h5>Unassigned Tickets ({filteredTickets.length})</h5>
                            </div>
                            <div className="card-body p-3">
                                {filteredTickets.length > 0 ? (
                                    filteredTickets.map((t, i) => (
                                        <div
                                            key={t.id}
                                            className={`ticket-card ${t.priority === 'high' ? 'priority-high' : t.priority === 'medium' ? 'priority-medium' : 'priority-low'} ${draggedTicket?.id === t.id ? 'dragging' : ''}`}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, t)}
                                        >
                                            <div className="ticket-number">{i + 1}</div>
                                            <div style={{ paddingLeft: "40px" }}>
                                                <strong>{t.subject}</strong><br />
                                                <small className="text-muted">
                                                    By {t.req_first} {t.req_last} · Team: <strong>{t.team || "Not Set"}</strong>
                                                </small>
                                                <span className={`badge bg-${t.priority === 'high' ? 'danger' : t.priority === 'medium' ? 'warning' : 'success'} float-end`}>
                                                    {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-5 text-success">
                                        <i className="bi bi-check2-all fs-1"></i>
                                        <h5>All tickets assigned!</h5>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ASSIGNEES */}
                    <div className="col-lg-7">
                        <div className="card shadow-sm">
                            <div className="card-header bg-white">
                                <h5>Available Assignees ({filteredAssignees.length})</h5>
                            </div>
                            <div className="card-body">
                                <div className="row g-4">
                                    {filteredAssignees.map(a => (
                                        <div key={a.id} className="col-md-6">
                                            <div
                                                className={`assignee-box text-center ${draggedTicket ? 'drag-over' : ''}`}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, a)}
                                                onClick={() => draggedTicket && handleAssign(draggedTicket.id, a.id)}
                                            >
                                                <h6 className="fw-bold mb-1">{a.first_name} {a.last_name}</h6>
                                                <span className="badge bg-primary mb-3">{a.team || "No Team"}</span><br />
                                                <small className="text-muted">{a.current_load} active tickets</small>
                                                <div className="mt-3">
                                                    <i className="bi bi-arrow-down-circle fs-3 text-primary"></i>
                                                    <p className="mt-2 text-primary fw-bold">Drop Here</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

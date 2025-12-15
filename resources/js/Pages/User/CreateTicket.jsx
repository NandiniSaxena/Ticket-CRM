import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function CreateTicket() {
    const { auth, flash, errors } = usePage().props;
    const user = auth?.user || {};

    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "User";
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const [form, setForm] = useState({
        subject: "",
        description: "",
        priority: "low",
        team: "Support",
    });

    const submit = (e) => {
        e.preventDefault();

        router.post("/tickets", form, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Optional: show success or redirect
                // Inertia will handle flash.success automatically
            },
            onError: (errors) => {
                // Errors are now available via usePage().props.errors
                console.log(errors);
            }
        });
    };

    return (
        <>
            <Head title="Create New Ticket - Helpdesk" />

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />

            <style>{`
                body { background: #f0f2f5; font-family: 'Segoe UI', Arial, sans-serif; margin:0; }
                .sidebar { width: 230px; height: 100vh; background: #1a1e21; position: fixed; top: 0; left: 0; color: white; padding-top: 20px; z-index: 1000; transition: 0.3s; }
                .sidebar h4 { text-align: center; margin-bottom: 30px; font-weight: bold; }
                .sidebar a { padding: 14px 20px; display: block; color: #c9c9c9; text-decoration: none; border-left: 3px solid transparent; }
                .sidebar a:hover, .sidebar a.active { background: #2d3238; color: white; border-left-color: #0d6efd; }
                .topbar { height: 60px; background: #fff; margin-left: 230px; display: flex; align-items: center; justify-content: space-between; padding: 0 25px; border-bottom: 1px solid #dcdcdc; position: fixed; width: calc(100% - 230px); z-index: 999; }
                .content { margin-left: 240px; padding: 90px 30px 30px; }
                .card { border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); }
                .form-label { font-weight: 600; color: #333; }
                .text-danger { font-size: 0.875rem; margin-top: 0.25rem; }
                @media (max-width: 991px) {
                    .sidebar { left: -250px; width: 230px; }
                    .sidebar.show { left: 0; }
                    .topbar { margin-left: 0; width: 100%; padding: 0 15px; }
                    .content { margin-left: 0; padding: 90px 15px 15px; }
                    .hamburger { font-size: 1.8rem; cursor: pointer; margin-right: 15px; }
                }
            `}</style>

            <div className={`sidebar ${sidebarOpen ? "show" : ""}`}>
                <h4>Helpdesk</h4>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/alltickets">All Tickets</Link>
                <Link href="/unassigned">Unassigned</Link>
                <Link href="/pending">Pending</Link>
                <Link href="/create" className="active">Create Ticket</Link>
                <Link href="/profile">My Profile</Link>
            </div>

            <div className="topbar">
                <div className="d-flex align-items-center">
                    <span className="hamburger d-lg-none" onClick={toggleSidebar}>☰</span>
                    <strong>Create New Ticket</strong>
                </div>

                <div className="d-flex align-items-center">
                    <span className="fw-bold me-3">{fullName}</span>
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button type="button" className="btn btn-link text-dark p-0 border-0">
                                <i className="bi bi-person-circle fs-3"></i>
                            </button>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right" width="220px">
                            <div className="px-4 py-3 border-bottom text-center">
                                <div className="fw-bold">{fullName}</div>
                                <small className="text-muted">{user.email}</small>
                            </div>
                            <Dropdown.Link href="/profile">My Profile</Dropdown.Link>
                            <Dropdown.Link href="/logout" method="post" as="button" className="text-danger">Logout</Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            <div className="content">
                <div className="card">
                    <div className="card-header bg-white">
                        <h4 className="mb-0">Submit a New Support Request</h4>
                    </div>

                    <div className="card-body p-4">
                        {/* Flash Success Message */}
                        {flash?.success && (
                            <div className="alert alert-success text-center fs-5 mb-4">
                                {flash.success}
                                <div className="mt-3">
                                    <Link href="/alltickets" className="btn btn-success">Go to All Tickets</Link>
                                    <Link href="/dashboard" className="btn btn-outline-primary ms-2">Back to Dashboard</Link>
                                </div>
                            </div>
                        )}

                        {/* Form - Only show if no success */}
                        {!flash?.success && (
                            <form onSubmit={submit}>
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="mb-3">
                                            <label className="form-label">Subject *</label>
                                            <input
                                                type="text"
                                                className={`form-control form-control-lg ${errors.subject ? 'is-invalid' : ''}`}
                                                value={form.subject}
                                                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                                placeholder="Brief summary of your issue"
                                            />
                                            {errors.subject && <div className="text-danger">{errors.subject}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Description *</label>
                                            <textarea
                                                rows="8"
                                                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                value={form.description}
                                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                                placeholder="Provide detailed information about your issue..."
                                            ></textarea>
                                            {errors.description && <div className="text-danger">{errors.description}</div>}
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <div className="bg-light p-4 rounded h-100">
                                            <h6 className="fw-bold mb-4">Ticket Details</h6>

                                            <div className="mb-3">
                                                <label className="form-label">Priority</label>
                                                <select
                                                    className="form-select"
                                                    value={form.priority}
                                                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                                                >
                                                    <option value="low">Low</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="high">High (Urgent)</option>
                                                </select>
                                            </div>

                                            <div className="mb-4">
                                                <label className="form-label">Team / Department</label>
                                                <select
                                                    className="form-select"
                                                    value={form.team}
                                                    onChange={(e) => setForm({ ...form, team: e.target.value })}
                                                >
                                                    <option value="Support">Support</option>
                                                    <option value="Technical">Technical</option>
                                                    <option value="Billing">Billing</option>
                                                    <option value="Sales">Sales</option>
                                                </select>
                                            </div>

                                            <hr />

                                            <div className="text-muted small">
                                                <strong>Requester:</strong> {fullName}<br />
                                                <strong>Email:</strong> {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 text-end">
                                    <Link href="/dashboard" className="btn btn-secondary btn-lg me-3">Cancel</Link>
                                    <button type="submit" className="btn btn-primary btn-lg px-5">
                                        Submit Ticket
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

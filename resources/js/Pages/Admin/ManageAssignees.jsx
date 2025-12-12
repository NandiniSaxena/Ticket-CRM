import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function ManageAssignees() {
    const { auth, assignees = [], normalUsers = [], flash } = usePage().props;
    const user = auth?.user || {};

    const fullName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : "Admin";
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [selectedUserId, setSelectedUserId] = React.useState("");
    const [selectedDepartment, setSelectedDepartment] = React.useState("");

    const departments = ["Support", "Technical", "Billing", "Sales"];

    const handleMakeAssignee = () => {
        if (!selectedUserId || !selectedDepartment) return;

        router.post(
            route("admin.assignees.store"),
            {
                user_id: selectedUserId,
                department: selectedDepartment,
            },
            {
                onSuccess: () => {
                    setSelectedUserId("");
                    setSelectedDepartment("");
                    const modal = bootstrap.Modal.getInstance(document.getElementById("addAssigneeModal"));
                    modal?.hide();
                },
            }
        );
    };

    const handleRemoveAssignee = (assigneeId) => {
        if (!confirm("Remove this assignee? They will become a normal user.")) return;

        router.post(route("admin.assignees.remove", assigneeId));
    };

    return (
        <>
            <Head title="All Assignees - Admin Panel" />

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

            <style>{`
                body { background: #f0f2f5; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; }
                .sidebar { width: 250px; height: 100vh; background: #1a1e21; position: fixed; top: 0; left: 0; color: white; padding-top: 20px; z-index: 1000; overflow-y: auto; }
                .sidebar h4 { text-align: center; margin-bottom: 30px; font-weight: bold; color: #0d6efd; }
                .sidebar a { padding: 14px 25px; display: block; color: #c9c9c9; font-size: 15px; text-decoration: none; border-left: 4px solid transparent; }
                .sidebar a:hover, .sidebar a.active { background: #2d3238; color: white; border-left-color: #0d6efd; }
                .sidebar .section-title { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 15px 25px 5px; font-weight: bold; }
                .topbar { height: 60px; background: #fff; margin-left: 250px; display: flex; align-items: center; justify-content: space-between; padding: 0 30px; border-bottom: 1px solid #dcdcdc; position: fixed; width: calc(100% - 250px); z-index: 999; }
                .content { margin-left: 260px; padding: 90px 30px 30px; }
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
                {/* <Link href="/admin/settings"><i className="bi bi-gear me-2"></i> Settings</Link> */}
                <Link href="/admin/activity-log"><i className="bi bi-clock-history me-2"></i> Activity Log</Link>
                <Link href="/admin/profile"><i className="bi bi-person me-2"></i> My Profile</Link>
                <Link href="/logout" className="text-danger"><i className="bi bi-box-arrow-right me-2"></i> Logout</Link>
            </div>


            {/* TOPBAR */}
            <div className="topbar">
                <div><strong>Admin / All Assignees</strong></div>
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
                    <h2>All Assignees ({assignees.length})</h2>
                    <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addAssigneeModal">
                        Add New Assignee
                    </button>
                </div>

                {flash?.success && <div className="alert alert-success alert-dismissible fade show">{flash.success}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}
                {flash?.error && <div className="alert alert-danger alert-dismissible fade show">{flash.error}<button type="button" className="btn-close" data-bs-dismiss="alert"></button></div>}

                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        {assignees.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>S.No</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Department</th>
                                            <th>Joined</th>
                                            <th>Active Tickets</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assignees.map((a, i) => (
                                            <tr key={a.id}>
                                                <td>{i + 1}</td>
                                                <td><strong>{a.first_name} {a.last_name}</strong></td>
                                                <td>{a.email}</td>
                                                <td><span className="badge bg-primary">{a.department}</span></td>
                                                <td>{new Date(a.created_at).toLocaleDateString()}</td>
                                                <td><span className="badge bg-info">{a.assigned_tickets || 0}</span></td>
                                                <td>
                                                    <button
                                                        onClick={() => handleRemoveAssignee(a.id)}
                                                        className="btn btn-sm btn-outline-danger"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-5 text-center text-muted">
                                <h5>No assignees yet</h5>
                                <p>Click the button above to add one!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ADD ASSIGNEE MODAL */}
            <div className="modal fade" id="addAssigneeModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-success text-white">
                            <h5>Add New Assignee</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <h6>Select a user and assign a department:</h6>

                            {normalUsers.length > 0 ? (
                                <div className="table-responsive mt-3">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Department</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {normalUsers.map(u => (
                                                <tr key={u.id}>
                                                    <td>{u.first_name} {u.last_name}</td>
                                                    <td>{u.email}</td>
                                                    <td>
                                                        <select
                                                            className="form-select form-select-sm"
                                                            value={selectedUserId === u.id ? selectedDepartment : ""}
                                                            onChange={(e) => {
                                                                setSelectedUserId(u.id);
                                                                setSelectedDepartment(e.target.value);
                                                            }}
                                                        >
                                                            <option value="">Choose department...</option>
                                                            {departments.map(d => (
                                                                <option key={d} value={d}>{d}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-success btn-sm"
                                                            disabled={!selectedUserId || !selectedDepartment || selectedUserId !== u.id}
                                                            onClick={handleMakeAssignee}
                                                        >
                                                            Add as Assignee
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-muted my-5">No regular users available to promote.</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

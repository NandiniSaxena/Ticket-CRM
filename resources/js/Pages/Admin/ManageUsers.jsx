import React from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function ManageUsers() {
    const { auth, users: initialUsers, flash, errors } = usePage().props;
    const user = auth?.user;
    const users = initialUsers || [];
    const fullName = user ? [user.first_name, user.last_name].filter(Boolean).join(" ") || "Admin" : "Admin";
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    // Add User
    const addForm = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    // Edit User
    const [editUser, setEditUser] = React.useState(null);
    const editForm = useForm({
        first_name: "",
        last_name: "",
        email: "",
    });

    // Change Password
    const [passUser, setPassUser] = React.useState(null);
    const passForm = useForm({ new_password: "" });

    const handleAdd = (e) => {
        e.preventDefault();
        addForm.post(route("admin.users.store"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                addForm.reset();
                const modal = document.getElementById("addUserModal");
                bootstrap.Modal.getInstance(modal)?.hide();
            },
        });
    };

    const openEdit = (u) => {
        setEditUser(u);
        editForm.setData({
            first_name: u.first_name,
            last_name: u.last_name,
            email: u.email,
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.patch(route("admin.users.update", editUser.id), {
            onSuccess: () => {
                const modal = document.getElementById(`editModal${editUser.id}`);
                bootstrap.Modal.getInstance(modal)?.hide();
            },
        });
    };

    const openPassModal = (u) => {
        setPassUser(u);
        passForm.reset();
    };

    const handlePassword = (e) => {
        e.preventDefault();
        passForm.post(route("admin.users.password", passUser.id), {
            onSuccess: () => {
                const modal = document.getElementById(`passModal${passUser.id}`);
                bootstrap.Modal.getInstance(modal)?.hide();
            },
        });
    };

    const handleDelete = (id) => {
        if (!confirm("Delete this user and all their tickets permanently?")) return;
        router.delete(route("admin.users.destroy", id));
    };

    return (
        <>
            <Head title="Manage Users - Admin Panel" />

            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

            <style>{`
                body { background: #f0f2f5; font-family: 'Segoe UI', Arial, sans-serif; margin: 0; }
                .sidebar { width: 250px; height: 100vh; background: #1a1e21; position: fixed; top: 0; left: 0; color: white; padding-top: 20px; z-index: 1000; }
                .sidebar h4 { text-align: center; margin-bottom: 30px; font-weight: bold; color: #0d6efd; }
                .sidebar a { padding: 14px 25px; display: block; color: #c9c9c9; font-size: 15px; text-decoration: none; border-left: 4px solid transparent; }
                .sidebar a:hover, .sidebar a.active { background: #2d3238; color: white; border-left-color: #0d6efd; }
                .sidebar .section-title { color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 15px 25px 5px; font-weight: bold; }
                .topbar { height: 60px; background: #fff; margin-left: 250px; display: flex; align-items: center; justify-content: space-between; padding: 0 30px; border-bottom: 1px solid #dcdcdc; position: fixed; width: calc(100% - 250px); z-index: 999; }
                .content { margin-left: 260px; padding: 90px 30px 30px; }
                .table-wrapper { overflow: visible; } /* Allow dropdowns to escape clipping */
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
                <Link href="/admin/activity-log"><i className="bi bi-clock-history me-2"></i> Activity Log</Link>
                <Link href="/admin/profile"><i className="bi bi-person me-2"></i> My Profile</Link>
                <Link href="/logout" className="text-danger"><i className="bi bi-box-arrow-right me-2"></i> Logout</Link>
            </div>

            {/* TOPBAR */}
            <div className="topbar">
                <div><strong>Admin / Manage Users</strong></div>
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
                                <small className="text-muted">{user?.email}</small>
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
                    <h2>All Users ({users.length})</h2>
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addUserModal">
                        Add New User
                    </button>
                </div>

                {/* SUCCESS MESSAGE */}
                {flash?.success && <div className="alert alert-success alert-dismissible fade show">
                    {flash.success}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>}

                {/* ERROR MESSAGE - SHOWS WHEN EMAIL EXISTS OR INVALID */}
                {Object.keys(errors).length > 0 && (
                    <div className="alert alert-danger alert-dismissible fade show">
                        <ul className="mb-0 ps-3">
                            {Object.values(errors).map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                        <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                )}

                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        {users.length > 0 ? (
                            <div className="table-wrapper">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>S.No</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Joined</th>
                                            <th>Tickets</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u, i) => (
                                            <tr key={u.id}>
                                                <td>{i + 1}</td>
                                                <td><strong>{u.first_name} {u.last_name}</strong></td>
                                                <td>{u.email}</td>
                                                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                                                <td><span className="badge bg-primary">{u.total_tickets || 0}</span></td>
                                                <td>
                                                    <div className="position-relative">
                                                        <Dropdown>
                                                            <Dropdown.Trigger>
                                                                <button type="button" className="btn btn-link text-dark p-0">
                                                                    <i className="bi bi-three-dots-vertical fs-5"></i>
                                                                </button>
                                                            </Dropdown.Trigger>
                                                            <Dropdown.Content align="right">
                                                                <button type="button" className="dropdown-item text-primary"
                                                                    onClick={() => openEdit(u)}
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target={`#editModal${u.id}`}>
                                                                    Edit
                                                                </button>
                                                                <button type="button" className="dropdown-item"
                                                                    onClick={() => openPassModal(u)}
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target={`#passModal${u.id}`}>
                                                                    Change Password
                                                                </button>
                                                                <hr className="dropdown-divider" />
                                                                <button type="button" className="dropdown-item text-danger"
                                                                    onClick={() => handleDelete(u.id)}>
                                                                    Delete
                                                                </button>
                                                            </Dropdown.Content>
                                                        </Dropdown>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-5 text-muted">
                                <i className="bi bi-people fs-1"></i>
                                <h5>No users yet</h5>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ADD USER MODAL */}
            <div className="modal fade" id="addUserModal" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered">
                    <form onSubmit={handleAdd}>
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5>Add New User</h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label>First Name</label>
                                        <input type="text" className="form-control" value={addForm.data.first_name} onChange={e => addForm.setData("first_name", e.target.value)} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Last Name</label>
                                        <input type="text" className="form-control" value={addForm.data.last_name} onChange={e => addForm.setData("last_name", e.target.value)} required />
                                    </div>
                                    <div className="col-12">
                                        <label>Email</label>
                                        <input type="email" className="form-control" value={addForm.data.email} onChange={e => addForm.setData("email", e.target.value)} required />
                                    </div>
                                    <div className="col-12">
                                        <label>Password <small className="text-muted">(leave blank for auto-generated)</small></label>
                                        <input type="text" className="form-control" value={addForm.data.password} onChange={e => addForm.setData("password", e.target.value)} placeholder="Leave empty for random" />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary" disabled={addForm.processing}>
                                    {addForm.processing ? "Creating..." : "Create User"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* EDIT & PASSWORD MODALS */}
            {users.map(u => (
                <React.Fragment key={u.id}>
                    {/* Edit Modal */}
                    <div className="modal fade" id={`editModal${u.id}`} tabIndex="-1">
                        <div className="modal-dialog">
                            <form onSubmit={handleUpdate}>
                                <div className="modal-content">
                                    <div className="modal-header bg-primary text-white">
                                        <h5>Edit User</h5>
                                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div className="modal-body">
                                        <input type="hidden" value={u.id} />
                                        <div className="mb-3">
                                            <label>First Name</label>
                                            <input type="text" className="form-control" value={editForm.data.first_name || ""} onChange={e => editForm.setData("first_name", e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label>Last Name</label>
                                            <input type="text" className="form-control" value={editForm.data.last_name || ""} onChange={e => editForm.setData("last_name", e.target.value)} required />
                                        </div>
                                        <div className="mb-3">
                                            <label>Email</label>
                                            <input type="email" className="form-control" value={editForm.data.email || ""} onChange={e => editForm.setData("email", e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary" disabled={editForm.processing}>
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Password Modal */}
                    <div className="modal fade" id={`passModal${u.id}`} tabIndex="-1">
                        <div className="modal-dialog">
                            <form onSubmit={handlePassword}>
                                <div className="modal-content">
                                    <div className="modal-header bg-warning text-dark">
                                        <h5>Change Password</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label>New Password</label>
                                            <input type="password" className="form-control" value={passForm.data.new_password || ""} onChange={e => passForm.setData("new_password", e.target.value)} required minLength="6" />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-warning" disabled={passForm.processing}>
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </>
    );
}

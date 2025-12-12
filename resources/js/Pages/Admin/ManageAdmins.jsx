import React from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export default function ManageAdmins() {
    const { auth, admins = [], nonAdmins = [], flash } = usePage().props;
    const user = auth?.user || {};

    const fullName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : "Admin";
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    // Create Admin Form
    const createForm = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    // Edit Admin
    const [editAdmin, setEditAdmin] = React.useState(null);
    const editForm = useForm({ first_name: "", last_name: "", email: "" });

    // Change Password
    const [passAdmin, setPassAdmin] = React.useState(null);
    const passForm = useForm({ new_password: "" });

    const showAlert = (message, type = "info") => {
        const alertDiv = document.createElement("div");
        alertDiv.className = `alert alert-${type === "success" ? "success" : type === "danger" ? "danger" : "primary"} alert-dismissible fade show position-fixed`;
        alertDiv.style.top = "20px";
        alertDiv.style.right = "20px";
        alertDiv.style.zIndex = "9999";
        alertDiv.style.minWidth = "300px";
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        setTimeout(() => alertDiv.remove(), 5000);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        createForm.post(route("admin.admins.store"), {
            onSuccess: (page) => {
                createForm.reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById("createAdminModal"));
                modal?.hide();

                const newAdmin = page.props.new_admin;
                const password = page.props.generated_password || "Auto-generated";

                showAlert(`
                    <strong>New Admin Created!</strong><br>
                    Name: <strong>${newAdmin.first_name} ${newAdmin.last_name}</strong><br>
                    Email: <strong>${newAdmin.email}</strong><br>
                    Password: <strong>${password}</strong>
                `, "success");
            },
            onError: (errors) => {
                if (errors.email) {
                    showAlert("Email already exists!", "danger");
                } else {
                    showAlert("Please fix the errors.", "danger");
                }
            },
        });
    };

    const openEdit = (admin) => {
        setEditAdmin(admin);
        editForm.setData({
            first_name: admin.first_name,
            last_name: admin.last_name,
            email: admin.email,
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        editForm.patch(route("admin.admins.update", editAdmin.id), {
            onSuccess: () => {
                showAlert("Admin updated successfully!", "success");
                const modal = bootstrap.Modal.getInstance(document.getElementById(`editModal${editAdmin.id}`));
                modal?.hide();
            },
        });
    };

    const openPassModal = (admin) => {
        setPassAdmin(admin);
        passForm.reset();
    };

    const handlePassword = (e) => {
        e.preventDefault();
        passForm.post(route("admin.admins.password", passAdmin.id), {
            onSuccess: () => {
                showAlert("Password changed successfully!", "success");
                const modal = bootstrap.Modal.getInstance(document.getElementById(`passModal${passAdmin.id}`));
                modal?.hide();
            },
        });
    };

    const handlePromote = (userId) => {
        if (!confirm("Promote this user to Administrator?")) return;
        router.post(route("admin.admins.promote", userId), {}, {
            onSuccess: () => showAlert("User promoted to Administrator!", "success"),
        });
    };

    const handleRemoveRights = (adminId) => {
        if (!confirm("Remove admin rights from this user?")) return;
        router.post(route("admin.admins.demote", adminId), {}, {
            onSuccess: () => showAlert("Admin rights removed successfully!", "success"),
        });
    };

    const handleDelete = (adminId) => {
        if (!confirm("Delete this administrator permanently? This cannot be undone.")) return;
        router.delete(route("admin.admins.destroy", adminId), {
            onSuccess: () => showAlert("Administrator deleted permanently!", "success"),
        });
    };

    return (
        <>
            <Head title="Manage Administrators - Admin Panel" />

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
                .card-header { background: linear-gradient(135deg, #dc3545, #c82333); color: white; }
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
                <div><strong>Admin / Manage Administrators</strong></div>
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
                <h2 className="mb-4">Manage Administrators ({admins.length})</h2>

                {/* Flash Messages as Popups */}
                {flash?.success && showAlert(flash.success, "success")}
                {flash?.error && showAlert(flash.error, "danger")}

                <div className="row g-4">
                    {/* CREATE NEW ADMIN */}
                    <div className="col-lg-5">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header text-white text-center py-3">
                                <h5 className="mb-0">Create New Administrator</h5>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleCreate}>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <input type="text" className="form-control form-control-sm" placeholder="First Name" value={createForm.data.first_name} onChange={e => createForm.setData("first_name", e.target.value)} required />
                                        </div>
                                        <div className="col-12">
                                            <input type="text" className="form-control form-control-sm" placeholder="Last Name" value={createForm.data.last_name} onChange={e => createForm.setData("last_name", e.target.value)} required />
                                        </div>
                                        <div className="col-12">
                                            <input type="email" className="form-control form-control-sm" placeholder="Email Address" value={createForm.data.email} onChange={e => createForm.setData("email", e.target.value)} required />
                                        </div>
                                        <div className="col-12">
                                            <input type="text" className="form-control form-control-sm" placeholder="Password (auto-generated if blank)" value={createForm.data.password} onChange={e => createForm.setData("password", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="text-center mt-4">
                                        <button type="submit" className="btn btn-danger px-4" disabled={createForm.processing}>
                                            Create Admin
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* PROMOTE TO ADMIN */}
                    <div className="col-lg-7">
                        <div className="card shadow-sm border-0 h-100">
                            <div className="card-header text-white text-center py-3" style={{background: "linear-gradient(135deg, #fd7e14, #e85d04)"}}>
                                <h5 className="mb-0">Promote to Admin</h5>
                            </div>
                            <div className="card-body p-3">
                                {nonAdmins.length > 0 ? (
                                    <div className="table-responsive" style={{maxHeight: "380px"}}>
                                        <table className="table table-sm table-hover mb-0">
                                            <thead className="table-light sticky-top">
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Role</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {nonAdmins.map(u => (
                                                    <tr key={u.id}>
                                                        <td className="fw-600">{u.first_name} {u.last_name}</td>
                                                        <td><small>{u.email}</small></td>
                                                        <td><span className="badge bg-secondary fs-7">{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span></td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                onClick={() => handlePromote(u.id)}
                                                                className="btn btn-sm btn-outline-danger"
                                                            >
                                                                Promote
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-muted my-5">No users available to promote.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CURRENT ADMINS */}
                <div className="mt-5">
                    <h3 className="mb-3">Current Administrators ({admins.length})</h3>
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            {admins.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>S.No</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Joined</th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {admins.map((a, i) => (
                                                <tr key={a.id}>
                                                    <td>{i + 1}</td>
                                                    <td className="fw-600">{a.first_name} {a.last_name}</td>
                                                    <td><small>{a.email}</small></td>
                                                    <td><small>{new Date(a.created_at).toLocaleDateString()}</small></td>
                                                    <td className="text-center">
                                                        <div className="btn-group btn-group-sm">
                                                            <button type="button" className="btn btn-outline-primary btn-sm"
                                                                onClick={() => openEdit(a)}
                                                                data-bs-toggle="modal"
                                                                data-bs-target={`#editModal${a.id}`}>
                                                                Edit
                                                            </button>
                                                            <button type="button" className="btn btn-outline-warning btn-sm"
                                                                onClick={() => openPassModal(a)}
                                                                data-bs-toggle="modal"
                                                                data-bs-target={`#passModal${a.id}`}>
                                                                Password
                                                            </button>
                                                            {a.id !== user.id && (
                                                                <>
                                                                    <button type="button" className="btn btn-outline-danger btn-sm"
                                                                        onClick={() => handleRemoveRights(a.id)}
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target={`#removeModal${a.id}`}>
                                                                        Remove Rights
                                                                    </button>
                                                                    <button type="button" className="btn btn-outline-dark btn-sm"
                                                                        onClick={() => handleDelete(a.id)}
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target={`#deleteModal${a.id}`}>
                                                                        Delete
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-5 text-muted">
                                    <h5>No administrators</h5>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CREATE ADMIN MODAL */}
            <div className="modal fade" id="createAdminModal" tabIndex="-1">
                <div className="modal-dialog">
                    <form onSubmit={handleCreate}>
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5>Create New Administrator</h5>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label>First Name</label>
                                    <input type="text" className="form-control" value={createForm.data.first_name} onChange={e => createForm.setData("first_name", e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label>Last Name</label>
                                    <input type="text" className="form-control" value={createForm.data.last_name} onChange={e => createForm.setData("last_name", e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label>Email</label>
                                    <input type="email" className="form-control" value={createForm.data.email} onChange={e => createForm.setData("email", e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label>Password (leave blank for auto)</label>
                                    <input type="text" className="form-control" value={createForm.data.password} onChange={e => createForm.setData("password", e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-danger" disabled={createForm.processing}>
                                    Create Admin
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* ALL OTHER MODALS (Edit, Password, Remove, Delete) */}
            {admins.map(a => (
                <React.Fragment key={a.id}>
                    {/* Edit Modal */}
                    <div className="modal fade" id={`editModal${a.id}`} tabIndex="-1">
                        <div className="modal-dialog">
                            <form onSubmit={handleUpdate}>
                                <div className="modal-content">
                                    <div className="modal-header bg-primary text-white">
                                        <h5>Edit Admin</h5>
                                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div className="modal-body">
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
                    <div className="modal fade" id={`passModal${a.id}`} tabIndex="-1">
                        <div className="modal-dialog">
                            <form onSubmit={handlePassword}>
                                <div className="modal-content">
                                    <div className="modal-header bg-warning text-dark">
                                        <h5>Change Admin Password</h5>
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

                    {/* Remove Rights Modal */}
                    <div className="modal fade" id={`removeModal${a.id}`} tabIndex="-1">
                        <div className="modal-dialog">
                            <form onSubmit={() => handleRemoveRights(a.id)}>
                                <div className="modal-content">
                                    <div className="modal-header bg-warning text-dark">
                                        <h5>Remove Admin Rights</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Remove admin rights from <strong>{a.first_name} {a.last_name}</strong>?</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-warning">Yes, Remove</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Delete Modal */}
                    <div className="modal fade" id={`deleteModal${a.id}`} tabIndex="-1">
                        <div className="modal-dialog">
                            <form onSubmit={() => handleDelete(a.id)}>
                                <div className="modal-content">
                                    <div className="modal-header bg-danger text-white">
                                        <h5>Delete Administrator</h5>
                                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>Permanently delete <strong>{a.first_name} {a.last_name}</strong>?</p>
                                        <p className="text-muted">This cannot be undone.</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-danger">Yes, Delete</button>
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

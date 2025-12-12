<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AssigneeController extends Controller
{
    public function index()
    {
        $assignees = DB::table('users')
            ->leftJoin('tickets', function ($join) {
                $join->on('users.id', '=', 'tickets.assignee_id')
                     ->whereNull('tickets.deleted_at');
            })
            ->where('users.role', 'Assignee')
            ->select('users.*')
            ->selectRaw('COUNT(tickets.id) as assigned_tickets')
            ->groupBy('users.id')
            ->orderByDesc('users.created_at')
            ->get();

        $normalUsers = DB::table('users')
            ->where('role', 'User')
            ->select('id', 'first_name', 'last_name', 'email')
            ->orderByDesc('created_at')
            ->get();

        return inertia('Admin/ManageAssignees', [
            'assignees' => $assignees,
            'normalUsers' => $normalUsers,
        ]);
    }

    // app/Http/Controllers/Admin/AssigneeController.php

public function store(Request $request)
{
    $request->validate([
        'user_id' => 'required|exists:users,id',
        'department' => 'required|in:Support,Technical,Billing,Sales',
    ]);

    $userId = $request->user_id;

    // Delete all tickets created by this user (as requester)
    DB::table('tickets')->where('requester_id', $userId)->delete();

    // Update user to Assignee with correct department
    $affected = DB::table('users')
        ->where('id', $userId)
        ->where('role', 'User')
        ->update([
            'role' => 'Assignee',
            'department' => $request->department,
        ]);

    if ($affected) {
        return back()->with('success', "New Assignee added to <strong>{$request->department}</strong> department!");
    }

    return back()->with('error', 'User not found or already an assignee.');
}

public function remove($id)
{
    DB::table('users')
        ->where('id', $id)
        ->where('role', 'Assignee')
        ->update([
            'role' => 'User',
            'department' => null,
        ]);

    return back()->with('success', 'Assignee removed. User is now regular user.');
}
}

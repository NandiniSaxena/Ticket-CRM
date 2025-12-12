<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AdminTicketController extends Controller
{
    public function index(Request $request)
    {
        if (auth()->user()->role !== 'Admin') {
            abort(403);
        }

        $search = trim($request->get('q', ''));

        $query = DB::table('tickets')
            ->leftJoin('users as requester', 'tickets.requester_id', '=', 'requester.id')
            ->leftJoin('users as assignee', 'tickets.assignee_id', '=', 'assignee.id')
            ->select([
                'tickets.*',
                DB::raw("CONCAT(requester.first_name, ' ', requester.last_name) as requester_name"),
                DB::raw("CONCAT(assignee.first_name, ' ', assignee.last_name) as assignee_name"),
                'requester.first_name as req_first',
                'requester.last_name as req_last',
                'assignee.first_name as ass_first',
                'assignee.last_name as ass_last',
            ])
            ->whereNull('tickets.deleted_at');

        if ($search !== '') {
            $like = '%' . strtolower($search) . '%';
            $query->where(function ($q) use ($like) {
                $q->whereRaw('LOWER(tickets.subject) LIKE ?', [$like])
                  ->orWhereRaw('LOWER(tickets.description) LIKE ?', [$like])
                  ->orWhereRaw("LOWER(CONCAT(requester.first_name, ' ', requester.last_name)) LIKE ?", [$like])
                  ->orWhereRaw("LOWER(CONCAT(assignee.first_name, ' ', assignee.last_name)) LIKE ?", [$like]);
            });
        }

        $tickets = $query->orderBy('tickets.created_at', 'desc')->get();

        return Inertia::render('Admin/AllTickets', [
            'tickets' => $tickets,
            'flash' => session('success') ? ['success' => session('success')] : (session('error') ? ['error' => session('error')] : null)
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject'     => 'required|string|max:255',
            'description' => 'required|string',
            'priority'    => 'required|in:low,medium,high',
            'team'        => 'nullable|string|in:Support,Technical,Billing,Sales',
        ]);

        $adminId = Auth::id();

        $exists = DB::table('tickets')
            ->where('requester_id', $adminId)
            ->whereNull('deleted_at')
            ->where(function ($q) use ($request) {
                $q->whereRaw('LOWER(subject) = ?', [strtolower($request->subject)])
                  ->orWhereRaw('LOWER(description) = ?', [strtolower($request->description)]);
            })
            ->exists();

        if ($exists) {
            return back()->with('error', 'A ticket with similar subject or description already exists.');
        }

        DB::table('tickets')->insert([
            'subject'       => $request->subject,
            'description'   => $request->description,
            'priority'      => $request->priority,
            'team'          => $request->team ?? 'Support',
            'requester_id'  => $adminId,
            'status'        => 'pending',
            'assignee_id'   => null,
            'assigned_to'   => '',           // ← NOT NULL → use empty string
            'created_at'    => now(),
        ]);

        return back()->with('success', 'New ticket created successfully!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'subject'     => 'required|string|max:255',
            'description' => 'required|string',
            'priority'    => 'required|in:low,medium,high',
            'team'        => 'nullable|string|in:Support,Technical,Billing,Sales',
        ]);

        $adminId = Auth::id();

        $exists = DB::table('tickets')
            ->where('requester_id', $adminId)
            ->where('id', '!=', $id)
            ->whereNull('deleted_at')
            ->where(function ($q) use ($request) {
                $q->whereRaw('LOWER(subject) = ?', [strtolower($request->subject)])
                  ->orWhereRaw('LOWER(description) = ?', [strtolower($request->description)]);
            })
            ->exists();

        if ($exists) {
            return back()->with('error', 'A ticket with similar subject or description already exists.');
        }

        DB::table('tickets')
            ->where('id', $id)
            ->update([
                'subject'     => $request->subject,
                'description' => $request->description,
                'priority'    => $request->priority,
                'team'        => $request->team ?? 'Support',
                'status'      => 'pending',
                'assignee_id' => null,
                'assigned_to' => '',  // ← NOT NULL → empty string
            ]);

        return back()->with('success', 'Ticket updated successfully!');
    }

    public function unassign($id)
    {
        $affected = DB::table('tickets')
            ->where('id', $id)
            ->whereNotNull('assignee_id')
            ->update([
                'assignee_id' => null,
                'assigned_to' => '',  // ← NOT NULL → empty string
                'assigned_at' => null,
            ]);

        return $affected
            ? back()->with('success', 'Ticket successfully unassigned!')
            : back()->with('error', 'This ticket is already unassigned!');
    }

    public function delete($id)
    {
        DB::table('tickets')
            ->where('id', $id)
            ->update(['deleted_at' => now()]);

        return back()->with('success', 'Ticket deleted successfully!');
    }
}

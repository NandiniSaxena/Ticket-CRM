<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssignTicketController extends Controller
{
    public function index(Request $request)
    {
        if (auth()->user()->role !== 'Admin') {
            abort(403);
        }

        $teamFilter = $request->get('team', '');

        // Unassigned tickets
        $tickets = DB::table('tickets')
            ->leftJoin('users as u', 'tickets.requester_id', '=', 'u.id')
            ->select('tickets.*', 'u.first_name as req_first', 'u.last_name as req_last')
            ->whereNull('tickets.assignee_id')
            ->whereNull('tickets.deleted_at')
            ->when($teamFilter, fn($q) => $q->where('tickets.team', $teamFilter))
            ->orderByRaw("CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END")
            ->orderByDesc('tickets.created_at')
            ->get();

        // Assignees with current load
        $assignees = DB::table('users')
            ->leftJoin('tickets', function ($join) {
                $join->on('users.id', '=', 'tickets.assignee_id')
                     ->whereIn('tickets.status', ['pending', 'inprogress'])
                     ->whereNull('tickets.deleted_at');
            })
            ->where('users.role', 'Assignee')
            ->when($teamFilter, fn($q) => $q->where('users.department', $teamFilter))
            ->select('users.id', 'users.first_name', 'users.last_name', 'users.department as team')
            ->selectRaw('COUNT(tickets.id) as current_load')
            ->groupBy('users.id', 'users.first_name', 'users.last_name', 'users.department')
            ->orderBy('team')
            ->orderBy('current_load')
            ->get();

        return Inertia::render('Admin/AssignTickets', [
            'tickets' => $tickets,
            'assignees' => $assignees,
            'teamFilter' => $teamFilter,
        ]);
    }

    public function assign(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'assignee_id' => 'required|exists:users,id',
        ]);

        $ticket = DB::table('tickets')->where('id', $request->ticket_id)->first();
        $assignee = DB::table('users')->where('id', $request->assignee_id)->first();

        if (!$ticket) {
            return back()->with('error', 'Ticket not found.');
        }

        if ($ticket->assignee_id !== null) {
            return back()->with('error', 'Ticket is already assigned.');
        }

        $ticketTeam = $ticket->team ?? '';
        $assigneeDept = $assignee->department ?? '';

        if ($ticketTeam && $assigneeDept && $ticketTeam !== $assigneeDept) {
            return back()->with('error', "Cannot assign: Ticket team ($ticketTeam) does not match assignee department ($assigneeDept)");
        }

        DB::table('tickets')
            ->where('id', $request->ticket_id)
            ->update([
                'assignee_id' => $request->assignee_id,
                'assigned_at' => now(),
            ]);

        return back()->with('success', 'Ticket assigned successfully!');
    }
}

<?php

namespace App\Http\Controllers\Assignee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $assigneeId = $user->id;

        // Stats
        $stats = [
            'total'      => DB::table('tickets')->where('assignee_id', $assigneeId)->whereNull('deleted_at')->count(),
            'inprogress' => DB::table('tickets')->where('assignee_id', $assigneeId)->where('status', 'inprogress')->whereNull('deleted_at')->count(),
            'pending'    => DB::table('tickets')->where('assignee_id', $assigneeId)->where('status', 'pending')->whereNull('deleted_at')->count(),
            'onhold'     => DB::table('tickets')->where('assignee_id', $assigneeId)->where('status', 'onhold')->whereNull('deleted_at')->count(),
            'completed'  => DB::table('tickets')->where('assignee_id', $assigneeId)->where('status', 'completed')->whereNull('deleted_at')->count(),
        ];
        $stats['waiting'] = $stats['pending'] + $stats['onhold'];

        // Recent tickets
        $recentTickets = DB::table('tickets as t')
            ->leftJoin('users as u', 't.requester_id', '=', 'u.id')
            ->where('t.assignee_id', $assigneeId)
            ->whereNull('t.deleted_at')
            ->select('t.*', 'u.first_name as req_first', 'u.last_name as req_last')
            ->orderByDesc('t.created_at')
            ->limit(5)
            ->get();

        return Inertia::render('Assignee/Dashboard', [
            'stats' => $stats,
            'recentTickets' => $recentTickets,
        ]);
    }

    public function updateStatus(Request $request, $ticketId)
    {
        $request->validate([
        'status' => 'required|in:pending,inprogress,onhold,completed'
    ]);

        DB::table('tickets')
            ->where('id', $ticketId)
            ->where('assignee_id', auth()->id())
            ->update(['status' => $request->status]);

        return back()->with('success', 'Status updated successfully!');
    }
}

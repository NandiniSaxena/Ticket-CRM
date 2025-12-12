<?php

namespace App\Http\Controllers\Assignee;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OnHoldController extends Controller
{
   // app/Http/Controllers/Assignee/OnHoldController.php

public function index()
{
    $user = auth()->user();
    if ($user->role !== 'Assignee') {
        return redirect()->route('login');
    }

    $assigneeId = $user->id;

    // === GET ALL COUNTS ===
    $total = DB::table('tickets')->where('assignee_id', $assigneeId)->whereNull('deleted_at')->count();
    $inprogress = DB::table('tickets')->where('assignee_id', $assigneeId)->where('status', 'inprogress')->whereNull('deleted_at')->count();
    $pending = DB::table('tickets')->where('assignee_id', $assigneeId)->where('status', 'pending')->whereNull('deleted_at')->count();
    $onhold = DB::table('tickets')->where('assignee_id', $assigneeId)->where('status', 'onhold')->whereNull('deleted_at')->count();
    $completed = DB::table('tickets')->where('assignee_id', $assigneeId)->where('status', 'completed')->whereNull('deleted_at')->count();

    $stats = [
        'total' => $total,
        'inprogress' => $inprogress,
        'pending' => $pending,
        'onhold' => $onhold,
        'completed' => $completed,
        'waiting' => $pending + $onhold,
    ];

    // === GET ON HOLD TICKETS ===
    $tickets = DB::table('tickets as t')
        ->leftJoin('users as u', 't.requester_id', '=', 'u.id')
        ->where('t.assignee_id', $assigneeId)
        ->where('t.status', 'onhold')
        ->whereNull('t.deleted_at')
        ->select('t.*', 'u.first_name as req_first', 'u.last_name as req_last')
        ->orderByDesc('t.created_at')
        ->get();

    return Inertia::render('Assignee/OnHold', [
        'tickets' => $tickets,
        'stats' => $stats,   // This is what was missing!
    ]);
}
}

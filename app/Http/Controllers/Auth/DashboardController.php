<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->role === 'Admin') {
            return redirect()->route('admin.dashboard');
        }

        $userId = $user->id;

        // Ticket Stats
        $totalTickets = DB::table('tickets')
            ->where('requester_id', $userId)
            ->whereNull('deleted_at')
            ->count();

        $openTickets = DB::table('tickets')
            ->where('requester_id', $userId)
            ->whereIn('status', ['inprogress', 'pending', 'onhold'])
            ->whereNull('deleted_at')
            ->count();

        $closedTickets = DB::table('tickets')
            ->where('requester_id', $userId)
            ->where('status', 'completed')
            ->whereNull('deleted_at')
            ->count();

        $pendingTickets = DB::table('tickets')
            ->where('requester_id', $userId)
            ->where('status', 'pending')
            ->whereNull('deleted_at')
            ->count();

        // Recent Tickets
        $recentTickets = DB::table('tickets')
            ->select('id', 'subject', 'description', 'status', 'priority', 'team', 'created_at')
            ->where('requester_id', $userId)
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('User/Dashboard', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->first_name . ' ' . $user->last_name,
                    'email' => $user->email,
                ]
            ],
            'stats' => [
                'total' => $totalTickets,
                'open' => $openTickets,
                'closed' => $closedTickets,
                'pending' => $pendingTickets,
            ],
            'recentTickets' => $recentTickets,
        ]);
    }
}

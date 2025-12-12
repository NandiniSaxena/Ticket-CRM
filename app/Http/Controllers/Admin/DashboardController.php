<?php

// namespace App\Http\Controllers\Admin;

// use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\DB;
// use Inertia\Inertia;

// class DashboardController extends Controller
// {
//     public function __construct()
//     {
//         // Force authentication + role check in one place (no extra middleware file)
//         $this->middleware('auth');
//         $this->middleware(function ($request, $next) {
//             if (auth()->user()->role !== 'Admin') {
//                 // If not Admin → kick them out
//                 return redirect('/dashboard')->with('error', 'Access denied. Admins only.');
//             }
//             return $next($request);
//         });
//     }

//     /**
//      * Show Admin Dashboard
//      */
//     public function adminDashboard()
//     {
//         // Exactly same queries as your old PHP file
//         $total_users = DB::table('users')
//             ->where('role', 'User')
//             ->count();

//         $total_assignees = DB::table('users')
//             ->where('role', 'Assignee')
//             ->count();

//         $total_admins = DB::table('users')
//             ->where('role', 'Admin')
//             ->count();

//         $total_tickets = DB::table('tickets')
//             ->whereNull('deleted_at')
//             ->count();

//         $open_tickets = DB::table('tickets')
//             ->whereIn('status', ['open', 'pending', 'inprogress'])
//             ->whereNull('deleted_at')
//             ->count();

//         $unassigned_tickets = DB::table('tickets')
//             ->whereNull('assignee_id')
//             ->whereNull('deleted_at')
//             ->count();

//         return Inertia::render('Admin/Dashboard', [
//             'stats' => [
//                 'total_users'         => $total_users,
//                 'total_assignees'     => $total_assignees,
//                 'total_admins'        => $total_admins,
//                 'total_tickets'       => $total_tickets,
//                 'open_tickets'        => $open_tickets,
//                 'unassigned_tickets'  => $unassigned_tickets,
//             ]
//         ]);
//     }
// }



namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function adminDashboard()
    {
        if (auth()->user()->role !== 'Admin') {
            abort(403);
        }

        $stats = [
            'total_users'         => DB::table('users')->where('role', 'User')->count(),
            'total_assignees'     => DB::table('users')->where('role', 'Assignee')->count(),
            'total_admins'        => DB::table('users')->where('role', 'Admin')->count(),
            'total_tickets'       => DB::table('tickets')->whereNull('deleted_at')->count(),
            'open_tickets'        => DB::table('tickets')
                ->whereIn('status', ['open', 'pending', 'inprogress'])
                ->whereNull('deleted_at')
                ->count(),
            'unassigned_tickets'  => DB::table('tickets')
                ->whereNull('assignee_id')
                ->whereNull('deleted_at')
                ->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}

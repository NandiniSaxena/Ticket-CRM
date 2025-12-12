<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UnassignedController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $tickets = DB::table('tickets')
            ->where('requester_id', $userId)
            ->whereNull('assignee_id')
            ->whereNull('deleted_at')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render("User/Unassigned", [
            "auth" => ["user" => $request->user()],
            "tickets" => $tickets,
        ]);
    }
}

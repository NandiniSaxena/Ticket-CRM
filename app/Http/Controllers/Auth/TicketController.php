<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function create()
    {
        // You can pass any props, but auth.user is available by default.
        return Inertia::render('User/CreateTicket');
    }

   public function store(Request $request)
{
    $request->validate([
        'subject' => 'required|string|max:255',
        'description' => 'required|string',
        'priority' => 'nullable|in:low,medium,high',
        'team' => 'nullable|string|max:50',
    ]);

    $userId = $request->user()->id;

    // Check for duplicate ticket by same user
    $duplicate = DB::table('tickets')
        ->where('requester_id', $userId)
        ->where(function ($query) use ($request) {
            $query->where('subject', $request->subject)
                  ->orWhere('description', $request->description);
        })
        ->exists();

    if ($duplicate) {
        return redirect()->back()->with('error', 'We cannot create the ticket with same subject or description.');
    }

    $ticketId = DB::table('tickets')->insertGetId([
        'subject' => $request->subject,
        'description' => $request->description,
        'priority' => $request->priority ?: 'medium',
        'team' => $request->team ?: 'Support',
        'requester_id' => $userId,
        'status' => 'pending',
        'assigned_to' => '',
        'created_at' => now(),
    ]);

    return redirect()->back()->with('success', "Ticket created successfully! ID: #{$ticketId}");
}

// public function allTickets()
// {
//     $tickets = DB::table('tickets')
//         ->orderBy('created_at', 'desc')
//         ->get();

//     return Inertia::render('User/AllTickets', [
//         'tickets' => $tickets
//     ]);
// }


public function allTickets()
{
    $tickets = DB::table('tickets')
        ->where('requester_id', auth()->id())
        ->orWhere('assigned_to', auth()->id())
        ->orderByDesc('created_at')
        ->get();

    // Get unique teams from DB
    $teams = DB::table('tickets')->distinct()->pluck('team')->filter()->values();

    return Inertia::render('User/AllTickets', [
        'tickets' => $tickets,
        'teams'   => $teams->count() > 0 ? $teams : ['Support', 'Technical', 'Billing','Sales'],
    ]);
}
// public function update(Request $request, $id)
// {
//     $request->validate([
//         'subject' => 'required|string|max:255',
//         'description' => 'required|string',
//         'priority' => 'nullable|in:low,medium,high',
//         'team' => 'nullable|string|max:50',
//         'status' => 'required|in:pending,inprogress,onhold,completed',
//     ]);

//     DB::table('tickets')->where('id', $id)->update([
//         'subject' => $request->subject,
//         'description' => $request->description,
//         'priority' => $request->priority,
//         'team' => $request->team,
//         'status' => $request->status,
//         'updated_at' => now(),
//     ]);

//     return redirect()->back()->with('success', 'Ticket updated successfully.');
// }



// public function delete($id)
// {
//     DB::table('tickets')->where('id', $id)->delete();

//     return redirect()->back()->with('success', 'Ticket deleted successfully.');
// }


public function update(Request $request, $id)
{
    $request->validate([
        'subject'     => 'required|string|max:255',
        'description' => 'required|string',
        'priority'    => 'required|in:low,medium,high',
        'team'        => 'required|in:Support,Technical,Billing,Sales', // ← THIS WAS MISSING!
    ]);

    $updated = DB::table('tickets')
        ->where('id', $id)
        ->where('requester_id', auth()->id()) // Security: only owner can edit
        ->update([
            'subject'     => $request->subject,
            'description' => $request->description,
            'priority'    => $request->priority,
            'team'        => $request->team,
            //'updated_at'  => now(),
        ]);

    if ($updated) {
        return back()->with('success', 'Ticket updated successfully!');
    } else {
        return back()->with('error', 'Failed to update ticket or no changes made.');
    }
}
public function delete($id)
{
    DB::table('tickets')->where('id', $id)->delete();
    return back()->with('success', 'Ticket deleted successfully!');
}

public function pending(Request $request)
{
    $userId = $request->user()->id;

    // Fetch pending tickets
    $tickets = DB::table('tickets')
        ->where('requester_id', $userId)
        ->where('status', 'pending')
        ->whereNull('deleted_at')
        ->orderByDesc('created_at')
        ->get();

    return Inertia::render('User/Pending', [
        'tickets' => $tickets,
        'user' => $request->user(),
    ]);
}

}

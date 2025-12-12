<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function index()
    {
        $users = DB::table('users')
            ->leftJoin('tickets', function ($join) {
                $join->on('users.id', '=', 'tickets.requester_id')
                     ->whereNull('tickets.deleted_at');
            })
            ->where('users.role', 'User')
            ->select('users.*')
            ->selectRaw('COUNT(tickets.id) as total_tickets')
            ->groupBy('users.id')
            ->orderByDesc('users.created_at')
            ->get();

        return Inertia::render('Admin/ManageUsers', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'nullable|string|min:6',
        ]);

        $password = $request->password ?: Str::random(10);

        DB::table('users')->insert([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($password),
            'role'       => 'User',
            'created_at' => now(),
        ]);

        return back()->with('success', "User added! Password: <strong>$password</strong>");
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email,' . $id,
        ]);

        DB::table('users')
            ->where('id', $id)
            ->where('role', 'User')
            ->update([
                'first_name' => $request->first_name,
                'last_name'  => $request->last_name,
                'email'      => $request->email,
            ]);

        return back()->with('success', 'User updated successfully!');
    }

    public function password(Request $request, $id)
    {
        $request->validate([
            'new_password' => 'required|string|min:6',
        ]);

        DB::table('users')
            ->where('id', $id)
            ->update(['password' => Hash::make($request->new_password)]);

        return back()->with('success', 'Password changed successfully!');
    }

    public function destroy($id)
    {
        if ($id == auth()->id()) {
            return back()->with('error', 'You cannot delete yourself!');
        }

        DB::table('tickets')->where('requester_id', $id)->delete();
        DB::table('users')->where('id', $id)->where('role', 'User')->delete();

        return back()->with('success', 'User and all their tickets deleted.');
    }
}

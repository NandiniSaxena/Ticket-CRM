<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function manage()
    {
        $admins = DB::table('users')->where('role', 'Admin')->orderByDesc('created_at')->get();
        $nonAdmins = DB::table('users')->whereIn('role', ['User', 'Assignee'])->orderBy('first_name')->get();

        return Inertia::render('Admin/ManageAdmins', [
            'admins' => $admins,
            'nonAdmins' => $nonAdmins,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required',
            'last_name'  => 'required',
            'email'      => 'required|email|unique:users',
            'password'   => 'nullable|min:6',
        ]);

        $password = $request->password ?: Str::random(10);

        DB::table('users')->insert([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($password),
            'role'       => 'Admin',
            'created_at' => now(),
        ]);

        return back()->with('success', "New Administrator created!<br>Name: <strong>{$request->first_name} {$request->last_name}</strong><br>Email: <strong>{$request->email}</strong><br>Password: <strong>$password</strong>");
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'first_name' => 'required',
            'last_name'  => 'required',
            'email'      => 'required|email|unique:users,email,' . $id,
        ]);

        DB::table('users')->where('id', $id)->where('role', 'Admin')->update([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
        ]);

        return back()->with('success', 'Admin profile updated!');
    }

    public function password(Request $request, $id)
    {
        $request->validate(['new_password' => 'required|min:min6']);
        DB::table('users')->where('id', $id)->update(['password' => Hash::make($request->new_password)]);
        return back()->with('success', 'Password changed successfully!');
    }

    public function promote($id)
    {
        $affected = DB::table('users')
            ->where('id', $id)
            ->where('role', '!=', 'Admin')
            ->update(['role' => 'Admin', 'department' => null]);

        if ($affected) {
            DB::table('tickets')->where('requester_id', $id)->delete();
            return back()->with('success', 'User promoted to Administrator and tickets deleted!');
        }
        return back()->with('error', 'User not found or already admin.');
    }

    public function demote($id)
    {
        if ($id == auth()->id()) {
            return back()->with('error', 'You cannot remove your own admin rights!');
        }

        DB::table('users')->where('id', $id)->where('role', 'Admin')->update(['role' => 'User']);
        return back()->with('success', 'Admin rights removed successfully.');
    }

    public function destroy($id)
    {
        if ($id == auth()->id()) {
            return back()->with('error', 'You cannot delete yourself!');
        }

        DB::table('users')->where('id', $id)->where('role', 'Admin')->delete();
        return back()->with('success', 'Administrator deleted permanently.');
    }
}

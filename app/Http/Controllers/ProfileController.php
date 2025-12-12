<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('User/Profile');
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email,'.$user->id,
            'password'   => 'nullable|min:6|confirmed',
        ]);

        $user->first_name = $validated['first_name'];
        $user->last_name  = $validated['last_name'];
        $user->email      = $validated['email'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return back()->with('message', '<div class="alert alert-success">
            <i class="bi bi-check-circle"></i> Profile updated successfully!
        </div>');
    }
}

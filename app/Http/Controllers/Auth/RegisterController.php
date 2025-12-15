<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class RegisterController extends Controller
{
    public function show()
    {
        return Inertia::render("Register");
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "first_name" => "required|string|max:255",
            "last_name"  => "required|string|max:255",
            "email"      => "required|email|unique:users,email|max:255",
            "password"   => "required|min:6",
        ], [
            'email.unique' => 'This email is already registered. Please use a different email.',
            'email.email'  => 'Please enter a valid email address.',
            'password.min' => 'Password must be at least 6 characters long.',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => 'User',
        ]);

        auth()->login($user);

        return redirect('/dashboard')->with('success', 'Account created successfully! Welcome!');
    }
}

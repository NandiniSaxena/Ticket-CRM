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
        $data = $request->validate([
            "first_name" => "required|string",
            "last_name"  => "required|string",
            "email"      => "required|email|unique:users",
            "password"   => "required|min:6",
        ]);
        $user = User::create([
    'first_name' => $request->first_name,
    'last_name'  => $request->last_name ?? '',
    'email'      => $request->email,
    'password'   => Hash::make($request->password),
    'role'       => 'User',
]);

        auth()->login($user);

        return redirect('/dashboard');
    }
}

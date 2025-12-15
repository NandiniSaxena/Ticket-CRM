<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function show()
    {
        return Inertia::render("Login");
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            "email"    => "required|email",
            "password" => "required",
        ]);

        if (Auth::attempt($credentials, $request->filled('remember'))) {
            $request->session()->regenerate();

            $user = Auth::user();
            $role = $user->role;

            // Redirect based on role
            return match ($role) {
                'Admin'    => redirect('/admin/dashboard'),
                'Assignee' => redirect('/assignee/dashboard'),
                'User'     => redirect('/dashboard'),
                default    => redirect('/dashboard'),
            };
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

   public function logout(Request $request)
{
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/')->withHeaders([
        'Cache-Control' => 'no-cache, no-store, max-age=0, must-revalidate, private',
        'Pragma' => 'no-cache',
        'Expires' => 'Sat, 01 Jan 2000 00:00:00 GMT',
    ]);

}
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function index()
    {
        return inertia('Admin/Profile');
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'first_name' => 'required|regex:/^[a-zA-Z ]+$/',
            'last_name'  => 'required|regex:/^[a-zA-Z ]+$/',
            'email'      => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password'   => 'nullable|min:6|confirmed',
        ]);

        $data = [
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return back()->with('success', 'Profile updated successfully!');
    }
}

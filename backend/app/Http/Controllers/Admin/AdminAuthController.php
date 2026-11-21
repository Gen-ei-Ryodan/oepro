<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function loginForm()
    {
        if (session('admin_logged_in')) {
            return redirect()->route('admin.produk.index');
        }
        return view('admin.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return back()->withErrors(['email' => 'Email atau password salah.'])->withInput();
        }

        session([
            'admin_logged_in' => true,
            'admin_user'      => $user->name,
        ]);

        return redirect()->route('admin.produk.index')->with('success', 'Selamat datang, ' . $user->name . '!');
    }

    public function logout(Request $request)
    {
        $request->session()->forget(['admin_logged_in', 'admin_user']);
        return redirect()->route('admin.login')->with('success', 'Anda telah berhasil logout.');
    }
}

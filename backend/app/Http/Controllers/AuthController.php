<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validate request - accept either email or username
        $request->validate([
            'email' => 'sometimes|email',
            'username' => 'sometimes|string',
            'password' => 'required'
        ]);

        $identifier = $request->input('email') ?? $request->input('username');

        // Map 'admin' username to email
        if ($identifier === 'admin') {
            $identifier = 'admin@oepro.com';
        }

        // Determine if identifier is email or username
        $field = filter_var($identifier, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $credentials = [
            $field => $identifier,
            'password' => $request->input('password')
        ];

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('authToken')->plainTextToken;
            return response()->json(['token' => $token, 'user' => $user], 200);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}

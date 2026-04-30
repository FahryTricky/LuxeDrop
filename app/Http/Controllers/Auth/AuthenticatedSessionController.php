<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\TabSession;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Create a tab session if tab_id is provided
        $tabId = $request->header('X-Tab-Id') ?? $request->input('tab_id');
        if ($tabId) {
            TabSession::updateOrCreate(
                ['tab_id' => $tabId],
                ['user_id' => Auth::id(), 'last_activity' => now()]
            );
        }

        // Clean up old stale sessions
        TabSession::cleanStale();

        return redirect()->intended('/');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Remove the tab session for this tab
        $tabId = $request->header('X-Tab-Id') ?? $request->input('tab_id');
        if ($tabId) {
            TabSession::where('tab_id', $tabId)->delete();
        }

        // Check if there are any remaining tab sessions for this user
        $userId = Auth::id();
        $remainingSessions = TabSession::where('user_id', $userId)->count();

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}

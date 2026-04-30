<?php

namespace App\Http\Middleware;

use App\Models\TabSession;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ResolveTabSession
{
    /**
     * Resolve which user to authenticate based on the X-Tab-Id header.
     * Each browser tab can have its own independent session.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tabId = $request->header('X-Tab-Id');

        if ($tabId) {
            $tabSession = TabSession::where('tab_id', $tabId)->first();

            if ($tabSession) {
                // Authenticate the user for this request only (non-persistent)
                Auth::onceUsingId($tabSession->user_id);

                // Update last activity timestamp
                $tabSession->update(['last_activity' => now()]);
            } else {
                // Tab ID exists but no session found — user is not logged in for this tab
                Auth::logout();
            }
        }
        // If no X-Tab-Id header, fall back to normal Laravel session auth

        return $next($request);
    }
}

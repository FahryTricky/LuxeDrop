<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $wsToken = null;
        if ($request->user()) {
            $payload = [
                'sub' => $request->user()->id,
                'name' => $request->user()->name,
                'iat' => time(),
                'exp' => time() + (60 * 60 * 24) // 24 hours
            ];
            $wsToken = \Firebase\JWT\JWT::encode($payload, env('JWT_SECRET', 'fallback_dev_secret_must_be_32_chars_long'), 'HS256');
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'wsToken' => $wsToken,
                'flash' => [
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                ],
            ],
        ];
    }
}

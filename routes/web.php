<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\VehicleController;
use App\Http\Controllers\User\BrowseController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $recentVehicles = \App\Models\Vehicle::latest()->take(3)->get();
    $totalUsers = \App\Models\User::where('role', 'user')->count();
    $totalVehicles = \App\Models\Vehicle::count();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'recentVehicles' => $recentVehicles,
        'totalUsers' => $totalUsers,
        'totalVehicles' => $totalVehicles,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        if (auth()->user()->role === 'admin') {
            return redirect()->route('admin.vehicles.index');
        }
        return redirect()->route('browse.index');
    })->name('dashboard');

    Route::get('/browse', [\App\Http\Controllers\User\BrowseController::class, 'index'])->name('browse.index');

    Route::get('/checkout/{vehicle}', [\App\Http\Controllers\User\CheckoutController::class, 'show'])->name('checkout.show');
    Route::post('/checkout/{vehicle}', [\App\Http\Controllers\User\CheckoutController::class, 'store'])->name('checkout.store');

    Route::get('/transactions', [\App\Http\Controllers\User\TransactionController::class, 'index'])->name('transactions.index');

    // Admin Routes
    Route::middleware([\App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
        Route::resource('vehicles', VehicleController::class);
        Route::patch('vehicles/{vehicle}/set-available', [VehicleController::class, 'setAvailable'])->name('vehicles.setAvailable');
        Route::resource('transactions', \App\Http\Controllers\Admin\TransactionController::class)->only(['index', 'update']);
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

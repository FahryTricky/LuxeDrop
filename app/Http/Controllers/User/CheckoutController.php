<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function show(Vehicle $vehicle)
    {
        // Block admin from renting
        if (auth()->user()->role === 'admin') {
            return redirect()->route('browse.index')->with('error', 'Admin tidak dapat melakukan penyewaan kendaraan.');
        }

        // Check if vehicle is already rented
        if (!$vehicle->is_available) {
            return redirect()->route('browse.index')->with('error', 'Maaf, unit ini sedang disewa oleh pelanggan lain.');
        }

        // Check active rentals limit
        $activeRentals = Transaction::where('user_id', auth()->id())
            ->whereNotIn('status', ['pengiriman_selesai', 'dikembalikan'])
            ->count();

        if ($activeRentals >= 2) {
            return redirect()->route('browse.index')->with('error', 'Wah, koleksi garasi Anda sudah penuh (Maksimal 2 unit aktif). Selesaikan transaksi sebelumnya dulu ya sebelum menjemput unit premium lainnya!');
        }

        return Inertia::render('User/Checkout', [
            'vehicle' => $vehicle
        ]);
    }

    public function store(Request $request, Vehicle $vehicle)
    {
        // Block admin
        if (auth()->user()->role === 'admin') {
            return redirect()->route('browse.index')->with('error', 'Admin tidak dapat melakukan penyewaan kendaraan.');
        }

        // Re-check availability (race condition guard)
        if (!$vehicle->is_available) {
            return redirect()->route('browse.index')->with('error', 'Maaf, unit ini baru saja disewa oleh pelanggan lain.');
        }

        // Check active rentals again
        $activeRentals = Transaction::where('user_id', auth()->id())
            ->whereNotIn('status', ['pengiriman_selesai', 'dikembalikan'])
            ->count();

        if ($activeRentals >= 2) {
            return redirect()->route('browse.index')->with('error', 'Wah, koleksi garasi Anda sudah penuh (Maksimal 2 unit aktif). Selesaikan transaksi sebelumnya dulu ya sebelum menjemput unit premium lainnya!');
        }

        $validated = $request->validate([
            'user_name'        => 'required|string|max:255',
            'user_age'         => 'required|integer|min:18',
            'user_email'       => 'required|email',
            'delivery_address' => 'required|string',
            'duration_days'    => 'required|integer|min:1|max:5',
            'towing_price'     => 'required|numeric',
        ]);

        $basePrice  = $vehicle->daily_price * $validated['duration_days'];
        $totalPrice = $basePrice + $validated['towing_price'];

        Transaction::create([
            'user_id'          => auth()->id(),
            'vehicle_id'       => $vehicle->id,
            'status'           => 'pengecekan_mobil',
            'duration_days'    => $validated['duration_days'],
            'total_price'      => $totalPrice,
            'user_name'        => $validated['user_name'],
            'user_age'         => $validated['user_age'],
            'user_email'       => $validated['user_email'],
            'delivery_address' => $validated['delivery_address'],
            'towing_price'     => $validated['towing_price'],
            'penalty_price'    => 0,
        ]);

        // Mark vehicle as unavailable until admin resets it
        $vehicle->update(['is_available' => false]);

        return redirect()->route('transactions.index')->with('success', 'Pesanan berhasil dikonfirmasi. Unit sedang dalam proses pengecekan.');
    }
}

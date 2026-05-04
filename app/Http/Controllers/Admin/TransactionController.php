<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with(['user', 'vehicle'])->latest()->paginate(10);
        return Inertia::render('Admin/Transactions/Index', [
            'transactions' => $transactions
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'status' => 'required|in:pengecekan_mobil,menunggu_towing,proses_pengiriman,pengiriman_selesai,dikembalikan',
        ]);

        $transaction->update($validated);
        
        return redirect()->back()->with('success', 'Status transaksi berhasil diperbarui.');
    }

    public function updateDates(Request $request, Transaction $transaction)
    {
        $validated = $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after:start_date',
        ]);

        $start = Carbon::parse($validated['start_date']);
        $end   = Carbon::parse($validated['end_date']);

        // Hitung otomatis durasi hari dari selisih tanggal
        $durationDays = $start->diffInDays($end);

        if ($durationDays > 5) {
            return redirect()->back()->withErrors(['end_date' => 'Durasi sewa maksimal adalah 5 hari.']);
        }

        // Hitung ulang harga secara realtime
        $basePrice = $transaction->vehicle->daily_price * $durationDays;
        $totalPrice = $basePrice + $transaction->towing_price;

        $transaction->update([
            'start_date'    => $start,
            'end_date'      => $end,
            'duration_days' => $durationDays,
            'base_price'    => $basePrice,
            'total_price'   => $totalPrice,
        ]);

        return redirect()->back()->with('success', 'Tanggal sewa berhasil diperbarui.');
    }
}

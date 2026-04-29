<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            'status' => 'required|in:pengecekan_mobil,menunggu_towing,proses_pengiriman,pengiriman_selesai',
        ]);

        $transaction->update($validated);
        
        return redirect()->back()->with('success', 'Status transaksi berhasil diperbarui.');
    }
}

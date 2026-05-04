<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrowseController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehicle::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('type') && in_array($request->type, ['supercar', 'luxury_car', 'exclusive_two_wheelers'])) {
            $query->where('type', $request->type);
        }

        if ($request->filled('sort')) {
            $direction = $request->sort === 'asc' ? 'asc' : 'desc';
            $query->orderBy('daily_price', $direction);
        } else {
            $query->latest();
        }

        $vehicles = $query->with(['transactions' => function($q) {
            $q->latest();
        }])->paginate(12)->withQueryString();

        $vehicles->getCollection()->transform(function ($vehicle) {
            if (!$vehicle->is_available && $vehicle->transactions->isNotEmpty()) {
                $activeTransaction = $vehicle->transactions->first();
                
                // Gunakan end_date dari database (jika ada), jika tidak fallback ke cara lama
                $endDate = $activeTransaction->end_date ?? $activeTransaction->created_at->addDays($activeTransaction->duration_days);
                
                // Cek apakah hari ini sudah melebihi atau sama dengan batas tanggal pengembalian
                if (now()->startOfDay()->greaterThanOrEqualTo($endDate->startOfDay())) {
                    // Otomatis mengubah status di database menjadi tersedia kembali
                    $vehicle->update(['is_available' => true]);
                    
                    // Update juga data yang akan dikirim ke layar (React)
                    $vehicle->is_available = true;
                    $vehicle->available_in_days = null;
                } else {
                    // Masih dalam masa sewa
                    $daysRemaining = now()->startOfDay()->diffInDays($endDate->startOfDay(), false);
                    $vehicle->available_in_days = max(1, (int)$daysRemaining);
                }
            } else {
                $vehicle->available_in_days = null;
            }
            
            unset($vehicle->transactions);
            return $vehicle;
        });

        $filters = $request->only(['search', 'type', 'sort']);
        
        return Inertia::render('Browse/Index', [
            'vehicles' => $vehicles,
            'filters' => empty($filters) ? (object)[] : $filters
        ]);
    }
}

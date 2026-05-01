<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::latest()->paginate(10);

        $totalUnits    = Vehicle::count();
        $activeRentals = Transaction::where('status', '!=', 'dikembalikan')->count();
        $weeklyRevenue = Transaction::where('created_at', '>=', Carbon::now()->startOfWeek())
            ->sum('total_price');

        return Inertia::render('Admin/Vehicles/Index', [
            'vehicles'      => $vehicles,
            'totalUnits'    => $totalUnits,
            'activeRentals' => $activeRentals,
            'weeklyRevenue' => $weeklyRevenue,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Vehicles/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'unit_code'  => 'required|string|max:50|unique:vehicles,unit_code',
            'name'       => 'required|string|max:255',
            'type'       => 'required|in:supercar,luxury_car,exclusive_two_wheelers',
            'top_speed'  => 'required|string',
            'year'       => 'required|integer',
            'daily_price'=> 'required|numeric|min:0',
            'image_url'  => 'nullable|url|max:2048',
        ]);

        Vehicle::create($validated);
        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle created successfully.');
    }

    public function edit(Vehicle $vehicle)
    {
        return Inertia::render('Admin/Vehicles/Edit', ['vehicle' => $vehicle]);
    }

    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'unit_code'  => 'required|string|max:50|unique:vehicles,unit_code,' . $vehicle->id,
            'name'       => 'required|string|max:255',
            'type'       => 'required|in:supercar,luxury_car,exclusive_two_wheelers',
            'top_speed'  => 'required|string',
            'year'       => 'required|integer',
            'daily_price'=> 'required|numeric|min:0',
            'image_url'  => 'nullable|url|max:2048',
        ]);

        $vehicle->update($validated);
        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle deleted successfully.');
    }

    /**
     * Mark a vehicle as available again (admin resets after return).
     * Only allowed when the vehicle's active transaction is already 'dikembalikan'.
     */
    public function setAvailable(Vehicle $vehicle)
    {
        // Find the most recent non-returned transaction for this vehicle
        $activeTransaction = Transaction::where('vehicle_id', $vehicle->id)
            ->where('status', '!=', 'dikembalikan')
            ->latest()
            ->first();

        if ($activeTransaction) {
            $statusLabel = match($activeTransaction->status) {
                'pengecekan_mobil'  => 'Pengecekan Mobil',
                'menunggu_towing'   => 'Menunggu Towing',
                'proses_pengiriman' => 'Proses Pengiriman',
                'pengiriman_selesai'=> 'Pengiriman Selesai',
                default             => $activeTransaction->status,
            };

            return redirect()->route('admin.vehicles.index')
                ->with('error', "Tidak dapat mengembalikan unit \"{$vehicle->name}\" ke koleksi. Status transaksi saat ini masih \"{$statusLabel}\". Ubah status transaksi menjadi \"Dikembalikan\" terlebih dahulu melalui halaman Transaksi.");
        }

        $vehicle->update(['is_available' => true]);

        return redirect()->route('admin.vehicles.index')
            ->with('success', "Unit \"{$vehicle->name}\" telah ditandai sebagai tersedia kembali.");
    }
}

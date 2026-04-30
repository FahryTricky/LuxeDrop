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

        // KPI 1: Total unit count
        $totalUnits = Vehicle::count();

        // KPI 2: Penyewa aktif (unit yang sedang disewa - status bukan 'dikembalikan')
        $activeRentals = Transaction::where('status', '!=', 'dikembalikan')->count();

        // KPI 3: Pendapatan minggu ini
        $weeklyRevenue = Transaction::where('created_at', '>=', Carbon::now()->startOfWeek())
            ->sum('total_price');

        return Inertia::render('Admin/Vehicles/Index', [
            'vehicles' => $vehicles,
            'totalUnits' => $totalUnits,
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
            'unit_code' => 'required|string|max:50|unique:vehicles,unit_code',
            'name' => 'required|string|max:255',
            'type' => 'required|in:supercar,luxury_car,exclusive_two_wheelers',
            'top_speed' => 'required|string',
            'year' => 'required|integer',
            'daily_price' => 'required|numeric|min:0',
            'image_url' => 'nullable|url|max:2048',
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
            'unit_code' => 'required|string|max:50|unique:vehicles,unit_code,' . $vehicle->id,
            'name' => 'required|string|max:255',
            'type' => 'required|in:supercar,luxury_car,exclusive_two_wheelers',
            'top_speed' => 'required|string',
            'year' => 'required|integer',
            'daily_price' => 'required|numeric|min:0',
            'image_url' => 'nullable|url|max:2048',
        ]);

        $vehicle->update($validated);
        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle updated successfully.');
    }

    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return redirect()->route('admin.vehicles.index')->with('success', 'Vehicle deleted successfully.');
    }
}

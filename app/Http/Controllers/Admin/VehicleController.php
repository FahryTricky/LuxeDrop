<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::latest()->paginate(10);
        return Inertia::render('Admin/Vehicles/Index', ['vehicles' => $vehicles]);
    }

    public function create()
    {
        return Inertia::render('Admin/Vehicles/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
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

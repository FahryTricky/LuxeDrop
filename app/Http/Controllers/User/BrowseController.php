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

        $vehicles = $query->paginate(12)->withQueryString();

        $filters = $request->only(['search', 'type', 'sort']);
        
        return Inertia::render('Browse/Index', [
            'vehicles' => $vehicles,
            'filters' => empty($filters) ? (object)[] : $filters
        ]);
    }
}

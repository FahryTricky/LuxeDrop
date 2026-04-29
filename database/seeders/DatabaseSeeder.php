<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@luxedrop.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'user@luxedrop.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        $v1 = Vehicle::create([
            'name' => 'Porsche 911 GT3',
            'type' => 'car',
            'top_speed' => '318',
            'year' => 2024,
            'daily_price' => 15000000,
            'image_url' => 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
            'is_available' => false,
        ]);

        Vehicle::create([
            'name' => 'Lamborghini Huracán',
            'type' => 'car',
            'top_speed' => '325',
            'year' => 2023,
            'daily_price' => 22500000,
            'image_url' => 'https://images.unsplash.com/photo-1620882814836-961ec7a111a9?auto=format&fit=crop&q=80&w=800',
            'is_available' => true,
        ]);

        Vehicle::create([
            'name' => 'Ducati Panigale V4',
            'type' => 'motorcycle',
            'top_speed' => '299',
            'year' => 2024,
            'daily_price' => 4800000,
            'image_url' => 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
            'is_available' => true,
        ]);

        Transaction::create([
            'user_id' => 2, // Test User
            'vehicle_id' => $v1->id,
            'status' => 'pengecekan_mobil',
            'duration_days' => 3,
            'total_price' => 45000000,
        ]);
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Fix legacy 'car' type to 'supercar' (Porsche, Lamborghini, etc.)
        DB::table('vehicles')->where('type', 'car')->update(['type' => 'supercar']);

        // Fix legacy 'motorcycle' type to 'exclusive_two_wheelers' (Ducati, etc.)
        DB::table('vehicles')->where('type', 'motorcycle')->update(['type' => 'exclusive_two_wheelers']);
    }

    public function down(): void
    {
        // Revert changes
        DB::table('vehicles')->where('type', 'supercar')->update(['type' => 'car']);
        DB::table('vehicles')->where('type', 'exclusive_two_wheelers')->update(['type' => 'motorcycle']);
    }
};

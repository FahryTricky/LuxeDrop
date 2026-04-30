<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('unit_code')->nullable()->unique()->after('id');
        });

        // Generate unit codes for existing vehicles that don't have one
        $vehicles = DB::table('vehicles')->whereNull('unit_code')->get();
        foreach ($vehicles as $vehicle) {
            $prefix = match($vehicle->type) {
                'supercar' => 'SC',
                'luxury_car' => 'LC',
                'exclusive_two_wheelers' => 'TW',
                'car' => 'SC',           // Legacy 'car' type -> SC
                'motorcycle' => 'TW',    // Legacy 'motorcycle' type -> TW
                default => 'VH',
            };
            $code = $prefix . '-' . str_pad($vehicle->id, 4, '0', STR_PAD_LEFT);
            DB::table('vehicles')->where('id', $vehicle->id)->update(['unit_code' => $code]);
        }

        // Now make it not nullable
        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('unit_code')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn('unit_code');
        });
    }
};

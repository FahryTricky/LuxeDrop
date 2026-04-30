<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Adding 'dikembalikan' to the status enum. 
        // In some databases like MySQL, we need to redeclare the enum.
        // For maximum compatibility across DB types (SQLite/MySQL), 
        // we can change it to string temporarily or use a raw statement.
        
        // Let's use a safe approach: change to string, then we can add any value.
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('status')->default('pengecekan_mobil')->change();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->enum('status', ['pengecekan_mobil', 'menunggu_towing', 'proses_pengiriman', 'pengiriman_selesai'])
                  ->default('pengecekan_mobil')
                  ->change();
        });
    }
};

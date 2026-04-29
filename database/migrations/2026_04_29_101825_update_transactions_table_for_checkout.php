<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('user_name')->nullable();
            $table->integer('user_age')->nullable();
            $table->string('user_email')->nullable();
            $table->text('delivery_address')->nullable();
            $table->decimal('towing_price', 15, 2)->default(0);
            $table->decimal('penalty_price', 15, 2)->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn([
                'user_name', 
                'user_age', 
                'user_email', 
                'delivery_address', 
                'towing_price', 
                'penalty_price'
            ]);
        });
    }
};

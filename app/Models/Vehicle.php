<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'unit_code',
        'name',
        'type',
        'top_speed',
        'year',
        'daily_price',
        'image_url',
        'is_available'
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}

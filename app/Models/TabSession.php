<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TabSession extends Model
{
    protected $fillable = [
        'tab_id',
        'user_id',
        'last_activity',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Clean up stale tab sessions older than 24 hours.
     */
    public static function cleanStale(): void
    {
        static::where('last_activity', '<', now()->subHours(24))->delete();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ustadz extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'specialization',
        'experience',
        'schedule',
        'phone',
        'email',
        'bio',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean'
    ];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}

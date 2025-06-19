<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_donatur',
        'email',
        'phone',
        'tanggal',
        'kategori',
        'program',
        'jumlah',
        'metode',
        'status',
        'anonim',
        'description'
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jumlah' => 'decimal:2',
        'anonim' => 'boolean'
    ];

    public function scopeInfaq($query)
    {
        return $query->where('kategori', 'Infaq');
    }

    public function scopeSedekah($query)
    {
        return $query->where('kategori', 'Sedekah');
    }

    public function scopeZakat($query)
    {
        return $query->where('kategori', 'Zakat');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }
}

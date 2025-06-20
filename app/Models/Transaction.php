<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'tanggal',
        'kategori',
        'sumber',
        'jumlah',
        'keterangan',
        'status',
        'user_id'
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jumlah' => 'decimal:2'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePemasukan($query)
    {
        return $query->where('kategori', 'Pemasukan');
    }

    public function scopePengeluaran($query)
    {
        return $query->where('kategori', 'Pengeluaran');
    }

    public function scopeVerified($query)
    {
        return $query->where('status', 'verified');
    }
}

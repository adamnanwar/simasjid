<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanKas extends Model
{
    use HasFactory;

    protected $table = 'laporan_kas';

    protected $fillable = [
        'jenis',
        'keterangan',
        'jumlah',
        'tanggal',
        'kategori',
    ];

    protected $casts = [
        'jumlah' => 'decimal:2',
        'tanggal' => 'date',
    ];
}

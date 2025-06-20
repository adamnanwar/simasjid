<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BeritaKegiatan extends Model
{
    use HasFactory;

    protected $table = 'berita_kegiatan';

    protected $fillable = [
        'judul',
        'slug',
        'konten',
        'ringkasan',
        'gambar',
        'kategori',
        'jenis',
        'status',
        'tanggal_kegiatan',
        'tanggal_publikasi',
        'penulis'
    ];

    protected $casts = [
        'tanggal_kegiatan' => 'date',
        'tanggal_publikasi' => 'datetime'
    ];

    protected $appends = ['gambar_url'];

    public function getGambarUrlAttribute()
    {
        return $this->gambar ? asset('storage/' . $this->gambar) : null;
    }

    public function scopeBerita($query)
    {
        return $query->where('jenis', 'berita');
    }

    public function scopeKegiatan($query)
    {
        return $query->where('jenis', 'kegiatan');
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('tanggal_publikasi');
    }
} 
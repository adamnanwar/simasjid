<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengurusMasjid extends Model
{
    use HasFactory;

    protected $table = 'pengurus_masjid';

    protected $fillable = [
        'nama',
        'jabatan',
        'telepon',
        'email',
        'deskripsi',
        'foto',
        'urutan'
    ];

    protected $appends = ['foto_url'];

    public function getFotoUrlAttribute()
    {
        return $this->foto ? asset('storage/' . $this->foto) : null;
    }

    public function scopeByUrutan($query)
    {
        return $query->orderBy('urutan')->orderBy('nama');
    }
} 
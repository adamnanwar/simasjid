<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class KegiatanMendatang extends Model
{
    use HasFactory;

    protected $table = 'kegiatan_mendatang';

    protected $fillable = [
        'judul',
        'slug',
        'deskripsi',
        'gambar',
        'tanggal_mulai',
        'tanggal_selesai',
        'waktu_mulai',
        'waktu_selesai',
        'lokasi',
        'penanggung_jawab',
        'persyaratan',
        'kuota_peserta',
        'biaya_pendaftaran',
        'status',
        'is_featured',
        'kontak_info',
        'catatan_tambahan'
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'waktu_mulai' => 'datetime:H:i',
        'waktu_selesai' => 'datetime:H:i',
        'biaya_pendaftaran' => 'decimal:0',
        'is_featured' => 'boolean',
        'kontak_info' => 'array'
    ];

    // Boot method to auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->judul);
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('judul')) {
                $model->slug = Str::slug($model->judul);
            }
        });
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('tanggal_mulai', '>=', now()->toDateString());
    }

    public function scopeActive($query)
    {
        return $query->where('status', '!=', 'cancelled')
                    ->where('tanggal_selesai', '>=', now()->toDateString());
    }

    // Accessors
    public function getFormattedTanggalAttribute()
    {
        if ($this->tanggal_mulai->eq($this->tanggal_selesai)) {
            return $this->tanggal_mulai->locale('id')->translatedFormat('d F Y');
        }
        
        return $this->tanggal_mulai->locale('id')->translatedFormat('d F Y') . ' - ' . 
               $this->tanggal_selesai->locale('id')->translatedFormat('d F Y');
    }

    public function getFormattedWaktuAttribute()
    {
        $waktu = $this->waktu_mulai->format('H:i');
        if ($this->waktu_selesai) {
            $waktu .= ' - ' . $this->waktu_selesai->format('H:i');
        }
        return $waktu . ' WIB';
    }

    public function getIsFullAttribute()
    {
        if (!$this->kuota_peserta) {
            return false;
        }
        
        // You can implement participant counting logic here
        // For now, return false
        return false;
    }

    public function getStatusBadgeAttribute()
    {
        return match($this->status) {
            'draft' => ['class' => 'bg-gray-100 text-gray-800', 'text' => 'Draft'],
            'published' => ['class' => 'bg-green-100 text-green-800', 'text' => 'Dipublikasi'],
            'cancelled' => ['class' => 'bg-red-100 text-red-800', 'text' => 'Dibatalkan'],
            default => ['class' => 'bg-gray-100 text-gray-800', 'text' => 'Unknown']
        };
    }

    public function getIsPastEventAttribute()
    {
        return $this->tanggal_selesai < now()->toDateString();
    }

    public function getFormattedBiayaAttribute()
    {
        if ($this->biaya_pendaftaran == 0) {
            return 'Gratis';
        }
        
        return 'Rp ' . number_format($this->biaya_pendaftaran, 0, ',', '.');
    }
}

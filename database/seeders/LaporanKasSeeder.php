<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LaporanKas;
use Carbon\Carbon;

class LaporanKasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample kas transactions
        $transactions = [
            [
                'jenis' => 'masuk',
                'keterangan' => 'Donasi Jum\'at dari jamaah',
                'jumlah' => 2500000,
                'tanggal' => Carbon::now()->subDays(1),
                'kategori' => 'Donasi',
            ],
            [
                'jenis' => 'keluar',
                'keterangan' => 'Bayar listrik masjid bulanan',
                'jumlah' => 450000,
                'tanggal' => Carbon::now()->subDays(2),
                'kategori' => 'Utilitas',
            ],
            [
                'jenis' => 'masuk',
                'keterangan' => 'Infaq pembangunan dari donatur',
                'jumlah' => 5000000,
                'tanggal' => Carbon::now()->subDays(3),
                'kategori' => 'Pembangunan',
            ],
            [
                'jenis' => 'keluar',
                'keterangan' => 'Pembelian alat kebersihan masjid',
                'jumlah' => 125000,
                'tanggal' => Carbon::now()->subDays(4),
                'kategori' => 'Operasional',
            ],
            [
                'jenis' => 'masuk',
                'keterangan' => 'Sedekah dari kegiatan pengajian',
                'jumlah' => 750000,
                'tanggal' => Carbon::now()->subDays(5),
                'kategori' => 'Kegiatan',
            ],
            [
                'jenis' => 'keluar',
                'keterangan' => 'Bayar air PAM bulanan',
                'jumlah' => 85000,
                'tanggal' => Carbon::now()->subDays(6),
                'kategori' => 'Utilitas',
            ],
            [
                'jenis' => 'masuk',
                'keterangan' => 'Infaq dari acara nikahan',
                'jumlah' => 1200000,
                'tanggal' => Carbon::now()->subDays(7),
                'kategori' => 'Kegiatan',
            ],
            [
                'jenis' => 'keluar',
                'keterangan' => 'Perbaikan sound system masjid',
                'jumlah' => 680000,
                'tanggal' => Carbon::now()->subDays(8),
                'kategori' => 'Operasional',
            ],
            [
                'jenis' => 'masuk',
                'keterangan' => 'Donasi bulanan dari yayasan',
                'jumlah' => 3000000,
                'tanggal' => Carbon::now()->subDays(10),
                'kategori' => 'Donasi',
            ],
            [
                'jenis' => 'keluar',
                'keterangan' => 'Honor khotib dan imam',
                'jumlah' => 400000,
                'tanggal' => Carbon::now()->subDays(12),
                'kategori' => 'Operasional',
            ],
        ];

        foreach ($transactions as $transaction) {
            LaporanKas::create($transaction);
        }
    }
}

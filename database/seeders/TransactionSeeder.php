<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get first user or create one
        $user = User::first() ?? User::factory()->create([
            'name' => 'Admin Masjid',
            'email' => 'admin@masjid.com'
        ]);

        $transactions = [
            // Pemasukan
            [
                'tanggal' => Carbon::now()->subDays(1),
                'kategori' => 'Pemasukan',
                'sumber' => 'Infaq Jumat',
                'jumlah' => 2500000,
                'keterangan' => 'Infaq jamaah sholat Jumat',
                'status' => 'verified',
                'user_id' => $user->id
            ],
            [
                'tanggal' => Carbon::now()->subDays(2),
                'kategori' => 'Pemasukan',
                'sumber' => 'Sedekah',
                'jumlah' => 1200000,
                'keterangan' => 'Sedekah kotak amal',
                'status' => 'verified',
                'user_id' => $user->id
            ],
            [
                'tanggal' => Carbon::now()->subDays(3),
                'kategori' => 'Pemasukan',
                'sumber' => 'Zakat Fitrah',
                'jumlah' => 3200000,
                'keterangan' => 'Zakat fitrah jamaah',
                'status' => 'verified',
                'user_id' => $user->id
            ],
            [
                'tanggal' => Carbon::now()->subDays(4),
                'kategori' => 'Pemasukan',
                'sumber' => 'Donasi Pembangunan',
                'jumlah' => 5000000,
                'keterangan' => 'Donasi untuk renovasi masjid',
                'status' => 'verified',
                'user_id' => $user->id
            ],
            [
                'tanggal' => Carbon::now()->subDays(5),
                'kategori' => 'Pemasukan',
                'sumber' => 'Infaq Maghrib',
                'jumlah' => 800000,
                'keterangan' => 'Infaq jamaah sholat maghrib',
                'status' => 'verified',
                'user_id' => $user->id
            ],

            // Pengeluaran
            [
                'tanggal' => Carbon::now()->subDays(1),
                'kategori' => 'Pengeluaran',
                'sumber' => 'Listrik',
                'jumlah' => 850000,
                'keterangan' => 'Pembayaran listrik bulan ini',
                'status' => 'verified',
                'user_id' => $user->id
            ],
            [
                'tanggal' => Carbon::now()->subDays(2),
                'kategori' => 'Pengeluaran',
                'sumber' => 'Air',
                'jumlah' => 300000,
                'keterangan' => 'Pembayaran air PDAM',
                'status' => 'verified',
                'user_id' => $user->id
            ],
            [
                'tanggal' => Carbon::now()->subDays(3),
                'kategori' => 'Pengeluaran',
                'sumber' => 'Konsumsi',
                'jumlah' => 450000,
                'keterangan' => 'Konsumsi kajian bulanan',
                'status' => 'verified',
                'user_id' => $user->id
            ],
            [
                'tanggal' => Carbon::now()->subDays(4),
                'kategori' => 'Pengeluaran',
                'sumber' => 'Kebersihan',
                'jumlah' => 200000,
                'keterangan' => 'Alat kebersihan masjid',
                'status' => 'verified',
                'user_id' => $user->id
            ],
            [
                'tanggal' => Carbon::now()->subDays(5),
                'kategori' => 'Pengeluaran',
                'sumber' => 'Pemeliharaan',
                'jumlah' => 750000,
                'keterangan' => 'Perbaikan sound system',
                'status' => 'verified',
                'user_id' => $user->id
            ]
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }
    }
}

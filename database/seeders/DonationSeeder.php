<?php

namespace Database\Seeders;

use App\Models\Donation;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DonationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $donations = [
            [
                'nama_donatur' => 'Ahmad Syahrul',
                'email' => 'ahmad@email.com',
                'phone' => '081234567890',
                'tanggal' => now()->subDays(5),
                'kategori' => 'Infaq',
                'program' => 'Donasi Umum',
                'jumlah' => 500000,
                'metode' => 'Transfer Bank',
                'anonim' => false,
                'status' => 'confirmed',
                'description' => 'Semoga bermanfaat untuk kemajuan masjid'
            ],
            [
                'nama_donatur' => 'Hamba Allah',
                'email' => 'hamba.allah@alikhlash.com',
                'phone' => null,
                'tanggal' => now()->subDays(3),
                'kategori' => 'Sedekah',
                'program' => 'Operasional',
                'jumlah' => 250000,
                'metode' => 'Tunai',
                'anonim' => true,
                'status' => 'confirmed',
                'description' => null
            ],
            [
                'nama_donatur' => 'Siti Fatimah',
                'email' => 'siti.fatimah@email.com',
                'phone' => '082345678901',
                'tanggal' => now()->subDays(1),
                'kategori' => 'Infaq',
                'program' => 'Pembangunan Masjid',
                'jumlah' => 1000000,
                'metode' => 'Transfer Bank',
                'anonim' => false,
                'status' => 'confirmed',
                'description' => 'Untuk pembangunan menara masjid'
            ],
            [
                'nama_donatur' => 'Hamba Allah',
                'email' => 'hamba.allah@alikhlash.com',
                'phone' => null,
                'tanggal' => now(),
                'kategori' => 'Zakat',
                'program' => 'Zakat Fitrah',
                'jumlah' => 50000,
                'metode' => 'Tunai',
                'anonim' => true,
                'status' => 'confirmed',
                'description' => 'Zakat Fitrah untuk keluarga'
            ],
            [
                'nama_donatur' => 'Ahmad Rizki',
                'email' => 'ahmad.rizki@email.com',
                'phone' => '083456789012',
                'tanggal' => now()->subDays(7),
                'kategori' => 'Zakat',
                'program' => 'Zakat Mal',
                'jumlah' => 12000000,
                'metode' => 'Transfer Bank',
                'anonim' => false,
                'status' => 'confirmed',
                'description' => 'Zakat harta untuk tahun ini'
            ]
        ];

        foreach ($donations as $donation) {
            Donation::create($donation);
        }
    }
}

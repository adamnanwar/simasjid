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
                'nama_donatur' => 'Ahmad Rizki',
                'email' => 'ahmad.rizki@email.com',
                'phone' => '0812-3456-7890',
                'tanggal' => Carbon::now()->subDays(1),
                'kategori' => 'Infaq',
                'program' => 'Pembangunan Masjid',
                'jumlah' => 1500000,
                'metode' => 'Transfer Bank',
                'status' => 'confirmed',
                'anonim' => false,
                'description' => 'Infaq untuk renovasi masjid'
            ],
            [
                'nama_donatur' => 'Donatur Anonim',
                'email' => null,
                'phone' => null,
                'tanggal' => Carbon::now()->subDays(1),
                'kategori' => 'Sedekah',
                'program' => 'Bantuan Yatim',
                'jumlah' => 500000,
                'metode' => 'Tunai',
                'status' => 'confirmed',
                'anonim' => true,
                'description' => null
            ],
            [
                'nama_donatur' => 'Siti Aminah',
                'email' => 'siti.aminah@email.com',
                'phone' => '0813-9876-5432',
                'tanggal' => Carbon::now()->subDays(2),
                'kategori' => 'Infaq',
                'program' => 'Kegiatan Ramadan',
                'jumlah' => 2000000,
                'metode' => 'Transfer Bank',
                'status' => 'pending',
                'anonim' => false,
                'description' => 'Untuk persiapan kegiatan Ramadan'
            ],
            [
                'nama_donatur' => 'Budi Santoso',
                'email' => 'budi.santoso@email.com',
                'phone' => '0814-1111-2222',
                'tanggal' => Carbon::now()->subDays(2),
                'kategori' => 'Sedekah',
                'program' => 'Santunan Dhuafa',
                'jumlah' => 750000,
                'metode' => 'E-Wallet',
                'status' => 'confirmed',
                'anonim' => false,
                'description' => 'Bantuan untuk fakir miskin'
            ],
            [
                'nama_donatur' => 'Donatur Anonim',
                'email' => null,
                'phone' => null,
                'tanggal' => Carbon::now()->subDays(3),
                'kategori' => 'Infaq',
                'program' => 'Operasional Masjid',
                'jumlah' => 300000,
                'metode' => 'Tunai',
                'status' => 'confirmed',
                'anonim' => true,
                'description' => null
            ],
            [
                'nama_donatur' => 'Fatimah Az-Zahra',
                'email' => 'fatimah@email.com',
                'phone' => '0815-5555-6666',
                'tanggal' => Carbon::now()->subDays(3),
                'kategori' => 'Zakat',
                'program' => 'Zakat Mal',
                'jumlah' => 4500000,
                'metode' => 'Transfer Bank',
                'status' => 'confirmed',
                'anonim' => false,
                'description' => 'Zakat mal tahunan'
            ],
            [
                'nama_donatur' => 'Muhammad Iqbal',
                'email' => 'muhammad.iqbal@email.com',
                'phone' => '0816-7777-8888',
                'tanggal' => Carbon::now()->subDays(4),
                'kategori' => 'Infaq',
                'program' => 'Kajian Rutin',
                'jumlah' => 400000,
                'metode' => 'Transfer Bank',
                'status' => 'confirmed',
                'anonim' => false,
                'description' => 'Untuk konsumsi kajian rutin'
            ],
            [
                'nama_donatur' => 'Aisha Radhiyallahu Anha',
                'email' => 'aisha@email.com',
                'phone' => '0817-9999-0000',
                'tanggal' => Carbon::now()->subDays(5),
                'kategori' => 'Sedekah',
                'program' => 'Bantuan Kesehatan',
                'jumlah' => 1000000,
                'metode' => 'E-Wallet',
                'status' => 'confirmed',
                'anonim' => false,
                'description' => 'Bantuan untuk jamaah yang sakit'
            ]
        ];

        foreach ($donations as $donation) {
            Donation::create($donation);
        }
    }
}

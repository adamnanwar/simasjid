<?php

namespace Database\Seeders;

use App\Models\Ustadz;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UstadzSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ustadzs = [
            [
                'name' => 'Ustadz Abdullah',
                'specialization' => 'Fiqh, Akidah, Konsultasi Keluarga',
                'experience' => '15 tahun',
                'schedule' => 'Senin - Jumat: 08:00-17:00',
                'phone' => '0812-3456-7890',
                'email' => 'ustadz.abdullah@masjid.com',
                'bio' => 'Lulusan Al-Azhar Mesir, berpengalaman dalam bidang fiqh dan konsultasi keluarga islami.',
                'active' => true
            ],
            [
                'name' => 'Ustadz Ibrahim',
                'specialization' => 'Tajwid, Tahfidz, Konsultasi Bisnis',
                'experience' => '12 tahun',
                'schedule' => 'Selasa - Sabtu: 09:00-16:00',
                'phone' => '0813-9876-5432',
                'email' => 'ustadz.ibrahim@masjid.com',
                'bio' => 'Hafidz Al-Quran dan pakar bisnis syariah, sering memberikan pelatihan ekonomi Islam.',
                'active' => true
            ],
            [
                'name' => 'Ustadz Muhammad',
                'specialization' => 'Kajian Hadits, Sirah Nabawiyah',
                'experience' => '10 tahun',
                'schedule' => 'Rabu - Minggu: 10:00-15:00',
                'phone' => '0814-1111-2222',
                'email' => 'ustadz.muhammad@masjid.com',
                'bio' => 'Spesialis hadits dan sejarah Islam, aktif dalam program kajian rutin masjid.',
                'active' => true
            ]
        ];

        foreach ($ustadzs as $ustadz) {
            Ustadz::create($ustadz);
        }
    }
}

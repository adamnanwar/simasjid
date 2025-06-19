<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\JanjiTemu;
use Carbon\Carbon;

class JanjiTemuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample janji temu appointments
        $appointments = [
            [
                'nama' => 'Fatimah',
                'email' => 'fatimah@email.com',
                'telepon' => '081234567890',
                'tanggal' => Carbon::now()->addDays(1),
                'waktu' => '09:00',
                'keperluan' => 'Konsultasi mengenai masalah keluarga dan cara mendidik anak dalam Islam',
                'status' => 'approved',
            ],
            [
                'nama' => 'Siti Aminah',
                'email' => 'siti@email.com',
                'telepon' => '082345678901',
                'tanggal' => Carbon::now()->addDays(2),
                'waktu' => '10:30',
                'keperluan' => 'Ingin belajar tentang hukum zakat dan sedekah yang benar menurut syariat',
                'status' => 'pending',
            ],
            [
                'nama' => 'Ahmad Rizki',
                'email' => 'ahmad.rizki@email.com',
                'telepon' => '083456789012',
                'tanggal' => Carbon::now()->addDays(3),
                'waktu' => '14:00',
                'keperluan' => 'Diskusi tentang pembentukan komunitas tahfidz untuk remaja masjid',
                'status' => 'approved',
            ],
            [
                'nama' => 'Khadijah Rahman',
                'email' => 'khadijah@email.com',
                'telepon' => '084567890123',
                'tanggal' => Carbon::now()->addDays(4),
                'waktu' => '16:00',
                'keperluan' => 'Konsultasi pernikahan dan persiapan rumah tangga islami',
                'status' => 'pending',
            ],
            [
                'nama' => 'Umar Faruq',
                'email' => 'umar@email.com',
                'telepon' => '085678901234',
                'tanggal' => Carbon::now()->addDays(5),
                'waktu' => '08:30',
                'keperluan' => 'Bimbingan untuk memulai usaha dengan prinsip syariah',
                'status' => 'rejected',
            ],
        ];

        foreach ($appointments as $appointment) {
            JanjiTemu::create($appointment);
        }
    }
}

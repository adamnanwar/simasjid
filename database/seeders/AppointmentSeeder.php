<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Ustadz;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ustadzs = Ustadz::all();
        $user = User::first();

        if ($ustadzs->isEmpty()) {
            return; // Skip if no ustadz data
        }

        $appointments = [
            [
                'name' => 'Ahmad Rizki',
                'email' => 'ahmad@email.com',
                'phone' => '0812-3456-7890',
                'date' => Carbon::now()->addDays(3),
                'time' => '09:00:00',
                'ustadz_id' => $ustadzs->first()->id,
                'topic' => 'Konsultasi Pernikahan',
                'description' => 'Ingin berkonsultasi mengenai persiapan pernikahan islami',
                'status' => 'confirmed',
                'user_id' => $user?->id
            ],
            [
                'name' => 'Siti Aminah',
                'email' => 'siti@email.com',
                'phone' => '0813-9876-5432',
                'date' => Carbon::now()->addDays(4),
                'time' => '14:00:00',
                'ustadz_id' => $ustadzs->count() > 1 ? $ustadzs->skip(1)->first()->id : $ustadzs->first()->id,
                'topic' => 'Belajar Mengaji',
                'description' => 'Ingin belajar tajwid dan tahsin Al-Quran',
                'status' => 'pending',
                'user_id' => $user?->id
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@email.com',
                'phone' => '0814-1111-2222',
                'date' => Carbon::now()->subDays(1),
                'time' => '16:00:00',
                'ustadz_id' => $ustadzs->first()->id,
                'topic' => 'Konsultasi Bisnis Syariah',
                'description' => 'Berkonsultasi tentang prinsip bisnis sesuai syariah',
                'status' => 'completed',
                'user_id' => $user?->id
            ],
            [
                'name' => 'Fatimah Az-Zahra',
                'email' => 'fatimah@email.com',
                'phone' => '0815-5555-6666',
                'date' => Carbon::now()->addDays(5),
                'time' => '10:00:00',
                'ustadz_id' => $ustadzs->count() > 2 ? $ustadzs->skip(2)->first()->id : $ustadzs->first()->id,
                'topic' => 'Kajian Fiqh',
                'description' => 'Ingin mempelajari fiqh wanita dalam Islam',
                'status' => 'confirmed',
                'user_id' => $user?->id
            ],
            [
                'name' => 'Muhammad Iqbal',
                'email' => 'muhammad.iqbal@email.com',
                'phone' => '0816-7777-8888',
                'date' => Carbon::now()->addDays(2),
                'time' => '15:00:00',
                'ustadz_id' => $ustadzs->count() > 1 ? $ustadzs->skip(1)->first()->id : $ustadzs->first()->id,
                'topic' => 'Tahfidz Al-Quran',
                'description' => 'Konsultasi metode menghafal Al-Quran yang efektif',
                'status' => 'pending',
                'user_id' => $user?->id
            ],
            [
                'name' => 'Aisha Radhiyallahu Anha',
                'email' => 'aisha@email.com',
                'phone' => '0817-9999-0000',
                'date' => Carbon::now()->addDays(1),
                'time' => '11:00:00',
                'ustadz_id' => $ustadzs->first()->id,
                'topic' => 'Konsultasi Keluarga',
                'description' => 'Masalah dalam mendidik anak secara islami',
                'status' => 'confirmed',
                'user_id' => $user?->id
            ]
        ];

        foreach ($appointments as $appointment) {
            Appointment::create($appointment);
        }
    }
}

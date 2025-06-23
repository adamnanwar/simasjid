<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user if not exists
        if (!User::where('email', 'admin@masjid.com')->exists()) {
            User::create([
                'name' => 'Admin Masjid',
                'email' => 'admin@masjid.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
            ]);
        }
    }
}

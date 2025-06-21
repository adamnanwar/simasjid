<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PengurusMasjid;

class PengurusMasjidSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pengurus = [
            [
                'nama' => 'John Carter',
                'jabatan' => 'CEO & Founder',
                'telepon' => '0812-3456-7890',
                'email' => 'john@masjid.com',
                'deskripsi' => 'Facilisi nisl interdum a eu maurisole mus etiam nec mauris dolor sit amet consectur siler consectur ole.',
                'urutan' => 1,
                'foto' => null
            ],
            [
                'nama' => 'Sophie Moore',
                'jabatan' => 'VP of Design',
                'telepon' => '0813-4567-8901',
                'email' => 'sophie@masjid.com',
                'deskripsi' => 'Semper phasellus eget eu egestas odio pretium aliquam ipsum quam augue tortor proin magna at.',
                'urutan' => 2,
                'foto' => null
            ],
            [
                'nama' => 'Matt Cannon',
                'jabatan' => 'VP of Marketing',
                'telepon' => '0814-5678-9012',
                'email' => 'matt@masjid.com',
                'deskripsi' => 'Ac platea arcu mi vulputate fames euismod nunc diam sit quisque fermentum dignissim sed ut.',
                'urutan' => 3,
                'foto' => null
            ],
            [
                'nama' => 'Andy Smith',
                'jabatan' => 'VP of Development',
                'telepon' => '0815-6789-0123',
                'email' => 'andy@masjid.com',
                'deskripsi' => 'Ornare cras vestibulum ut lectus enim amet sit diam velit pulvinar sem tristique mattis odio iaculis.',
                'urutan' => 4,
                'foto' => null
            ]
        ];

        foreach ($pengurus as $item) {
            PengurusMasjid::create($item);
        }
    }
}

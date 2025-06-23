<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\KegiatanMendatang;
use Carbon\Carbon;

class KegiatanMendatangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kegiatan = [
            [
                'judul' => 'Pengajian Bulanan Akbar',
                'deskripsi' => 'Pengajian rutin bulanan dengan tema "Meningkatkan Keimanan di Bulan Ramadhan". Pengajian ini akan menghadirkan ustadz terkemuka dan akan membahas tentang keutamaan bulan suci Ramadhan.',
                'tanggal_mulai' => Carbon::now()->addDays(7),
                'tanggal_selesai' => Carbon::now()->addDays(7),
                'waktu_mulai' => '19:30',
                'waktu_selesai' => '21:00',
                'lokasi' => 'Masjid Al-Ikhlash, Aula Utama',
                'penanggung_jawab' => 'Ustadz Ahmad Syamsuddin',
                'persyaratan' => 'Membawa Al-Quran dan alat tulis',
                'kuota_peserta' => 200,
                'biaya_pendaftaran' => 0,
                'status' => 'published',
                'is_featured' => true,
                'kontak_info' => json_encode([
                    'phone' => '0812-3456-7890',
                    'email' => 'pengajian@masjid-alikhlash.org',
                    'whatsapp' => '0812-3456-7890'
                ]),
                'catatan_tambahan' => 'Diharapkan hadir tepat waktu. Tersedia parkir gratis untuk jamaah.',
            ],
            [
                'judul' => 'Pelatihan Tahfidz Al-Quran',
                'deskripsi' => 'Program pelatihan menghafal Al-Quran untuk anak-anak dan remaja dengan metode yang mudah dan menyenangkan. Dipandu oleh instruktur tahfidz berpengalaman.',
                'tanggal_mulai' => Carbon::now()->addDays(14),
                'tanggal_selesai' => Carbon::now()->addDays(16),
                'waktu_mulai' => '08:00',
                'waktu_selesai' => '12:00',
                'lokasi' => 'Masjid Al-Ikhlash, Ruang Tahfidz',
                'penanggung_jawab' => 'Ustadz Muhammad Hafidz',
                'persyaratan' => 'Usia 7-17 tahun, sudah bisa membaca Al-Quran',
                'kuota_peserta' => 30,
                'biaya_pendaftaran' => 150000,
                'status' => 'published',
                'is_featured' => true,
                'kontak_info' => json_encode([
                    'phone' => '0813-2345-6789',
                    'email' => 'tahfidz@masjid-alikhlash.org',
                    'whatsapp' => '0813-2345-6789'
                ]),
                'catatan_tambahan' => 'Peserta wajib membawa Al-Quran pribadi dan alat tulis. Disediakan konsumsi selama pelatihan.',
            ],
            [
                'judul' => 'Santunan Anak Yatim',
                'deskripsi' => 'Kegiatan pemberian santunan kepada anak-anak yatim di sekitar wilayah masjid. Sekaligus mengadakan kegiatan bermain dan edukasi untuk anak-anak.',
                'tanggal_mulai' => Carbon::now()->addDays(21),
                'tanggal_selesai' => Carbon::now()->addDays(21),
                'waktu_mulai' => '09:00',
                'waktu_selesai' => '15:00',
                'lokasi' => 'Halaman Masjid Al-Ikhlash',
                'penanggung_jawab' => 'Panitia Sosial Masjid',
                'persyaratan' => 'Terbuka untuk umum, diutamakan anak yatim',
                'kuota_peserta' => 100,
                'biaya_pendaftaran' => 0,
                'status' => 'published',
                'is_featured' => false,
                'kontak_info' => json_encode([
                    'phone' => '0814-3456-7890',
                    'email' => 'sosial@masjid-alikhlash.org',
                    'whatsapp' => '0814-3456-7890'
                ]),
                'catatan_tambahan' => 'Donasi sukarela untuk kegiatan santunan sangat diharapkan.',
            ],
            [
                'judul' => 'Kajian Fiqh Wanita',
                'deskripsi' => 'Kajian khusus untuk muslimah membahas fiqh seputar kehidupan sehari-hari wanita muslimah. Dipandu oleh ustadzah yang kompeten di bidangnya.',
                'tanggal_mulai' => Carbon::now()->addDays(28),
                'tanggal_selesai' => Carbon::now()->addDays(28),
                'waktu_mulai' => '15:00',
                'waktu_selesai' => '17:00',
                'lokasi' => 'Masjid Al-Ikhlash, Ruang Serbaguna',
                'penanggung_jawab' => 'Ustadzah Fatimah Azzahra',
                'persyaratan' => 'Khusus untuk muslimah, membawa catatan',
                'kuota_peserta' => 50,
                'biaya_pendaftaran' => 25000,
                'status' => 'published',
                'is_featured' => false,
                'kontak_info' => json_encode([
                    'phone' => '0815-4567-8901',
                    'email' => 'kajianwanita@masjid-alikhlash.org',
                    'whatsapp' => '0815-4567-8901'
                ]),
                'catatan_tambahan' => 'Tersedia ruang penitipan anak untuk ibu yang membawa balita.',
            ],
            [
                'judul' => 'Bakti Sosial Ramadhan',
                'deskripsi' => 'Kegiatan bakti sosial menyambut bulan Ramadhan dengan membagikan paket sembako kepada masyarakat kurang mampu di sekitar masjid.',
                'tanggal_mulai' => Carbon::now()->addDays(35),
                'tanggal_selesai' => Carbon::now()->addDays(35),
                'waktu_mulai' => '07:00',
                'waktu_selesai' => '12:00',
                'lokasi' => 'Berbagai lokasi di sekitar Masjid Al-Ikhlash',
                'penanggung_jawab' => 'Tim Relawan Masjid',
                'persyaratan' => 'Terbuka untuk relawan, berusia minimal 17 tahun',
                'kuota_peserta' => null,
                'biaya_pendaftaran' => 0,
                'status' => 'draft',
                'is_featured' => true,
                'kontak_info' => json_encode([
                    'phone' => '0816-5678-9012',
                    'email' => 'relawan@masjid-alikhlash.org',
                    'whatsapp' => '0816-5678-9012'
                ]),
                'catatan_tambahan' => 'Relawan akan dibagi menjadi beberapa tim sesuai wilayah distribusi.',
            ]
        ];

        foreach ($kegiatan as $item) {
            KegiatanMendatang::create($item);
        }
    }
}

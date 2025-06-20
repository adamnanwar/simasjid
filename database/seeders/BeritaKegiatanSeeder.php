<?php

namespace Database\Seeders;

use App\Models\BeritaKegiatan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BeritaKegiatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $beritaKegiatan = [
            [
                'judul' => 'Kegiatan Bakti Sosial Ramadhan 2025',
                'konten' => 'Masjid Al-Ikhlas mengadakan kegiatan bakti sosial dalam rangka menyambut bulan suci Ramadhan 2025. Kegiatan ini meliputi pembagian sembako, santunan anak yatim, dan pelayanan kesehatan gratis untuk masyarakat sekitar. Kegiatan ini dihadiri oleh ratusan jamaah dan warga sekitar yang sangat antusias. Tim medis dari puskesmas setempat juga turut berpartisipasi dalam memberikan layanan kesehatan gratis.',
                'jenis' => 'kegiatan',
                'tanggal_kegiatan' => '2025-03-15',
                'tanggal_publikasi' => '2025-01-20 08:00:00',
                'penulis' => 'Admin Masjid'
            ],
            [
                'judul' => 'Renovasi Lantai 2 Masjid Selesai',
                'konten' => 'Alhamdulillah renovasi lantai 2 masjid telah selesai dan siap digunakan untuk kegiatan jamaah. Lantai 2 ini dilengkapi dengan fasilitas AC, karpet baru, dan sound system yang memadai. Renovasi ini merupakan hasil gotong royong dan donasi dari jamaah masjid. Area ini akan digunakan untuk kegiatan kajian rutin, pelatihan, dan acara-acara khusus masjid.',
                'jenis' => 'berita',
                'tanggal_kegiatan' => null,
                'tanggal_publikasi' => '2025-01-18 10:30:00',
                'penulis' => 'Panitia Pembangunan'
            ],
            [
                'judul' => 'Kegiatan Santunan Anak Yatim Bulan Ramadhan',
                'konten' => 'Masjid Al-Ikhlas mengadakan kegiatan santunan untuk 150 anak yatim dalam rangka menyambut bulan suci Ramadhan. Setiap anak mendapat santunan berupa uang tunai, pakaian baru, dan paket sembako. Kegiatan ini rutin dilakukan setiap tahun sebagai bentuk kepedulian jamaah terhadap anak-anak kurang mampu di sekitar masjid.',
                'jenis' => 'kegiatan',
                'tanggal_kegiatan' => '2025-03-10',
                'tanggal_publikasi' => '2025-01-15 14:00:00',
                'penulis' => 'Takmir Masjid'
            ],
            [
                'judul' => 'Pelaksanaan Sholat Tarawih Berjemaah',
                'konten' => 'Mulai malam ini, masjid akan melaksanakan sholat tarawih berjemaah setiap malam selama bulan Ramadhan. Sholat tarawih dimulai pukul 20:30 WIB setelah sholat isya. Jamaah diharapkan datang lebih awal untuk mendapatkan tempat yang nyaman. Setelah sholat tarawih, akan ada kajian singkat tentang nilai-nilai Ramadhan.',
                'jenis' => 'berita',
                'tanggal_kegiatan' => null,
                'tanggal_publikasi' => '2025-01-12 16:45:00',
                'penulis' => 'Ustadz Ahmad'
            ],
            [
                'judul' => 'Kajian Rutin Setiap Kamis Malam',
                'konten' => 'Kajian rutin dengan tema "Akhlak dalam Islam" akan dilaksanakan setiap Kamis malam pukul 19:30 WIB. Kajian ini terbuka untuk umum dan gratis. Peserta akan mendapat ilmu tentang cara berperilaku yang baik sesuai ajaran Islam dalam kehidupan sehari-hari. Kajian dipimpin oleh Ustadz Mahmud dengan pengalaman mengajar lebih dari 15 tahun.',
                'jenis' => 'kegiatan',
                'tanggal_kegiatan' => '2025-01-25',
                'tanggal_publikasi' => '2025-01-10 09:15:00',
                'penulis' => 'Ustadz Mahmud'
            ],
            [
                'judul' => 'Pelatihan Qira\'ah Al-Quran untuk Remaja',
                'konten' => 'Program pelatihan membaca Al-Quran dengan tartil untuk remaja usia 13-18 tahun. Pelatihan ini akan dilaksanakan setiap Sabtu dan Minggu selama 2 bulan. Peserta akan diajarkan teknik membaca Al-Quran yang benar, tajwid, dan makhorijul huruf. Pendaftaran dibuka mulai hari ini dan terbatas untuk 30 peserta.',
                'jenis' => 'kegiatan',
                'tanggal_kegiatan' => '2025-02-01',
                'tanggal_publikasi' => '2025-01-08 11:20:00',
                'penulis' => 'Ustadz Mahmud'
            ]
        ];

        foreach ($beritaKegiatan as $item) {
            BeritaKegiatan::create([
                'judul' => $item['judul'],
                'slug' => Str::slug($item['judul']),
                'konten' => $item['konten'],
                'jenis' => $item['jenis'],
                'tanggal_kegiatan' => $item['tanggal_kegiatan'],
                'tanggal_publikasi' => $item['tanggal_publikasi'],
                'penulis' => $item['penulis'],
            ]);
        }
    }
} 
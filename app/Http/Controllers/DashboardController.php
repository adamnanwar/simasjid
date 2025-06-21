<?php

namespace App\Http\Controllers;

use App\Models\LaporanKas;
use App\Models\Donation;
use App\Models\JanjiTemu;
use App\Models\Ustadz;
use App\Models\BeritaKegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Total Kas (Pemasukan - Pengeluaran) - Using LaporanKas model
        $totalPemasukan = LaporanKas::where('jenis', 'masuk')->sum('jumlah');
        $totalPengeluaran = LaporanKas::where('jenis', 'keluar')->sum('jumlah');
        $totalKas = $totalPemasukan - $totalPengeluaran;
        
        // Total Donasi (Infaq + Sedekah + Zakat)
        $totalDonasi = Donation::confirmed()->sum('jumlah');
        
        // Total Janji Temu - Using JanjiTemu model
        $totalJanjiTemu = JanjiTemu::count();
        $janjiTemuPending = JanjiTemu::where('status', 'pending')->count();
        
        // Transaksi Recent (5 terbaru) - Using LaporanKas
        $recentTransactions = LaporanKas::orderBy('tanggal', 'desc')
            ->take(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'description' => $transaction->keterangan,
                    'amount' => (float) $transaction->jumlah,
                    'type' => $transaction->jenis === 'masuk' ? 'income' : 'expense',
                    'date' => $transaction->tanggal->format('Y-m-d')
                ];
            });
            
        // Donasi Recent (5 terbaru)
        $recentDonations = Donation::confirmed()
            ->orderBy('tanggal', 'desc')
            ->take(5)
            ->get();
            
        // Upcoming Janji Temu - Using JanjiTemu model
        $upcomingJanjiTemu = JanjiTemu::with('ustadz')
            ->where('tanggal', '>=', Carbon::today())
            ->orderBy('tanggal')
            ->orderBy('waktu')
            ->take(5)
            ->get()
            ->map(function ($janjiTemu) {
                return [
                    'id' => $janjiTemu->id,
                    'name' => $janjiTemu->nama,
                    'topic' => $janjiTemu->keperluan,
                    'date' => $janjiTemu->tanggal->format('Y-m-d'),
                    'time' => $janjiTemu->waktu ? $janjiTemu->waktu->format('H:i') : '',
                    'status' => $janjiTemu->status === 'approved' ? 'confirmed' : 'pending'
                ];
            });
            
        // Statistik Bulanan - Using LaporanKas
        $monthlyIncome = LaporanKas::where('jenis', 'masuk')
            ->whereMonth('tanggal', Carbon::now()->month)
            ->whereYear('tanggal', Carbon::now()->year)
            ->sum('jumlah');
            
        $monthlyExpense = LaporanKas::where('jenis', 'keluar')
            ->whereMonth('tanggal', Carbon::now()->month)
            ->whereYear('tanggal', Carbon::now()->year)
            ->sum('jumlah');

        return Inertia::render('dashboard', [
            'stats' => [
                'totalKas' => (float) $totalKas ?: 0,
                'totalDonasi' => (float) $totalDonasi ?: 0,
                'totalJanjiTemu' => (int) $totalJanjiTemu ?: 0,
                'janjiTemuPending' => (int) $janjiTemuPending ?: 0,
                'monthlyIncome' => (float) $monthlyIncome ?: 0,
                'monthlyExpense' => (float) $monthlyExpense ?: 0
            ],
            'recentTransactions' => $recentTransactions,
            'recentDonations' => $recentDonations,
            'upcomingAppointments' => $upcomingJanjiTemu
        ]);
    }
    
    // API Methods for Frontend
    public function apiStatistics()
    {
        // Total Kas (Pemasukan - Pengeluaran) - Using LaporanKas model
        $totalPemasukan = LaporanKas::where('jenis', 'masuk')->sum('jumlah');
        $totalPengeluaran = LaporanKas::where('jenis', 'keluar')->sum('jumlah');
        $totalKas = $totalPemasukan - $totalPengeluaran;
        
        // Total Donasi (Infaq + Sedekah + Zakat)
        $totalDonasi = Donation::confirmed()->sum('jumlah');
        
        // Total Janji Temu - Using JanjiTemu model
        $totalJanjiTemu = JanjiTemu::count();
        $janjiTemuPending = JanjiTemu::where('status', 'pending')->count();
        
        // Total Berita
        $totalBerita = BeritaKegiatan::count();
        
        // Statistik Bulanan - Using LaporanKas
        $monthlyIncome = LaporanKas::where('jenis', 'masuk')
            ->whereMonth('tanggal', Carbon::now()->month)
            ->whereYear('tanggal', Carbon::now()->year)
            ->sum('jumlah');
            
        $monthlyExpense = LaporanKas::where('jenis', 'keluar')
            ->whereMonth('tanggal', Carbon::now()->month)
            ->whereYear('tanggal', Carbon::now()->year)
            ->sum('jumlah');
            
        $monthlyDonations = Donation::confirmed()
            ->whereMonth('tanggal', Carbon::now()->month)
            ->whereYear('tanggal', Carbon::now()->year)
            ->sum('jumlah');

        return response()->json([
            'success' => true,
            'data' => [
                'totalKas' => $totalKas,
                'totalDonasi' => $totalDonasi,
                'totalJanjiTemu' => $totalJanjiTemu,
                'janjiTemuPending' => $janjiTemuPending,
                'totalBerita' => $totalBerita,
                'monthlyIncome' => $monthlyIncome,
                'monthlyExpense' => $monthlyExpense,
                'monthlyDonations' => $monthlyDonations,
                'totalPemasukan' => $totalPemasukan,
                'totalPengeluaran' => $totalPengeluaran
            ]
        ]);
    }
    
    public function apiHeroBanners()
    {
        // For now, return static hero banners for mosque management
        // Later this can be managed through admin panel
        $banners = [
            [
                'id' => 1,
                'title' => 'Selamat Datang di SIMASJID',
                'subtitle' => 'Sistem Informasi Masjid Terpadu',
                'description' => 'Platform digital untuk mengelola seluruh kegiatan masjid, keuangan, dan layanan keagamaan secara terintegrasi',
                'banner' => [
                    'path' => '/images/hero-banner-1.jpg'  // Default banner
                ]
            ],
            [
                'id' => 2,
                'title' => 'Kelola Keuangan Masjid',
                'subtitle' => 'Transparansi dan Akuntabilitas',
                'description' => 'Catat dan pantau pemasukan, pengeluaran, serta donasi masjid dengan sistem yang transparan',
                'banner' => [
                    'path' => '/images/hero-banner-2.jpg'  // Default banner
                ]
            ],
            [
                'id' => 3,
                'title' => 'Konsultasi Keagamaan',
                'subtitle' => 'Bersama Ustadz Terpercaya',
                'description' => 'Jadwalkan konsultasi dan bimbingan keagamaan dengan para ustadz berpengalaman',
                'banner' => [
                    'path' => '/images/hero-banner-3.jpg'  // Default banner
                ]
            ],
            [
                'id' => 4,
                'title' => 'Berita & Kegiatan Masjid',
                'subtitle' => 'Informasi Terkini',
                'description' => 'Dapatkan update terbaru tentang kegiatan, kajian, dan pengumuman masjid',
                'banner' => [
                    'path' => '/images/hero-banner-4.jpg'  // Default banner
                ]
            ]
        ];
        
        return response()->json([
            'success' => true,
            'data' => $banners
        ]);
    }
}

<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LaporanKasController;
use App\Http\Controllers\LaporanInfaqController;
use App\Http\Controllers\JanjiTemuController;
use App\Http\Controllers\BeritaKegiatanController;
use App\Http\Controllers\PengurusMasjidController;
use App\Http\Controllers\SholatController;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\UstadzController;

// Public Routes - No Authentication Required
Route::get('/', [DashboardController::class, 'index'])->name('home');
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard'); // Redirect compatibility

// SI Masjid Public Routes
Route::get('laporan-kas', [LaporanKasController::class, 'index'])->name('laporan-kas');
Route::get('laporan-infaq', [LaporanInfaqController::class, 'index'])->name('laporan-infaq');
Route::get('hitung-zakat', function () {
    return Inertia::render('hitung-zakat');
})->name('hitung-zakat');
Route::get('jam-sholat', function () {
    return Inertia::render('jam-sholat');
})->name('jam-sholat');
Route::get('janji-temu', [JanjiTemuController::class, 'index'])->name('janji-temu');
Route::post('janji-temu', [JanjiTemuController::class, 'store'])->name('janji-temu.store');
Route::get('berita-kegiatan', [BeritaKegiatanController::class, 'index'])->name('berita-kegiatan');
Route::get('berita-kegiatan/{beritaKegiatan}', [BeritaKegiatanController::class, 'show'])->name('berita-kegiatan.show');
Route::get('pengurus-masjid', [PengurusMasjidController::class, 'index'])->name('pengurus-masjid');

// Admin Routes
Route::prefix('admin')->group(function () {
    // Redirect /admin to dashboard if authenticated, login if not
    Route::get('/', function () {
        if (auth()->check()) {
            return redirect('/admin/dashboard');
        }
        return redirect('/admin/login');
    })->name('admin');
    
    // Dashboard route - protected by admin middleware
    Route::middleware(['admin', 'verified'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('admin/dashboard');
        })->name('admin.dashboard');
        
        Route::get('/pengurus-masjid', function () {
            return Inertia::render('admin/pengurus-masjid');
        })->name('admin.pengurus-masjid');
        
        Route::get('/janji-temu', function () {
            return Inertia::render('admin/janji-temu');
        })->name('admin.janji-temu');
        
        Route::get('/keuangan/donasi', function () {
            return Inertia::render('admin/keuangan/donasi');
        })->name('admin.keuangan.donasi');
        
        Route::get('/keuangan/kas', [LaporanKasController::class, 'adminIndex'])->name('admin.keuangan.kas');
        
        Route::get('/berita', function () {
            return Inertia::render('admin/berita');
        })->name('admin.berita');
    });
    
    // Auth routes (login, register, etc.)
    require __DIR__.'/auth.php';
});

// API Routes for Frontend
Route::prefix('api')->group(function () {
    Route::get('sholat-times', [SholatController::class, 'getSholatTimes'])->name('api.sholat-times');
    
    // Berita/Articles API
    Route::get('articles', [BeritaKegiatanController::class, 'apiIndex'])->name('api.articles.index');
    Route::get('articles/{id}', [BeritaKegiatanController::class, 'apiShow'])->name('api.articles.show');
    Route::get('articles/featured', [BeritaKegiatanController::class, 'apiFeatured'])->name('api.articles.featured');
    
    // Berita Kegiatan API (alternative endpoints)
    Route::get('berita-kegiatan', [BeritaKegiatanController::class, 'apiIndex'])->name('api.berita-kegiatan.index');
    Route::get('berita-kegiatan/{id}', [BeritaKegiatanController::class, 'apiShow'])->name('api.berita-kegiatan.show');
    Route::get('berita-kegiatan/featured', [BeritaKegiatanController::class, 'apiFeatured'])->name('api.berita-kegiatan.featured');
    
    // Pengurus Masjid API
    Route::get('pengurus-masjid', [PengurusMasjidController::class, 'apiIndex'])->name('api.pengurus-masjid.index');
    
    // Janji Temu API
    Route::get('janji-temu', [JanjiTemuController::class, 'apiIndex'])->name('api.janji-temu.index');
    Route::post('janji-temu', [JanjiTemuController::class, 'apiStore'])->name('api.janji-temu.store');
    
    // Ustadz API
    Route::get('ustadz', [UstadzController::class, 'index'])->name('api.ustadz.index');
    Route::post('ustadz', [UstadzController::class, 'store'])->name('api.ustadz.store');
    Route::put('ustadz/{ustadz}', [UstadzController::class, 'update'])->name('api.ustadz.update');
    Route::delete('ustadz/{ustadz}', [UstadzController::class, 'destroy'])->name('api.ustadz.destroy');
    
    // Laporan API
    Route::get('laporan-kas', [LaporanKasController::class, 'apiIndex'])->name('api.laporan-kas.index');
    Route::get('laporan-infaq', [LaporanInfaqController::class, 'apiIndex'])->name('api.laporan-infaq.index');
    
    // Statistics API
    Route::get('statistics/summary', [DashboardController::class, 'apiStatistics'])->name('api.statistics.summary');
    Route::get('statistics/donations', [LaporanInfaqController::class, 'apiStatistics'])->name('api.statistics.donations');
    Route::get('statistics/transactions', [LaporanKasController::class, 'apiStatistics'])->name('api.statistics.transactions');
    
    // Hero Banner API
    Route::get('hero-banners', [DashboardController::class, 'apiHeroBanners'])->name('api.hero-banners');
});

// Admin Only Routes (Hidden)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('laporan-kas', [LaporanKasController::class, 'store'])->name('laporan-kas.store');
    Route::put('laporan-kas/{laporanKas}', [LaporanKasController::class, 'update'])->name('laporan-kas.update');
    Route::delete('laporan-kas/{laporanKas}', [LaporanKasController::class, 'destroy'])->name('laporan-kas.destroy');
    
    Route::post('laporan-infaq', [LaporanInfaqController::class, 'store'])->name('laporan-infaq.store');
    Route::put('laporan-infaq/{donation}', [LaporanInfaqController::class, 'update'])->name('laporan-infaq.update');
    Route::delete('laporan-infaq/{donation}', [LaporanInfaqController::class, 'destroy'])->name('laporan-infaq.destroy');
    
    Route::put('janji-temu/{janjiTemu}', [JanjiTemuController::class, 'update'])->name('janji-temu.update');
    Route::delete('janji-temu/{janjiTemu}', [JanjiTemuController::class, 'destroy'])->name('janji-temu.destroy');
    
    Route::post('berita-kegiatan', [BeritaKegiatanController::class, 'store'])->name('berita-kegiatan.store');
    Route::put('berita-kegiatan/{beritaKegiatan}', [BeritaKegiatanController::class, 'update'])->name('berita-kegiatan.update');
    Route::delete('berita-kegiatan/{beritaKegiatan}', [BeritaKegiatanController::class, 'destroy'])->name('berita-kegiatan.destroy');
    
    Route::post('pengurus-masjid', [PengurusMasjidController::class, 'store'])->name('pengurus-masjid.store');
    Route::put('pengurus-masjid/{pengurusMasjid}', [PengurusMasjidController::class, 'update'])->name('pengurus-masjid.update');
    Route::delete('pengurus-masjid/{pengurusMasjid}', [PengurusMasjidController::class, 'destroy'])->name('pengurus-masjid.destroy');
    
    Route::get('ustadz', [UstadzController::class, 'index'])->name('ustadz.index');
    Route::post('ustadz', [UstadzController::class, 'store'])->name('ustadz.store');
    Route::put('ustadz/{ustadz}', [UstadzController::class, 'update'])->name('ustadz.update');
    Route::delete('ustadz/{ustadz}', [UstadzController::class, 'destroy'])->name('ustadz.destroy');
});

require __DIR__.'/settings.php';

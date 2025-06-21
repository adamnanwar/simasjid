<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class LaporanInfaqController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());
        $kategori = $request->input('kategori', 'all');
        $status = $request->input('status', 'confirmed');

        $query = Donation::whereBetween('tanggal', [$startDate, $endDate]);

        if ($kategori !== 'all') {
            $query->where('kategori', $kategori);
        }

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $donations = $query->orderBy('tanggal', 'desc')->get();

        // Statistik
        $totalInfaq = Donation::confirmed()
            ->infaq()
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->sum('jumlah');

        $totalSedekah = Donation::confirmed()
            ->sedekah()
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->sum('jumlah');

        $totalZakat = Donation::confirmed()
            ->zakat()
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->sum('jumlah');

        $totalDonasi = $totalInfaq + $totalSedekah + $totalZakat;

        // Top donatur
        $topDonors = Donation::confirmed()
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->where('anonim', false)
            ->selectRaw('nama_donatur, SUM(jumlah) as total_donasi, COUNT(*) as jumlah_donasi')
            ->groupBy('nama_donatur')
            ->orderBy('total_donasi', 'desc')
            ->take(10)
            ->get();

        // Donasi berdasarkan program
        $donationsByProgram = Donation::confirmed()
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->selectRaw('program, kategori, SUM(jumlah) as total')
            ->groupBy('program', 'kategori')
            ->orderBy('total', 'desc')
            ->get();

        // Donasi berdasarkan metode
        $donationsByMethod = Donation::confirmed()
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->selectRaw('metode, SUM(jumlah) as total, COUNT(*) as count')
            ->groupBy('metode')
            ->orderBy('total', 'desc')
            ->get();

        return Inertia::render('laporan-infaq', [
            'donations' => $donations,
            'summary' => [
                'totalInfaq' => $totalInfaq,
                'totalSedekah' => $totalSedekah,
                'totalZakat' => $totalZakat,
                'totalDonasi' => $totalDonasi,
                'totalDonatur' => $donations->where('anonim', false)->groupBy('nama_donatur')->count(),
                'totalTransaksi' => $donations->count()
            ],
            'topDonors' => $topDonors,
            'donationsByProgram' => $donationsByProgram,
            'donationsByMethod' => $donationsByMethod,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'kategori' => $kategori,
                'status' => $status
            ]
        ]);
    }

    // API Methods for Frontend
    public function apiIndex(Request $request)
    {
        $query = Donation::orderBy('tanggal', 'desc');
        
        // Filter by kategori
        if ($request->has('kategori') && $request->kategori !== 'all') {
            $query->where('kategori', $request->kategori);
        }
        
        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        }
        
        $perPage = $request->get('per_page', 10);
        $donations = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $donations->items(),
            'meta' => [
                'current_page' => $donations->currentPage(),
                'last_page' => $donations->lastPage(),
                'per_page' => $donations->perPage(),
                'total' => $donations->total(),
            ]
        ])->header('Cache-Control', 'no-cache, no-store, must-revalidate')
          ->header('Pragma', 'no-cache')
          ->header('Expires', '0');
    }
    
    public function apiStatistics(Request $request)
    {
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());
        
        // Total per kategori
        $totalInfaq = Donation::confirmed()
            ->where('kategori', 'Infaq')
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->sum('jumlah');

        $totalSedekah = Donation::confirmed()
            ->where('kategori', 'Sedekah')
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->sum('jumlah');

        $totalZakat = Donation::confirmed()
            ->where('kategori', 'Zakat')
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->sum('jumlah');

        $totalDonasi = $totalInfaq + $totalSedekah + $totalZakat;

        // Top donatur
        $topDonors = Donation::confirmed()
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->where('anonim', false)
            ->selectRaw('nama_donatur, SUM(jumlah) as total_donasi, COUNT(*) as jumlah_donasi')
            ->groupBy('nama_donatur')
            ->orderBy('total_donasi', 'desc')
            ->take(5)
            ->get();

        // Donasi berdasarkan metode pembayaran
        $donationsByMethod = Donation::confirmed()
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->selectRaw('metode, SUM(jumlah) as total, COUNT(*) as count')
            ->groupBy('metode')
            ->orderBy('total', 'desc')
            ->get();

        // Recent donations
        $recentDonations = Donation::confirmed()
            ->orderBy('tanggal', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'totalInfaq' => $totalInfaq,
                    'totalSedekah' => $totalSedekah,
                    'totalZakat' => $totalZakat,
                    'totalDonasi' => $totalDonasi,
                ],
                'topDonors' => $topDonors,
                'donationsByMethod' => $donationsByMethod,
                'recentDonations' => $recentDonations
            ]
        ])->header('Cache-Control', 'no-cache, no-store, must-revalidate')
          ->header('Pragma', 'no-cache')
          ->header('Expires', '0');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_donatur' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'tanggal' => 'required|date',
            'kategori' => 'required|in:Infaq,Sedekah,Zakat',
            'program' => 'required|string|max:255',
            'jumlah' => 'required|numeric|min:0',
            'metode' => 'required|in:Tunai,Transfer Bank,E-Wallet,Kartu Kredit',
            'anonim' => 'boolean',
            'description' => 'nullable|string'
        ]);

        // Set default values untuk field yang kosong
        $nama_donatur = $request->nama_donatur ?: 'Hamba Allah';
        $email = $request->email ?: 'hamba.allah@alikhlash.com';
        $phone = $request->phone ?: '-';

        $donation = Donation::create([
            'nama_donatur' => $nama_donatur,
            'email' => $email,
            'phone' => $phone,
            'tanggal' => $request->tanggal,
            'kategori' => $request->kategori,
            'program' => $request->program,
            'jumlah' => $request->jumlah,
            'metode' => $request->metode,
            'status' => 'pending',
            'anonim' => $request->boolean('anonim'),
            'description' => $request->description
        ]);

        // Return JSON for API calls, redirect for web requests
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Donasi berhasil ditambahkan',
                'data' => $donation
            ])->header('Cache-Control', 'no-cache, no-store, must-revalidate')
              ->header('Pragma', 'no-cache')
              ->header('Expires', '0');
        }

        return redirect()->back()->with('success', 'Donasi berhasil ditambahkan');
    }

    public function update(Request $request, Donation $donation)
    {
        $request->validate([
            'nama_donatur' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'tanggal' => 'required|date',
            'kategori' => 'required|in:Infaq,Sedekah,Zakat',
            'program' => 'required|string|max:255',
            'jumlah' => 'required|numeric|min:0',
            'metode' => 'required|in:Tunai,Transfer Bank,E-Wallet,Kartu Kredit',
            'anonim' => 'boolean',
            'description' => 'nullable|string'
        ]);

        // Set default values untuk field yang kosong
        $nama_donatur = $request->nama_donatur ?: 'Hamba Allah';
        $email = $request->email ?: 'hamba.allah@alikhlash.com';
        $phone = $request->phone ?: '-';

        $donation->update([
            'nama_donatur' => $nama_donatur,
            'email' => $email,
            'phone' => $phone,
            'tanggal' => $request->tanggal,
            'kategori' => $request->kategori,
            'program' => $request->program,
            'jumlah' => $request->jumlah,
            'metode' => $request->metode,
            'anonim' => $request->boolean('anonim'),
            'description' => $request->description
        ]);

        return back()->with('message', 'Donasi berhasil diperbarui!');
    }

    public function destroy(Donation $donation)
    {
        $donation->delete();

        // Return JSON response for API calls, redirect for form submissions
        if (request()->expectsJson() || request()->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Donasi berhasil dihapus!'
            ])->header('Cache-Control', 'no-cache, no-store, must-revalidate')
              ->header('Pragma', 'no-cache')
              ->header('Expires', '0');
        }

        return back()->with('message', 'Donasi berhasil dihapus!');
    }
}

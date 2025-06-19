<?php

namespace App\Http\Controllers;

use App\Models\LaporanKas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanKasController extends Controller
{
    public function index()
    {
        // Get real data from database for public view
        $laporanKas = LaporanKas::orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform data to match the expected format for public view
        $transactions = $laporanKas->map(function ($item) {
            return [
                'id' => $item->id,
                'tanggal' => $item->tanggal->format('Y-m-d'),
                'kategori' => $item->jenis === 'masuk' ? 'Pemasukan' : 'Pengeluaran',
                'sumber' => $item->kategori,
                'jumlah' => $item->jenis === 'masuk' ? (float) $item->jumlah : -(float) $item->jumlah,
                'keterangan' => $item->keterangan,
                'status' => 'verified'
            ];
        });

        $totalPemasukan = $laporanKas->where('jenis', 'masuk')->sum('jumlah');
        $totalPengeluaran = $laporanKas->where('jenis', 'keluar')->sum('jumlah');
        $saldo = $totalPemasukan - $totalPengeluaran;

        $summary = [
            'totalPemasukan' => (float) $totalPemasukan,
            'totalPengeluaran' => (float) $totalPengeluaran,
            'saldo' => (float) $saldo,
            'totalTransaksi' => $transactions->count()
        ];

        // Group transactions by source/kategori for additional analysis
        $transactionsBySumber = $laporanKas->groupBy('kategori')->map(function ($group, $kategori) {
            return [
                'kategori' => $kategori,
                'total_masuk' => $group->where('jenis', 'masuk')->sum('jumlah'),
                'total_keluar' => $group->where('jenis', 'keluar')->sum('jumlah'),
                'count' => $group->count()
            ];
        })->values();

        return Inertia::render('laporan-kas', [
            'transactions' => $transactions->toArray(),
            'summary' => $summary,
            'transactionsBySumber' => $transactionsBySumber->toArray(),
            'filters' => [
                'start_date' => '',
                'end_date' => '',
                'kategori' => '',
                'status' => ''
            ]
        ]);
    }

    // Admin method for handling admin kas page
    public function adminIndex()
    {
        $laporanKas = LaporanKas::orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Transform data for better frontend compatibility
        $laporanKas->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'jenis' => $item->jenis,
                'keterangan' => $item->keterangan,
                'jumlah' => (float) $item->jumlah,
                'tanggal' => $item->tanggal->format('Y-m-d'),
                'kategori' => $item->kategori,
                'created_at' => $item->created_at->toISOString(),
            ];
        });

        return Inertia::render('admin/keuangan/kas', [
            'laporanKas' => $laporanKas
        ]);
    }

    // API Methods for Frontend
    public function apiIndex(Request $request)
    {
        $query = LaporanKas::orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc');
        
        // Filter by jenis if provided
        if ($request->has('jenis') && $request->jenis !== 'all') {
            $query->where('jenis', $request->jenis);
        }
        
        // Filter by kategori if provided
        if ($request->has('kategori')) {
            $query->where('kategori', $request->kategori);
        }
        
        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('keterangan', 'like', '%' . $request->search . '%')
                  ->orWhere('kategori', 'like', '%' . $request->search . '%');
            });
        }
        
        $perPage = $request->get('per_page', 50);
        $laporanKas = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $laporanKas->items(),
            'meta' => [
                'current_page' => $laporanKas->currentPage(),
                'last_page' => $laporanKas->lastPage(),
                'per_page' => $laporanKas->perPage(),
                'total' => $laporanKas->total(),
            ]
        ]);
    }

    public function apiStatistics(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->input('end_date', now()->endOfMonth()->format('Y-m-d'));
        
        // Get transactions within date range
        $transactions = LaporanKas::whereBetween('tanggal', [$startDate, $endDate])->get();
        
        $totalMasuk = $transactions->where('jenis', 'masuk')->sum('jumlah');
        $totalKeluar = $transactions->where('jenis', 'keluar')->sum('jumlah');
        $saldo = $totalMasuk - $totalKeluar;

        // Recent transactions
        $recentTransactions = LaporanKas::orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Transactions by category
        $transactionsByCategory = LaporanKas::selectRaw('kategori, jenis, SUM(jumlah) as total, COUNT(*) as count')
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->groupBy('kategori', 'jenis')
            ->orderBy('total', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'totalMasuk' => (float) $totalMasuk,
                    'totalKeluar' => (float) $totalKeluar,
                    'saldo' => (float) $saldo,
                    'totalTransaksi' => $transactions->count()
                ],
                'recentTransactions' => $recentTransactions,
                'transactionsByCategory' => $transactionsByCategory
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'jenis' => 'required|in:masuk,keluar',
            'keterangan' => 'required|string|max:255',
            'jumlah' => 'required|numeric|min:0',
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:100',
        ]);

        $laporanKas = LaporanKas::create($request->all());

        // Return proper Inertia redirect response instead of JSON
        return redirect()->route('admin.keuangan.kas')->with('success', 'Transaksi kas berhasil ditambahkan!');
    }

    public function show(LaporanKas $laporanKas)
    {
        return response()->json([
            'success' => true,
            'data' => $laporanKas
        ]);
    }

    public function update(Request $request, LaporanKas $laporanKas)
    {
        $request->validate([
            'jenis' => 'required|in:masuk,keluar',
            'keterangan' => 'required|string|max:255',
            'jumlah' => 'required|numeric|min:0',
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:100',
        ]);

        $laporanKas->update($request->all());

        // Return proper Inertia redirect response instead of JSON
        return redirect()->route('admin.keuangan.kas')->with('success', 'Transaksi kas berhasil diperbarui!');
    }

    public function destroy(LaporanKas $laporanKas)
    {
        $laporanKas->delete();

        // Return proper Inertia redirect response instead of JSON
        return redirect()->route('admin.keuangan.kas')->with('success', 'Transaksi kas berhasil dihapus!');
    }
}

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

        return redirect()->route('admin.keuangan.kas')->with('success', 'Transaksi kas berhasil dihapus!');
    }

    public function exportPDF(Request $request)
    {
        try {
            $data = $request->all();
            
            // Create PDF content using TCPDF or similar library
            $pdf = new \TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
            
            // Set document information
            $pdf->SetCreator('SIMASJID');
            $pdf->SetAuthor('Masjid Al-Ikhlash');
            $pdf->SetTitle('Laporan Kas Masjid');
            $pdf->SetSubject('Laporan Keuangan');
            
            // Set margins
            $pdf->SetMargins(15, 20, 15);
            $pdf->SetAutoPageBreak(TRUE, 25);
            
            // Add a page
            $pdf->AddPage();
            
            // Set font
            $pdf->SetFont('helvetica', 'B', 16);
            
            // Title
            $pdf->Cell(0, 10, 'LAPORAN KAS MASJID AL-IKHLASH', 0, 1, 'C');
            $pdf->Ln(5);
            
            // Period info
            $pdf->SetFont('helvetica', '', 12);
            $pdf->Cell(0, 10, 'Periode: ' . ucfirst(str_replace('-', ' ', $data['period'] ?? 'Semua')), 0, 1, 'C');
            $pdf->Cell(0, 10, 'Tanggal Cetak: ' . date('d/m/Y H:i:s'), 0, 1, 'C');
            $pdf->Ln(10);
            
            // Summary section
            $pdf->SetFont('helvetica', 'B', 14);
            $pdf->Cell(0, 10, 'RINGKASAN KEUANGAN', 0, 1, 'L');
            $pdf->Ln(5);
            
            $pdf->SetFont('helvetica', '', 11);
            
            // Summary table
            $html = '<table border="1" cellspacing="0" cellpadding="5">
                <tr style="background-color:#f2f2f2;">
                    <th width="33%">Total Pemasukan</th>
                    <th width="33%">Total Pengeluaran</th>
                    <th width="34%">Saldo Akhir</th>
                </tr>
                <tr>
                    <td width="33%" align="center">Rp ' . number_format($data['summary']['totalPemasukan'] ?? 0, 0, ',', '.') . '</td>
                    <td width="33%" align="center">Rp ' . number_format($data['summary']['totalPengeluaran'] ?? 0, 0, ',', '.') . '</td>
                    <td width="34%" align="center">Rp ' . number_format($data['summary']['saldo'] ?? 0, 0, ',', '.') . '</td>
                </tr>
            </table>';
            
            $pdf->writeHTML($html, true, false, true, false, '');
            $pdf->Ln(10);
            
            // Transactions table
            $pdf->SetFont('helvetica', 'B', 14);
            $pdf->Cell(0, 10, 'DETAIL TRANSAKSI', 0, 1, 'L');
            $pdf->Ln(5);
            
            $transactionHtml = '<table border="1" cellspacing="0" cellpadding="3">
                <tr style="background-color:#f2f2f2;">
                    <th width="15%">Tanggal</th>
                    <th width="15%">Kategori</th>
                    <th width="20%">Sumber</th>
                    <th width="15%">Jumlah</th>
                    <th width="25%">Keterangan</th>
                    <th width="10%">Status</th>
                </tr>';
            
            foreach ($data['transactions'] ?? [] as $transaction) {
                $amount = $transaction['jumlah'] ?? 0;
                $color = $amount > 0 ? 'color: green;' : 'color: red;';
                $transactionHtml .= '<tr>
                    <td width="15%">' . date('d/m/Y', strtotime($transaction['tanggal'] ?? '')) . '</td>
                    <td width="15%">' . ($transaction['kategori'] ?? '') . '</td>
                    <td width="20%">' . ($transaction['sumber'] ?? '') . '</td>
                    <td width="15%" style="' . $color . '">Rp ' . number_format(abs($amount), 0, ',', '.') . '</td>
                    <td width="25%">' . ($transaction['keterangan'] ?? '') . '</td>
                    <td width="10%">' . (($transaction['status'] ?? '') === 'verified' ? 'Verified' : 'Pending') . '</td>
                </tr>';
            }
            
            $transactionHtml .= '</table>';
            $pdf->writeHTML($transactionHtml, true, false, true, false, '');
            
            // Output PDF
            $filename = 'laporan-kas-' . ($data['period'] ?? 'semua') . '-' . date('Y-m-d') . '.pdf';
            
            return response($pdf->Output($filename, 'S'), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
            
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal membuat PDF: ' . $e->getMessage()], 500);
        }
    }
}

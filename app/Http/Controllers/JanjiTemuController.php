<?php

namespace App\Http\Controllers;

use App\Models\JanjiTemu;
use App\Models\Ustadz;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class JanjiTemuController extends Controller
{
    public function index()
    {
        // Mengurutkan berdasarkan tanggal dan waktu terdekat dengan waktu sekarang
        $janjiTemu = JanjiTemu::with('ustadz')->orderByRaw("
            ABS(TIMESTAMPDIFF(SECOND, CONCAT(tanggal, ' ', waktu, ':00'), NOW()))
        ")->paginate(10);

        // Ambil data ustadz yang aktif
        $ustadz = Ustadz::where('active', true)->get();

        return Inertia::render('janji-temu', [
            'janjiTemu' => $janjiTemu,
            'ustadz' => $ustadz
        ]);
    }

    // API Methods for Frontend
    public function apiIndex(Request $request)
    {
        $query = JanjiTemu::with('ustadz')->orderByRaw("
            ABS(TIMESTAMPDIFF(SECOND, CONCAT(tanggal, ' ', waktu, ':00'), NOW()))
        ");
        
        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        
        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->search . '%')
                  ->orWhere('keperluan', 'like', '%' . $request->search . '%');
            });
        }
        
        $perPage = $request->get('per_page', 50);
        $janjiTemu = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $janjiTemu->items(),
            'meta' => [
                'current_page' => $janjiTemu->currentPage(),
                'last_page' => $janjiTemu->lastPage(),
                'per_page' => $janjiTemu->perPage(),
                'total' => $janjiTemu->total(),
            ]
        ])->header('Cache-Control', 'no-cache, no-store, must-revalidate')
          ->header('Pragma', 'no-cache')
          ->header('Expires', '0');
    }
    
    public function apiStore(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email',
            'telepon' => 'required|string',
            'tanggal' => 'required|date|after_or_equal:today',
            'waktu' => 'required|date_format:H:i',
            'keperluan' => 'required|string',
            'ustadz_id' => 'required|exists:ustadzs,id',
        ]);

        $janjiTemu = JanjiTemu::create([
            'nama' => $request->nama,
            'email' => $request->email,
            'telepon' => $request->telepon,
            'tanggal' => $request->tanggal,
            'waktu' => $request->waktu,
            'keperluan' => $request->keperluan,
            'ustadz_id' => $request->ustadz_id,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Janji temu berhasil dibuat',
            'data' => $janjiTemu
        ], 201);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email',
            'telepon' => 'required|string',
            'tanggal' => 'required|date|after_or_equal:today',
            'waktu' => 'required|date_format:H:i',
            'keperluan' => 'required|string',
            'ustadz_id' => 'required|exists:ustadzs,id',
        ]);

        JanjiTemu::create([
            'nama' => $request->nama,
            'email' => $request->email,
            'telepon' => $request->telepon,
            'tanggal' => $request->tanggal,
            'waktu' => $request->waktu,
            'keperluan' => $request->keperluan,
            'ustadz_id' => $request->ustadz_id,
            'status' => 'pending',
        ]);

        return back()->with('message', 'Janji temu berhasil dibuat');
    }

    public function update(Request $request, JanjiTemu $janjiTemu)
    {
        // If only updating status (for approve/reject)
        if ($request->has('status') && count($request->all()) == 1) {
            $request->validate([
                'status' => 'required|in:pending,approved,rejected'
            ]);

            $janjiTemu->update([
                'status' => $request->status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status janji temu berhasil diperbarui',
                'data' => $janjiTemu
            ]);
        }

        // Full update (for edit form)
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email',
            'telepon' => 'required|string',
            'tanggal' => 'required|date',
            'waktu' => 'required|date_format:H:i',
            'keperluan' => 'required|string',
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $janjiTemu->update([
            'nama' => $request->nama,
            'email' => $request->email,
            'telepon' => $request->telepon,
            'tanggal' => $request->tanggal,
            'waktu' => $request->waktu,
            'keperluan' => $request->keperluan,
            'status' => $request->status,
        ]);

        return back()->with('message', 'Janji temu berhasil diperbarui');
    }

    public function destroy(JanjiTemu $janjiTemu)
    {
        $janjiTemu->delete();
        
        return back()->with('message', 'Janji temu berhasil dihapus');
    }

    // Admin methods
    public function adminIndex()
    {
        $janjiTemu = JanjiTemu::with('ustadz')
            ->orderBy('tanggal', 'desc')
            ->orderBy('waktu', 'desc')
            ->paginate(15);

        $ustadz = Ustadz::where('active', true)->get();

        // Statistics
        $totalJanjiTemu = JanjiTemu::count();
        $pendingJanjiTemu = JanjiTemu::where('status', 'pending')->count();
        $approvedJanjiTemu = JanjiTemu::where('status', 'approved')->count();
        $rejectedJanjiTemu = JanjiTemu::where('status', 'rejected')->count();

        return Inertia::render('admin/janji-temu', [
            'janjiTemu' => $janjiTemu,
            'ustadz' => $ustadz,
            'stats' => [
                'total' => $totalJanjiTemu,
                'pending' => $pendingJanjiTemu,
                'approved' => $approvedJanjiTemu,
                'rejected' => $rejectedJanjiTemu,
            ]
        ]);
    }

    public function updateStatus(Request $request, JanjiTemu $janjiTemu)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $janjiTemu->update([
            'status' => $request->status
        ]);

        return back()->with('message', 'Status janji temu berhasil diperbarui');
    }

    public function storeUstadz(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'bidang_keahlian' => 'required|string|max:255',
            'jadwal_tersedia' => 'required|array',
            'jadwal_tersedia.*.hari' => 'required|string',
            'jadwal_tersedia.*.jam_mulai' => 'required|string',
            'jadwal_tersedia.*.jam_selesai' => 'required|string',
            'active' => 'boolean'
        ]);

        $ustadz = Ustadz::create([
            'nama' => $request->nama,
            'bidang_keahlian' => $request->bidang_keahlian,
            'jadwal_tersedia' => $request->jadwal_tersedia,
            'active' => $request->get('active', true)
        ]);

        return back()->with('message', 'Ustadz berhasil ditambahkan');
    }
}

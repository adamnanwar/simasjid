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
        $janjiTemu = JanjiTemu::orderByRaw("
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
        $query = JanjiTemu::orderByRaw("
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
        ]);
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
        ]);

        $janjiTemu = JanjiTemu::create([
            'nama' => $request->nama,
            'email' => $request->email,
            'telepon' => $request->telepon,
            'tanggal' => $request->tanggal,
            'waktu' => $request->waktu,
            'keperluan' => $request->keperluan,
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
        ]);

        JanjiTemu::create([
            'nama' => $request->nama,
            'email' => $request->email,
            'telepon' => $request->telepon,
            'tanggal' => $request->tanggal,
            'waktu' => $request->waktu,
            'keperluan' => $request->keperluan,
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
}

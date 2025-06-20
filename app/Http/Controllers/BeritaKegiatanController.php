<?php

namespace App\Http\Controllers;

use App\Models\BeritaKegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BeritaKegiatanController extends Controller
{
    public function index()
    {
        $beritaKegiatan = BeritaKegiatan::orderBy('tanggal_publikasi', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('berita-kegiatan', [
            'beritaKegiatan' => $beritaKegiatan
        ]);
    }

    public function show(BeritaKegiatan $beritaKegiatan)
    {
        return Inertia::render('berita-kegiatan-detail', [
            'berita' => $beritaKegiatan
        ]);
    }

    // API Methods for Frontend
    public function apiIndex(Request $request)
    {
        $query = BeritaKegiatan::orderBy('tanggal_publikasi', 'desc')
            ->orderBy('created_at', 'desc');
        
        // Filter by type if provided
        if ($request->has('jenis')) {
            $query->where('jenis', $request->jenis);
        }
        
        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where(function($q) use ($request) {
                $q->where('judul', 'like', '%' . $request->search . '%')
                  ->orWhere('konten', 'like', '%' . $request->search . '%');
            });
        }
        
        $perPage = $request->get('per_page', 12);
        $beritaKegiatan = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $beritaKegiatan->items(),
            'meta' => [
                'current_page' => $beritaKegiatan->currentPage(),
                'last_page' => $beritaKegiatan->lastPage(),
                'per_page' => $beritaKegiatan->perPage(),
                'total' => $beritaKegiatan->total(),
            ]
        ]);
    }
    
    public function apiShow($id)
    {
        $berita = BeritaKegiatan::find($id);
        
        if (!$berita) {
            return response()->json([
                'success' => false,
                'message' => 'Berita not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $berita
        ]);
    }
    
    public function apiFeatured()
    {
        $featured = BeritaKegiatan::orderBy('tanggal_publikasi', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $featured
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'tanggal_kegiatan' => 'nullable|date',
            'jenis' => 'required|in:berita,kegiatan'
        ]);

        $data = $request->only(['judul', 'konten', 'tanggal_kegiatan', 'jenis']);
        $data['slug'] = Str::slug($request->judul);
        $data['tanggal_publikasi'] = now();
        $data['penulis'] = auth()->user()->name;

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('berita-kegiatan', 'public');
        }

        BeritaKegiatan::create($data);

        return back()->with('message', 'Berita/Kegiatan berhasil ditambahkan!');
    }

    public function update(Request $request, BeritaKegiatan $beritaKegiatan)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'konten' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'tanggal_kegiatan' => 'nullable|date',
            'jenis' => 'required|in:berita,kegiatan'
        ]);

        $data = $request->only(['judul', 'konten', 'tanggal_kegiatan', 'jenis']);
        $data['slug'] = Str::slug($request->judul);

        if ($request->hasFile('gambar')) {
            // Delete old image
            if ($beritaKegiatan->gambar) {
                Storage::disk('public')->delete($beritaKegiatan->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('berita-kegiatan', 'public');
        }

        $beritaKegiatan->update($data);

        return back()->with('message', 'Berita/Kegiatan berhasil diperbarui!');
    }

    public function destroy(BeritaKegiatan $beritaKegiatan)
    {
        if ($beritaKegiatan->gambar) {
            Storage::disk('public')->delete($beritaKegiatan->gambar);
        }
        
        $beritaKegiatan->delete();

        return back()->with('message', 'Berita/Kegiatan berhasil dihapus!');
    }
} 
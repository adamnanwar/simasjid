<?php

namespace App\Http\Controllers;

use App\Models\KegiatanMendatang;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class KegiatanMendatangController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kegiatan = KegiatanMendatang::orderBy('tanggal_mulai', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        // Transform data for better frontend compatibility
        $kegiatan->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'judul' => $item->judul,
                'slug' => $item->slug,
                'deskripsi' => $item->deskripsi,
                'gambar' => $item->gambar,
                'tanggal_mulai' => $item->tanggal_mulai->format('Y-m-d'),
                'tanggal_selesai' => $item->tanggal_selesai->format('Y-m-d'),
                'waktu_mulai' => $item->waktu_mulai,
                'waktu_selesai' => $item->waktu_selesai,
                'lokasi' => $item->lokasi,
                'penanggung_jawab' => $item->penanggung_jawab,
                'persyaratan' => $item->persyaratan,
                'kuota_peserta' => $item->kuota_peserta,
                'biaya_pendaftaran' => (float) $item->biaya_pendaftaran,
                'status' => $item->status,
                'is_featured' => $item->is_featured,
                'kontak_info' => $item->kontak_info,
                'catatan_tambahan' => $item->catatan_tambahan,
                'formatted_tanggal' => $item->formatted_tanggal,
                'formatted_waktu' => $item->formatted_waktu,
                'formatted_biaya' => $item->formatted_biaya,
                'status_badge' => $item->status_badge,
                'is_past_event' => $item->is_past_event,
                'created_at' => $item->created_at->toISOString(),
                'updated_at' => $item->updated_at->toISOString(),
            ];
        });

        return Inertia::render('admin/kegiatan-mendatang', [
            'kegiatan' => $kegiatan
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/kegiatan-mendatang-form', [
            'kegiatan' => null,
            'isEdit' => false
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'tanggal_mulai' => 'required|date|after_or_equal:today',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'waktu_mulai' => 'required|date_format:H:i',
            'waktu_selesai' => 'nullable|date_format:H:i|after:waktu_mulai',
            'lokasi' => 'required|string|max:255',
            'penanggung_jawab' => 'required|string|max:255',
            'persyaratan' => 'nullable|string',
            'kuota_peserta' => 'nullable|integer|min:1',
            'biaya_pendaftaran' => 'required|numeric|min:0',
            'status' => 'required|in:draft,published,cancelled',
            'is_featured' => 'boolean',
            'catatan_tambahan' => 'nullable|string',
            'kontak_phone' => 'nullable|string',
            'kontak_email' => 'nullable|email',
            'kontak_whatsapp' => 'nullable|string',
        ]);

        $data = $request->all();

        // Handle file upload
        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('kegiatan-mendatang', 'public');
        }

        // Handle kontak_info as JSON
        $data['kontak_info'] = [
            'phone' => $request->kontak_phone,
            'email' => $request->kontak_email,
            'whatsapp' => $request->kontak_whatsapp,
        ];

        // Remove the individual contact fields from data array
        unset($data['kontak_phone'], $data['kontak_email'], $data['kontak_whatsapp']);

        $kegiatan = KegiatanMendatang::create($data);

        return redirect()->route('admin.kegiatan-mendatang.index')->with('success', 'Kegiatan berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(KegiatanMendatang $kegiatanMendatang)
    {
        return response()->json([
            'success' => true,
            'data' => $kegiatanMendatang
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(KegiatanMendatang $kegiatanMendatang)
    {
        $kegiatanData = $kegiatanMendatang->toArray();
        $kegiatanData['tanggal_mulai'] = $kegiatanMendatang->tanggal_mulai->format('Y-m-d');
        $kegiatanData['tanggal_selesai'] = $kegiatanMendatang->tanggal_selesai->format('Y-m-d');
        $kegiatanData['waktu_mulai'] = $kegiatanMendatang->waktu_mulai;
        $kegiatanData['waktu_selesai'] = $kegiatanMendatang->waktu_selesai;
        
        // Extract contact info
        $kontakInfo = $kegiatanMendatang->kontak_info ?? [];
        $kegiatanData['kontak_phone'] = $kontakInfo['phone'] ?? '';
        $kegiatanData['kontak_email'] = $kontakInfo['email'] ?? '';
        $kegiatanData['kontak_whatsapp'] = $kontakInfo['whatsapp'] ?? '';

        return Inertia::render('admin/kegiatan-mendatang-form', [
            'kegiatan' => $kegiatanData,
            'isEdit' => true
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, KegiatanMendatang $kegiatanMendatang)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'waktu_mulai' => 'required|date_format:H:i',
            'waktu_selesai' => 'nullable|date_format:H:i|after:waktu_mulai',
            'lokasi' => 'required|string|max:255',
            'penanggung_jawab' => 'required|string|max:255',
            'persyaratan' => 'nullable|string',
            'kuota_peserta' => 'nullable|integer|min:1',
            'biaya_pendaftaran' => 'required|numeric|min:0',
            'status' => 'required|in:draft,published,cancelled',
            'is_featured' => 'boolean',
            'catatan_tambahan' => 'nullable|string',
            'kontak_phone' => 'nullable|string',
            'kontak_email' => 'nullable|email',
            'kontak_whatsapp' => 'nullable|string',
        ]);

        $data = $request->all();

        // Handle file upload
        if ($request->hasFile('gambar')) {
            // Delete old image if exists
            if ($kegiatanMendatang->gambar) {
                Storage::disk('public')->delete($kegiatanMendatang->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('kegiatan-mendatang', 'public');
        }

        // Handle kontak_info as JSON
        $data['kontak_info'] = [
            'phone' => $request->kontak_phone,
            'email' => $request->kontak_email,
            'whatsapp' => $request->kontak_whatsapp,
        ];

        // Remove the individual contact fields from data array
        unset($data['kontak_phone'], $data['kontak_email'], $data['kontak_whatsapp']);

        $kegiatanMendatang->update($data);

        return redirect()->route('admin.kegiatan-mendatang.index')->with('success', 'Kegiatan berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(KegiatanMendatang $kegiatanMendatang)
    {
        // Delete associated image if exists
        if ($kegiatanMendatang->gambar) {
            Storage::disk('public')->delete($kegiatanMendatang->gambar);
        }

        $kegiatanMendatang->delete();

        // Return JSON response for API calls, redirect for form submissions
        if (request()->expectsJson() || request()->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Kegiatan berhasil dihapus!'
            ]);
        }

        return redirect()->route('admin.kegiatan-mendatang.index')->with('success', 'Kegiatan berhasil dihapus!');
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured(KegiatanMendatang $kegiatanMendatang)
    {
        $kegiatanMendatang->update([
            'is_featured' => !$kegiatanMendatang->is_featured
        ]);

        return response()->json([
            'success' => true,
            'message' => $kegiatanMendatang->is_featured ? 'Kegiatan ditandai sebagai unggulan' : 'Kegiatan dihapus dari unggulan',
            'is_featured' => $kegiatanMendatang->is_featured
        ]);
    }

    /**
     * Update status
     */
    public function updateStatus(Request $request, KegiatanMendatang $kegiatanMendatang)
    {
        $request->validate([
            'status' => 'required|in:draft,published,cancelled'
        ]);

        $kegiatanMendatang->update([
            'status' => $request->status
        ]);

        $statusText = match($request->status) {
            'draft' => 'dijadikan draft',
            'published' => 'dipublikasi',
            'cancelled' => 'dibatalkan',
        };

        return response()->json([
            'success' => true,
            'message' => "Kegiatan berhasil {$statusText}",
            'status' => $kegiatanMendatang->status,
            'status_badge' => $kegiatanMendatang->status_badge
        ]);
    }

    /**
     * API Methods for Frontend
     */
    public function apiUpcoming(Request $request)
    {
        $perPage = $request->get('per_page', 6);
        
        $kegiatan = KegiatanMendatang::published()
            ->upcoming()
            ->orderBy('tanggal_mulai', 'asc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $kegiatan->items(),
            'meta' => [
                'current_page' => $kegiatan->currentPage(),
                'last_page' => $kegiatan->lastPage(),
                'per_page' => $kegiatan->perPage(),
                'total' => $kegiatan->total(),
            ]
        ]);
    }

    public function apiFeatured()
    {
        $kegiatan = KegiatanMendatang::published()
            ->featured()
            ->upcoming()
            ->orderBy('tanggal_mulai', 'asc')
            ->take(3)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->judul,
                    'slug' => $item->slug,
                    'description' => $item->deskripsi,
                    'tanggal_mulai' => $item->tanggal_mulai,
                    'tanggal_selesai' => $item->tanggal_selesai,
                    'waktu_mulai' => $item->waktu_mulai,
                    'waktu_selesai' => $item->waktu_selesai,
                    'lokasi' => $item->lokasi,
                    'penyelenggara' => $item->penanggung_jawab,
                    'image' => $item->gambar ? asset('storage/' . $item->gambar) : null,
                    'formatted_date' => $item->formatted_tanggal,
                    'formatted_time' => $item->formatted_waktu,
                    'is_featured' => $item->is_featured,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $kegiatan
        ]);
    }
}

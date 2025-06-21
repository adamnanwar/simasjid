<?php

namespace App\Http\Controllers;

use App\Models\PengurusMasjid;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PengurusMasjidController extends Controller
{
    public function index()
    {
        $pengurusMasjid = PengurusMasjid::orderBy('urutan')
            ->orderBy('nama')
            ->get();

        return Inertia::render('pengurus-masjid', [
            'pengurusMasjid' => $pengurusMasjid
        ]);
    }
    
    // API Methods for Frontend
    public function apiIndex(Request $request)
    {
        $query = PengurusMasjid::orderBy('urutan')->orderBy('nama');
        
        // Filter by jabatan if provided
        if ($request->has('jabatan') && $request->jabatan) {
            $query->where('jabatan', 'like', '%' . $request->jabatan . '%');
        }
        
        $pengurusMasjid = $query->get();
        
        return response()->json([
            'success' => true,
            'data' => $pengurusMasjid
        ])->header('Cache-Control', 'no-cache, no-store, must-revalidate')
          ->header('Pragma', 'no-cache')
          ->header('Expires', '0');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'telepon' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'urutan' => 'nullable|integer'
        ]);

        $data = $request->only(['nama', 'jabatan', 'telepon', 'email', 'deskripsi', 'urutan']);

        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('pengurus-masjid', 'public');
        }

        // Handle automatic ordering
        $targetUrutan = $data['urutan'] ?? 1;
        
        // Shift existing pengurus with urutan >= targetUrutan
        PengurusMasjid::where('urutan', '>=', $targetUrutan)
            ->increment('urutan');
        
        $data['urutan'] = $targetUrutan;

        PengurusMasjid::create($data);

        return back()->with('message', 'Pengurus masjid berhasil ditambahkan!');
    }

    public function update(Request $request, PengurusMasjid $pengurusMasjid)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'telepon' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'deskripsi' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'urutan' => 'nullable|integer'
        ]);

        $data = $request->only(['nama', 'jabatan', 'telepon', 'email', 'deskripsi', 'urutan']);

        if ($request->hasFile('foto')) {
            // Delete old photo
            if ($pengurusMasjid->foto) {
                Storage::disk('public')->delete($pengurusMasjid->foto);
            }
            $data['foto'] = $request->file('foto')->store('pengurus-masjid', 'public');
        }

        // Handle automatic ordering if urutan is being changed
        $newUrutan = $data['urutan'] ?? $pengurusMasjid->urutan;
        $oldUrutan = $pengurusMasjid->urutan;
        
        if ($newUrutan != $oldUrutan) {
            if ($newUrutan > $oldUrutan) {
                // Moving down: shift items between old and new position up
                PengurusMasjid::where('urutan', '>', $oldUrutan)
                    ->where('urutan', '<=', $newUrutan)
                    ->where('id', '!=', $pengurusMasjid->id)
                    ->decrement('urutan');
            } else {
                // Moving up: shift items between new and old position down
                PengurusMasjid::where('urutan', '>=', $newUrutan)
                    ->where('urutan', '<', $oldUrutan)
                    ->where('id', '!=', $pengurusMasjid->id)
                    ->increment('urutan');
            }
        }
        
        $data['urutan'] = $newUrutan;

        $pengurusMasjid->update($data);

        return back()->with('message', 'Pengurus masjid berhasil diperbarui!');
    }

    public function destroy(PengurusMasjid $pengurusMasjid)
    {
        if ($pengurusMasjid->foto) {
            Storage::disk('public')->delete($pengurusMasjid->foto);
        }
        
        $pengurusMasjid->delete();

        return back()->with('message', 'Pengurus masjid berhasil dihapus!');
    }
} 
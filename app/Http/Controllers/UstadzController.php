<?php

namespace App\Http\Controllers;

use App\Models\Ustadz;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UstadzController extends Controller
{
    public function index()
    {
        $ustadz = Ustadz::all();
        
        return response()->json([
            'success' => true,
            'data' => $ustadz
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'specialization' => 'required|string|max:255',
            'experience' => 'required|string|max:255',
            'schedule' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'bio' => 'nullable|string',
            'active' => 'boolean'
        ]);

        $ustadz = Ustadz::create([
            'name' => $request->name,
            'specialization' => $request->specialization,
            'experience' => $request->experience,
            'schedule' => $request->schedule,
            'phone' => $request->phone,
            'email' => $request->email,
            'bio' => $request->bio,
            'active' => $request->boolean('active', true)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ustadz berhasil ditambahkan',
            'data' => $ustadz
        ], 201);
    }

    public function update(Request $request, Ustadz $ustadz)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'specialization' => 'required|string|max:255',
            'experience' => 'required|string|max:255',
            'schedule' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'bio' => 'nullable|string',
            'active' => 'boolean'
        ]);

        $ustadz->update([
            'name' => $request->name,
            'specialization' => $request->specialization,
            'experience' => $request->experience,
            'schedule' => $request->schedule,
            'phone' => $request->phone,
            'email' => $request->email,
            'bio' => $request->bio,
            'active' => $request->boolean('active', true)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ustadz berhasil diperbarui',
            'data' => $ustadz
        ]);
    }

    public function destroy(Ustadz $ustadz)
    {
        $ustadz->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ustadz berhasil dihapus'
        ]);
    }
} 
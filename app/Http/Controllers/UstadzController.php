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
        ])->header('Cache-Control', 'no-cache, no-store, must-revalidate')
          ->header('Pragma', 'no-cache')
          ->header('Expires', '0');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'specialization' => 'required|string|max:255',
            'experience' => 'required|string|max:255',
            'schedule_days' => 'required|array|min:1',
            'schedule_days.*' => 'in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'schedule_start_time' => 'required|date_format:H:i',
            'schedule_end_time' => 'required|date_format:H:i|after:schedule_start_time',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'bio' => 'nullable|string',
            'active' => 'boolean'
        ]);

        // Generate readable schedule for backward compatibility
        $scheduleText = implode(', ', $request->schedule_days) . ': ' . 
                       $request->schedule_start_time . '-' . $request->schedule_end_time;

        $ustadz = Ustadz::create([
            'name' => $request->name,
            'specialization' => $request->specialization,
            'experience' => $request->experience,
            'schedule' => $scheduleText,
            'schedule_days' => $request->schedule_days,
            'schedule_start_time' => $request->schedule_start_time,
            'schedule_end_time' => $request->schedule_end_time,
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
            'schedule_days' => 'required|array|min:1',
            'schedule_days.*' => 'in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'schedule_start_time' => 'required|date_format:H:i',
            'schedule_end_time' => 'required|date_format:H:i|after:schedule_start_time',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'bio' => 'nullable|string',
            'active' => 'boolean'
        ]);

        // Generate readable schedule for backward compatibility
        $scheduleText = implode(', ', $request->schedule_days) . ': ' . 
                       $request->schedule_start_time . '-' . $request->schedule_end_time;

        $ustadz->update([
            'name' => $request->name,
            'specialization' => $request->specialization,
            'experience' => $request->experience,
            'schedule' => $scheduleText,
            'schedule_days' => $request->schedule_days,
            'schedule_start_time' => $request->schedule_start_time,
            'schedule_end_time' => $request->schedule_end_time,
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
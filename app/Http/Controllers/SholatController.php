<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SholatController extends Controller
{
    public function getSholatTimes(Request $request)
    {
        try {
            $date = $request->input('date', date('d-m-Y'));
            
            // Try primary API
            try {
                $response = Http::timeout(10)->get("https://api.myquran.com/v2/sholat/jadwal/0506/{$date}");
                
                if ($response->successful()) {
                    $data = $response->json();
                    
                    if ($data['status'] === true && isset($data['data']['jadwal'])) {
                        $jadwal = $data['data']['jadwal'];
                        
                        return response()->json([
                            'success' => true,
                            'source' => 'myquran',
                            'data' => [
                                'shubuh' => $jadwal['shubuh'],
                                'dzuhur' => $jadwal['dzuhur'],
                                'ashar' => $jadwal['ashar'],
                                'maghrib' => $jadwal['maghrib'],
                                'isya' => $jadwal['isya']
                            ]
                        ]);
                    }
                }
            } catch (\Exception $e) {
                Log::warning('Primary sholat API failed: ' . $e->getMessage());
            }
            
            // Try fallback API
            try {
                $response = Http::timeout(10)->get("https://api.aladhan.com/v1/timingsByCity/{$date}?city=Batam&country=Indonesia&method=20");
                
                if ($response->successful()) {
                    $data = $response->json();
                    
                    if ($data['code'] === 200 && isset($data['data']['timings'])) {
                        $timings = $data['data']['timings'];
                        
                        return response()->json([
                            'success' => true,
                            'source' => 'aladhan',
                            'data' => [
                                'shubuh' => $timings['Fajr'],
                                'dzuhur' => $timings['Dhuhr'],
                                'ashar' => $timings['Asr'],
                                'maghrib' => $timings['Maghrib'],
                                'isya' => $timings['Isha']
                            ]
                        ]);
                    }
                }
            } catch (\Exception $e) {
                Log::warning('Fallback sholat API failed: ' . $e->getMessage());
            }
            
            // Return default times for Batam
            return response()->json([
                'success' => true,
                'source' => 'default',
                'data' => [
                    'shubuh' => '05:18',
                    'dzuhur' => '12:12',
                    'ashar' => '15:42',
                    'maghrib' => '18:26',
                    'isya' => '19:38'
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Sholat times error: ' . $e->getMessage());
            
            return response()->json([
                'success' => true,
                'source' => 'default',
                'data' => [
                    'shubuh' => '05:18',
                    'dzuhur' => '12:12',
                    'ashar' => '15:42',
                    'maghrib' => '18:26',
                    'isya' => '19:38'
                ]
            ]);
        }
    }
} 
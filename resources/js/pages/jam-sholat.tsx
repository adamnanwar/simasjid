import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Clock,
    MapPin,
    Calendar,
    Sun,
    Moon,
    Star,
    Sunrise,
    Sunset,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface PrayerTime {
    name: string;
    time: string;
    arabic: string;
    icon: any;
    color: string;
    isPassed: boolean;
    isNext: boolean;
}

export default function JamSholat() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [sholatTimes, setSholatTimes] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchSholatTimes();
    }, []);

    const fetchSholatTimes = async () => {
        try {
            const today = new Date();
            const year = today.getFullYear();
            const month = (today.getMonth() + 1).toString().padStart(2, '0');
            const day = today.getDate().toString().padStart(2, '0');
            const dateString = `${day}-${month}-${year}`;
            
            const response = await fetch(`/api/sholat-times?date=${dateString}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Jam Sholat API Response:', data); // Debug log
                
                if (data.success && data.data) {
                    setSholatTimes(data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching sholat times:', error);
        } finally {
            setLoading(false);
        }
    };

    // Default times as fallback
    const defaultTimes = {
        shubuh: '05:18',
        dzuhur: '12:12',
        ashar: '15:42',
        maghrib: '18:26',
        isya: '19:38'
    };

    const times = sholatTimes || defaultTimes;

    // Prayer times for Batam using API data
    const todayPrayerTimes: PrayerTime[] = [
        {
            name: 'Subuh',
            time: times.shubuh,
            arabic: 'الفجر',
            icon: Sunrise,
            color: 'bg-blue-500',
            isPassed: false,
            isNext: false
        },
        {
            name: 'Dzuhur',
            time: times.dzuhur,
            arabic: 'الظهر',
            icon: Sun,
            color: 'bg-yellow-500',
            isPassed: false,
            isNext: false
        },
        {
            name: 'Ashar',
            time: times.ashar,
            arabic: 'العصر',
            icon: Sun,
            color: 'bg-orange-500',
            isPassed: false,
            isNext: false
        },
        {
            name: 'Maghrib',
            time: times.maghrib,
            arabic: 'المغرب',
            icon: Sunset,
            color: 'bg-red-500',
            isPassed: false,
            isNext: false
        },
        {
            name: 'Isya',
            time: times.isya,
            arabic: 'العشاء',
            icon: Moon,
            color: 'bg-purple-500',
            isPassed: false,
            isNext: false
        }
    ];

    // Update isPassed status
    todayPrayerTimes.forEach(prayer => {
        const [hour, minute] = prayer.time.split(':').map(Number);
        prayer.isPassed = currentTime.getHours() > hour || 
                         (currentTime.getHours() === hour && currentTime.getMinutes() >= minute);
    });

    // Determine next prayer
    const getNextPrayer = () => {
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const currentTotalMinutes = currentHour * 60 + currentMinute;

        for (let prayer of todayPrayerTimes) {
            const [hour, minute] = prayer.time.split(':').map(Number);
            const prayerTotalMinutes = hour * 60 + minute;
            
            if (prayerTotalMinutes > currentTotalMinutes) {
                prayer.isNext = true;
                return prayer;
            }
        }
        
        // If no prayer left today, next is tomorrow's Subuh
        const nextPrayer = {...todayPrayerTimes[0]};
        nextPrayer.isNext = true;
        return nextPrayer;
    };

    const nextPrayer = getNextPrayer();

    // Calculate time until next prayer
    const getTimeUntilNextPrayer = () => {
        const now = new Date();
        const [hour, minute] = nextPrayer.time.split(':').map(Number);
        const nextPrayerTime = new Date();
        nextPrayerTime.setHours(hour, minute, 0, 0);

        if (nextPrayerTime <= now) {
            nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
        }

        const diff = nextPrayerTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { hours, minutes, seconds };
    };

    const timeUntilNext = getTimeUntilNextPrayer();

    // Monthly prayer times data using current API times
    const monthlyPrayerTimes = Array.from({ length: 30 }, (_, i) => ({
        date: i + 1,
        subuh: times.shubuh,
        dzuhur: times.dzuhur,
        ashar: times.ashar,
        maghrib: times.maghrib,
        isya: times.isya
    }));

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <MainLayout>
            <Head title="Jam Sholat Kota Batam - Sistem Informasi Masjid Al-Ikhlash" />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                            <Clock className="h-8 w-8 text-indigo-600" />
                            Jam Sholat Kota Batam
                        </h1>
                        <div className="mt-2 flex items-center justify-center gap-2 text-lg text-gray-600">
                            <MapPin className="h-5 w-5" />
                            Batam, Kepulauan Riau
                        </div>
                        <p className="mt-2 text-gray-500">
                            {formatDate(currentTime)} - {formatTime(currentTime)}
                        </p>
                    </div>

                    {/* Next Prayer Countdown */}
                    <Card className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
                        <CardContent className="p-8 text-center">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <nextPrayer.icon className="h-8 w-8" />
                                <h2 className="text-2xl font-bold">Waktu Sholat Berikutnya</h2>
                            </div>
                            <div className="text-4xl font-bold mb-2">
                                {nextPrayer.name} - {nextPrayer.time}
                            </div>
                            <div className="text-2xl mb-4 opacity-90">
                                {nextPrayer.arabic}
                            </div>
                            <div className="flex items-center justify-center gap-6 text-xl">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{timeUntilNext.hours.toString().padStart(2, '0')}</div>
                                    <div className="text-sm opacity-75">Jam</div>
                                </div>
                                <div className="text-2xl">:</div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{timeUntilNext.minutes.toString().padStart(2, '0')}</div>
                                    <div className="text-sm opacity-75">Menit</div>
                                </div>
                                <div className="text-2xl">:</div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{timeUntilNext.seconds.toString().padStart(2, '0')}</div>
                                    <div className="text-sm opacity-75">Detik</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Today's Prayer Times */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Star className="h-5 w-5" />
                                        Jadwal Sholat Hari Ini
                                    </CardTitle>
                                    <CardDescription>
                                        {formatDate(currentTime)}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                                        {todayPrayerTimes.map((prayer) => (
                                            <div 
                                                key={prayer.name}
                                                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300 ${
                                                    prayer.isNext 
                                                        ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                                                        : prayer.isPassed 
                                                            ? 'border-gray-200 bg-gray-50' 
                                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-full ${prayer.color} text-white`}>
                                                        <prayer.icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{prayer.name}</h3>
                                                        <p className="text-sm text-gray-600">{prayer.arabic}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-gray-900">{prayer.time}</div>
                                                    <div className="text-sm">
                                                        {prayer.isNext && (
                                                            <Badge className="bg-indigo-500">Berikutnya</Badge>
                                                        )}
                                                        {prayer.isPassed && !prayer.isNext && (
                                                            <Badge variant="secondary">Sudah Lewat</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-6">
                            {/* Qibla Direction */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Arah Kiblat
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <div className="relative w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                        <div className="text-white text-4xl font-bold">292°</div>
                                    </div>
                                    <p className="text-lg font-semibold text-gray-900">Barat Laut</p>
                                    <p className="text-sm text-gray-600">Dari Kota Batam</p>
                                </CardContent>
                            </Card>

                            {/* Islamic Calendar */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Kalender Hijriah
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 mb-2">
                                        15 Rajab 1446 H
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        Tahun Hikmah
                                    </p>
                                    <div className="text-sm text-gray-500">
                                        <p>Sisa hari menuju Ramadan:</p>
                                        <p className="text-lg font-bold text-purple-600">45 hari</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Settings */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>Pengaturan</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Clock className="mr-2 h-4 w-4" />
                                        Atur Notifikasi Adzan
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Ubah Lokasi
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Lihat Kalender Bulanan
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Monthly Calendar */}
                    <Card className="mt-8 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Kalender Jadwal Sholat Januari 2024
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2 font-medium">Tanggal</th>
                                            <th className="text-center p-2 font-medium">Subuh</th>
                                            <th className="text-center p-2 font-medium">Dzuhur</th>
                                            <th className="text-center p-2 font-medium">Ashar</th>
                                            <th className="text-center p-2 font-medium">Maghrib</th>
                                            <th className="text-center p-2 font-medium">Isya</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthlyPrayerTimes.slice(0, 10).map((day) => (
                                            <tr key={day.date} className="border-b hover:bg-gray-50">
                                                <td className="p-2 font-medium">
                                                    {day.date} Januari 2024
                                                </td>
                                                <td className="text-center p-2">{day.subuh}</td>
                                                <td className="text-center p-2">{day.dzuhur}</td>
                                                <td className="text-center p-2">{day.ashar}</td>
                                                <td className="text-center p-2">{day.maghrib}</td>
                                                <td className="text-center p-2">{day.isya}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
} 
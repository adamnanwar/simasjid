import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    MapPin, 
    Clock,
    AlertCircle,
    Heart,
    Calculator
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { CircleAlert } from 'lucide-react';

interface DashboardStats {
    totalKas: number;
    totalDonasi: number;
    totalJanjiTemu: number;
    janjiTemuPending: number;
    monthlyIncome: number;
    monthlyExpense: number;
}

interface SholatTime {
    shubuh: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
}

interface Transaction {
    id: number;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
}

interface Appointment {
    id: number;
    name: string;
    topic: string;
    date: string;
    time: string;
    status: 'confirmed' | 'pending';
}

interface DashboardProps {
    stats: DashboardStats;
    recentTransactions: Transaction[];
    upcomingAppointments: Appointment[];
}

// Latest News Section Component
function LatestNewsSection() {
    const [latestNews, setLatestNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLatestNews();
    }, []);

    const fetchLatestNews = async () => {
        try {
            const response = await fetch('/api/berita-kegiatan');
            const result = await response.json();
            console.log('Home API Response:', result); // Debug log
            if (result.success && result.data && result.data.length > 0) {
                // Get latest 3 news
                const latest = result.data.slice(0, 3).map((item: any) => ({
                    id: item.id,
                    judul: item.judul,
                    konten: item.konten,
                    penulis: item.penulis || 'Penulis',
                    tanggal_publikasi: item.tanggal_publikasi || new Date().toISOString(),
                    jenis: item.jenis,
                    gambar_url: item.gambar_url
                }));
                setLatestNews(latest);
                console.log('Home successfully loaded', latest.length, 'berita items'); // Debug log
            } else {
                console.log('Home: No data from API'); // Debug log
                setLatestNews([]);
            }
        } catch (error) {
            console.error('Error fetching latest news:', error);
            setLatestNews([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                        <div className="bg-gray-200 h-4 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestNews.map((news) => (
                <Link 
                    key={news.id} 
                    href={`/berita-kegiatan/${news.id}`}
                    className="block"
                >
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg cursor-pointer">
                        <div className="relative overflow-hidden rounded-t-lg">
                            <img 
                                src={news.gambar_url || '/api/placeholder/400/200'} 
                                alt={news.judul}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-4 left-4">
                                <Badge className={news.jenis === 'berita' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                                    {news.jenis === 'berita' ? 'Berita' : 'Kegiatan'}
                                </Badge>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                {news.judul}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {news.konten ? news.konten.slice(0, 150) + '...' : ''}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>{news.penulis}</span>
                                <span>{new Date(news.tanggal_publikasi).toLocaleDateString('id-ID')}</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
            
            {latestNews.length === 0 && (
                <div className="col-span-3 text-center py-12">
                    <div className="text-gray-400 mb-4">📰</div>
                    <p className="text-gray-600">Belum ada berita terbaru</p>
                </div>
            )}
        </div>
    );
}

// Upcoming Events Section Component
function UpcomingEventsSection() {
    const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpcomingEvents();
    }, []);

    const fetchUpcomingEvents = async () => {
        try {
            const response = await fetch('/api/kegiatan-mendatang/featured');
            const result = await response.json();
            if (result.success && result.data) {
                setUpcomingEvents(result.data);
            } else {
                setUpcomingEvents([]);
            }
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
            setUpcomingEvents([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-4 h-16 bg-gray-200 rounded"></div>
                        <div className="flex-1">
                            <div className="bg-gray-200 h-4 rounded mb-2"></div>
                            <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const getEventColor = (index: number) => {
        const colors = ['border-l-green-500', 'border-l-blue-500', 'border-l-purple-500'];
        return colors[index % colors.length];
    };

    return (
        <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
                <div key={event.id} className={`bg-white p-4 rounded-lg border-l-4 ${getEventColor(index)} shadow-sm hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{event.formatted_date}</p>
                            <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {event.formatted_time}
                            </div>
                        </div>
                        {event.is_featured && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                Unggulan
                            </Badge>
                        )}
                    </div>
                </div>
            ))}
            
            {upcomingEvents.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">📅</div>
                    <p className="text-gray-600">Belum ada kegiatan mendatang</p>
                </div>
            )}
        </div>
    );
}

// Zakat Calculator Card Component
function ZakatCalculatorCard() {
    const [activeZakat, setActiveZakat] = useState<string>('');
    const [zakatResults, setZakatResults] = useState<Record<string, number>>({});
    
    // Form data for each zakat type
    const [zakatMaalData, setZakatMaalData] = useState({
        jumlah_harta: ''
    });
    
    const [zakatFitrahData, setZakatFitrahData] = useState({
        jumlah_jiwa: '',
        pilihan_bayar: 'uang',
        harga_beras: '15000'
    });
    
    const [zakatProfesiData, setZakatProfesiData] = useState({
        gaji_bulanan: '',
        bonus_tahunan: ''
    });

    const hitungZakatMaal = () => {
        const jumlahHarta = parseFloat(zakatMaalData.jumlah_harta) || 0;
        const zakatAmount = jumlahHarta * 0.025;
        setZakatResults({...zakatResults, maal: zakatAmount});
    };

    const hitungZakatFitrah = () => {
        const jumlahJiwa = parseFloat(zakatFitrahData.jumlah_jiwa) || 0;
        const hargaBeras = parseFloat(zakatFitrahData.harga_beras) || 15000;
        const pilihanBayar = zakatFitrahData.pilihan_bayar;
        
        let zakatAmount;
        if (pilihanBayar === 'beras') {
            zakatAmount = jumlahJiwa * 2.5; // Result in kg
        } else {
            zakatAmount = jumlahJiwa * 2.5 * hargaBeras; // Result in Rupiah
        }
        setZakatResults({...zakatResults, fitrah: zakatAmount});
    };

    const hitungZakatProfesi = () => {
        const gaji = parseFloat(zakatProfesiData.gaji_bulanan) || 0;
        const bonus = parseFloat(zakatProfesiData.bonus_tahunan) || 0;
        const totalPenghasilan = gaji + (bonus / 12);
        const zakatAmount = totalPenghasilan * 0.025;
        setZakatResults({...zakatResults, profesi: zakatAmount});
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const resetForm = () => {
        setActiveZakat('');
        setZakatResults({});
        setZakatMaalData({ jumlah_harta: '' });
        setZakatProfesiData({ gaji_bulanan: '', bonus_tahunan: '' });
        setZakatFitrahData({ jumlah_jiwa: '', pilihan_bayar: 'uang', harga_beras: '15000' });
    };

    return (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-3">
                        <Calculator className="h-8 w-8 text-purple-600" />
                        Simulasi Hitung Zakat
                    </h3>
                    <p className="text-gray-600 text-lg">
                        Hitung kewajiban zakat Anda sesuai syariat Islam
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Zakat Maal */}
                    <div className={`bg-white rounded-2xl p-6 border transition-all duration-300 ${
                        activeZakat === 'maal' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-purple-200 hover:border-purple-300'
                    }`}>
                        <div className="text-center">
                            <div className="p-4 bg-purple-100 rounded-2xl mb-4">
                                <DollarSign className="h-8 w-8 text-purple-600 mx-auto" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Zakat Maal</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Zakat harta yang telah mencapai nisab dan haul
                            </p>
                            <div className="text-sm text-purple-600 font-medium mb-4">
                                Rate: 2.5%
                            </div>
                            <Button 
                                onClick={() => setActiveZakat(activeZakat === 'maal' ? '' : 'maal')}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                size="sm"
                            >
                                <Calculator className="h-4 w-4 mr-2" />
                                Hitung Zakat
                            </Button>
                        </div>
                    </div>

                    {/* Zakat Fitrah - Center Position */}
                    <div className={`bg-white rounded-2xl p-6 border transition-all duration-300 ${
                        activeZakat === 'fitrah' ? 'border-orange-500 ring-2 ring-orange-200' : 'border-purple-200 hover:border-purple-300'
                    }`}>
                        <div className="text-center">
                            <div className="p-4 bg-orange-100 rounded-2xl mb-4">
                                <span className="text-2xl">🌾</span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Zakat Fitrah</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Zakat wajib setiap muslim di bulan Ramadhan
                            </p>
                            <div className="text-sm text-orange-600 font-medium mb-4">
                                Rate: 2.5 kg beras per jiwa
                            </div>
                            <Button 
                                onClick={() => setActiveZakat(activeZakat === 'fitrah' ? '' : 'fitrah')}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                                size="sm"
                            >
                                <Calculator className="h-4 w-4 mr-2" />
                                Hitung Zakat
                            </Button>
                        </div>
                    </div>

                    {/* Zakat Profesi */}
                    <div className={`bg-white rounded-2xl p-6 border transition-all duration-300 ${
                        activeZakat === 'profesi' ? 'border-green-500 ring-2 ring-green-200' : 'border-purple-200 hover:border-purple-300'
                    }`}>
                        <div className="text-center">
                            <div className="p-4 bg-green-100 rounded-2xl mb-4">
                                <TrendingUp className="h-8 w-8 text-green-600 mx-auto" />
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">Zakat Profesi</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Zakat dari penghasilan profesi dan pekerjaan
                            </p>
                            <div className="text-sm text-green-600 font-medium mb-4">
                                Rate: 2.5%
                            </div>
                            <Button 
                                onClick={() => setActiveZakat(activeZakat === 'profesi' ? '' : 'profesi')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                            >
                                <Calculator className="h-4 w-4 mr-2" />
                                Hitung Zakat
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                {activeZakat && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-6">
                        {activeZakat === 'maal' && (
                            <div className="space-y-4">
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Hitung Zakat Maal</h4>
                                <div>
                                    <Label htmlFor="jumlah_harta">Jumlah Harta (Rp)</Label>
                                    <input
                                        id="jumlah_harta"
                                        type="number"
                                        placeholder="Masukkan jumlah harta"
                                        value={zakatMaalData.jumlah_harta}
                                        onChange={(e) => setZakatMaalData({...zakatMaalData, jumlah_harta: e.target.value})}
                                        className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <Button onClick={hitungZakatMaal} className="bg-purple-600 hover:bg-purple-700 text-white">
                                    Hitung Zakat Maal
                                </Button>
                                {zakatResults.maal !== undefined && (
                                    <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Zakat yang harus dibayar:</p>
                                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(zakatResults.maal)}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeZakat === 'fitrah' && (
                            <div className="space-y-4">
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Hitung Zakat Fitrah</h4>
                                <div>
                                    <Label htmlFor="jumlah_jiwa">Jumlah Jiwa</Label>
                                    <input
                                        id="jumlah_jiwa"
                                        type="number"
                                        placeholder="Masukkan jumlah jiwa"
                                        value={zakatFitrahData.jumlah_jiwa}
                                        onChange={(e) => setZakatFitrahData({...zakatFitrahData, jumlah_jiwa: e.target.value})}
                                        className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="pilihan_bayar">Pilihan Bayar</Label>
                                    <select
                                        id="pilihan_bayar"
                                        value={zakatFitrahData.pilihan_bayar}
                                        onChange={(e) => setZakatFitrahData({...zakatFitrahData, pilihan_bayar: e.target.value})}
                                        className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="uang">Dalam Rupiah</option>
                                        <option value="beras">Dalam Kilogram</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="harga_beras">Harga Beras per Kilogram (Rp)</Label>
                                    <input
                                        id="harga_beras"
                                        type="number"
                                        placeholder="Masukkan harga beras per kilogram"
                                        value={zakatFitrahData.harga_beras}
                                        onChange={(e) => setZakatFitrahData({...zakatFitrahData, harga_beras: e.target.value})}
                                        className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <Button onClick={hitungZakatFitrah} className="bg-orange-600 hover:bg-orange-700 text-white">
                                    Hitung Zakat Fitrah
                                </Button>
                                {zakatResults.fitrah !== undefined && (
                                    <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Zakat yang harus dibayar:</p>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {zakatFitrahData.pilihan_bayar === 'beras' 
                                                ? `${zakatResults.fitrah} kg beras` 
                                                : formatCurrency(zakatResults.fitrah)
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeZakat === 'profesi' && (
                            <div className="space-y-4">
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Hitung Zakat Profesi</h4>
                                <div>
                                    <Label htmlFor="gaji_bulanan">Gaji Bulanan (Rp)</Label>
                                    <input
                                        id="gaji_bulanan"
                                        type="number"
                                        placeholder="Masukkan gaji bulanan"
                                        value={zakatProfesiData.gaji_bulanan}
                                        onChange={(e) => setZakatProfesiData({...zakatProfesiData, gaji_bulanan: e.target.value})}
                                        className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="bonus_tahunan">Bonus Tahunan (Rp) - Opsional</Label>
                                    <input
                                        id="bonus_tahunan"
                                        type="number"
                                        placeholder="Masukkan bonus tahunan"
                                        value={zakatProfesiData.bonus_tahunan}
                                        onChange={(e) => setZakatProfesiData({...zakatProfesiData, bonus_tahunan: e.target.value})}
                                        className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <Button onClick={hitungZakatProfesi} className="bg-green-600 hover:bg-green-700 text-white">
                                    Hitung Zakat Profesi
                                </Button>
                                {zakatResults.profesi !== undefined && (
                                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Zakat yang harus dibayar per bulan:</p>
                                        <p className="text-2xl font-bold text-green-600">{formatCurrency(zakatResults.profesi)}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex gap-2 mt-4">
                            <Button onClick={resetForm} variant="outline">
                                Reset
                            </Button>
                        </div>
                    </div>
                )}
                
                <div className="text-center">
                    <Link 
                        href="/hitung-zakat"
                        className="inline-flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <Calculator className="h-6 w-6" />
                        Lihat Semua Jenis Zakat
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Dashboard({ stats: initialStats, recentTransactions: initialTransactions, upcomingAppointments }: DashboardProps) {
    const [sholatTimes, setSholatTimes] = useState<SholatTime | null>(null);
    const [nextSholat, setNextSholat] = useState<{ name: string; time: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<DashboardStats>(initialStats);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(initialTransactions);

    // Function to fetch real-time statistics
    const fetchRealTimeStats = async () => {
        try {
            const timestamp = new Date().getTime();
            const response = await fetch(`/api/statistics/summary?_t=${timestamp}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setStats({
                        totalKas: parseFloat(result.data.totalKas) || 0,
                        totalDonasi: parseFloat(result.data.totalDonasi) || 0,
                        totalJanjiTemu: parseInt(result.data.totalJanjiTemu) || 0,
                        janjiTemuPending: parseInt(result.data.janjiTemuPending) || 0,
                        monthlyIncome: parseFloat(result.data.monthlyIncome) || 0,
                        monthlyExpense: parseFloat(result.data.monthlyExpense) || 0
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching real-time stats:', error);
        }
    };

    useEffect(() => {
        // Fetch real-time data on mount
        fetchRealTimeStats();
        
        // Set up interval to refresh data every 30 seconds
        const statsInterval = setInterval(fetchRealTimeStats, 30000);

        // Cleanup interval on unmount
        return () => {
            clearInterval(statsInterval);
        };
    }, []);

    useEffect(() => {
        const fetchSholatTimes = async () => {
            try {
                const today = new Date();
                const year = today.getFullYear();
                const month = (today.getMonth() + 1).toString().padStart(2, '0');
                const day = today.getDate().toString().padStart(2, '0');
                const dateString = `${day}-${month}-${year}`;
                
                // Use backend proxy API to avoid CORS issues
                const response = await fetch(`/api/sholat-times?date=${dateString}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Sholat API Response:', data); // Debug log
                    
                    if (data.success && data.data) {
                        const times: SholatTime = {
                            shubuh: data.data.shubuh,
                            dzuhur: data.data.dzuhur,
                            ashar: data.data.ashar,
                            maghrib: data.data.maghrib,
                            isya: data.data.isya
                        };
                        
                        setSholatTimes(times);
                        calculateNextSholat(times);
                        
                        // Show source info if using default times
                        if (data.source === 'default') {
                            setError('Menggunakan jadwal sholat default untuk Batam');
                        }
                        
                        return; // Success, exit function
                    }
                }
                
                // Fallback to default times if API fails completely
                const defaultTimes: SholatTime = {
                    shubuh: '05:18',
                    dzuhur: '12:12',
                    ashar: '15:42',
                    maghrib: '18:26',
                    isya: '19:38'
                };
                
                setSholatTimes(defaultTimes);
                calculateNextSholat(defaultTimes);
                setError('Menggunakan jadwal sholat default untuk Batam');
                
            } catch (err) {
                console.error('Error fetching sholat times:', err);
                
                // Set accurate default times as last resort
                const defaultTimes: SholatTime = {
                    shubuh: '05:18',
                    dzuhur: '12:12',
                    ashar: '15:42',
                    maghrib: '18:26',
                    isya: '19:38'
                };
                
                setSholatTimes(defaultTimes);
                calculateNextSholat(defaultTimes);
                setError('Menggunakan jadwal sholat default untuk Batam');
            } finally {
                setLoading(false);
            }
        };

        fetchSholatTimes();
    }, []);

    const calculateNextSholat = (times: SholatTime) => {
        try {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            
            const sholatSchedule = [
                { name: 'Shubuh', time: times.shubuh },
                { name: 'Dzuhur', time: times.dzuhur },
                { name: 'Ashar', time: times.ashar },
                { name: 'Maghrib', time: times.maghrib },
                { name: 'Isya', time: times.isya }
            ];

            for (const sholat of sholatSchedule) {
                try {
                    // Clean time string and handle different formats
                    const timeStr = sholat.time.trim();
                    const [hoursStr, minutesStr] = timeStr.split(':');
                    const hours = parseInt(hoursStr, 10);
                    const minutes = parseInt(minutesStr, 10);
                    
                    // Validate parsed time
                    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                        console.warn(`Invalid time format for ${sholat.name}: ${sholat.time}`);
                        continue;
                    }
                    
                    const sholatTime = hours * 60 + minutes;
                    
                    if (sholatTime > currentTime) {
                        setNextSholat({ name: sholat.name, time: sholat.time });
                        return;
                    }
                } catch (timeParseError) {
                    console.warn(`Error parsing time for ${sholat.name}:`, timeParseError);
                    continue;
                }
            }
            
            // If no sholat left today, show tomorrow's Shubuh
            setNextSholat({ name: 'Shubuh (Besok)', time: times.shubuh });
        } catch (error) {
            console.error('Error calculating next sholat:', error);
            // Set a fallback
            setNextSholat({ name: 'Error', time: '--:--' });
        }
    };

    const formatCurrency = (amount: number | undefined | null) => {
        // Handle undefined, null, or NaN values
        const validAmount = amount && !isNaN(amount) ? amount : 0;
        
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(validAmount);
    };

    const totalCashFlow = stats.totalKas + stats.totalDonasi;

    return (
        <MainLayout>
            <Head title="Dashboard" />
            
            <div className="space-y-12">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 px-6 py-12 lg:px-12 lg:py-16 text-white shadow-2xl">
                    <div className="absolute inset-0 bg-gray-900/10"></div>
                    <div 
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: 'url(/images/bg-home.jpeg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    ></div>
                    
                    <div className="relative z-10">
                        <div className="mb-8 text-center">
                            <h1 className="mb-4 text-3xl font-bold lg:text-4xl xl:text-5xl">
                                Selamat Datang di SIMASJID
                            </h1>
                            <p className="mx-auto max-w-3xl text-base lg:text-lg xl:text-xl text-emerald-50 leading-relaxed">
                                Sistem Informasi Masjid Terpadu - Mengelola masjid dengan teknologi modern
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                            <div className="rounded-2xl bg-white/20 backdrop-blur-sm p-6 lg:p-8 border border-white/30 hover:bg-white/25 transition-all duration-300">
                                <div className="text-center">
                                    <div className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-2">
                                        {formatCurrency(stats.totalKas + stats.totalDonasi)}
                                    </div>
                                    <div className="text-emerald-100 font-medium text-sm lg:text-base">Total Kas & Donasi</div>
                                </div>
                            </div>
                            
                            <div className="rounded-2xl bg-white/20 backdrop-blur-sm p-6 lg:p-8 border border-white/30 hover:bg-white/25 transition-all duration-300">
                                <div className="text-center">
                                    <div className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-2">
                                        {stats.totalJanjiTemu}
                                    </div>
                                    <div className="text-emerald-100 font-medium text-sm lg:text-base">Total Janji Temu</div>
                                </div>
                            </div>
                            
                            <div className="rounded-2xl bg-white/20 backdrop-blur-sm p-6 lg:p-8 border border-white/30 hover:bg-white/25 transition-all duration-300">
                                <div className="text-center">
                                    <div className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-2">
                                        {nextSholat ? nextSholat.time : '--:--'}
                                    </div>
                                    <div className="text-emerald-100 font-medium text-sm lg:text-base">
                                        {nextSholat ? `Sholat ${nextSholat.name}` : 'Loading...'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cash Flow Section */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                            Cash Flow Masjid
                        </h2>
                        <p className="text-base text-gray-600 max-w-2xl mx-auto">
                            Pantau kondisi keuangan masjid secara real-time dan transparan
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Total Income */}
                        <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-emerald-200 hover:border-emerald-300 bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-emerald-700 mb-1">Total Pemasukan</p>
                                        <p className="text-2xl font-bold text-emerald-600">
                                            {formatCurrency(stats.monthlyIncome)}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">Bulan ini</p>
                                    </div>
                                    <div className="p-3 bg-emerald-100 rounded-2xl group-hover:bg-emerald-200 transition-colors">
                                        <TrendingUp className="h-6 w-6 text-emerald-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Expenses */}
                        <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-red-200 hover:border-red-300 bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-red-700 mb-1">Total Pengeluaran</p>
                                        <p className="text-2xl font-bold text-red-600">
                                            {formatCurrency(stats.monthlyExpense)}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">Bulan ini</p>
                                    </div>
                                    <div className="p-3 bg-red-100 rounded-2xl group-hover:bg-red-200 transition-colors">
                                        <TrendingDown className="h-6 w-6 text-red-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Current Balance */}
                        <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-300 bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm font-medium text-blue-700 mb-1">Saldo Kas</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {formatCurrency(totalCashFlow)}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">Total keseluruhan</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors flex items-center justify-center">
                                        <span className="text-xl font-bold text-blue-600">$</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Simulasi Hitung Zakat */}
                <ZakatCalculatorCard />

                {/* Recent Activities */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Recent Transactions */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Transaksi Terbaru</h3>
                                <p className="text-sm text-gray-600">Aktivitas keuangan masjid terkini</p>
                            </div>
                            
                            <div className="space-y-4">
                                {recentTransactions && recentTransactions.length > 0 ? recentTransactions.map((transaction) => (
                                    <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${
                                                transaction.type === 'income' 
                                                    ? 'bg-emerald-100 text-emerald-600' 
                                                    : 'bg-red-100 text-red-600'
                                            }`}>
                                                {transaction.type === 'income' ? (
                                                    <TrendingUp className="h-4 w-4" />
                                                ) : (
                                                    <TrendingDown className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{transaction.description}</p>
                                                <p className="text-xs text-gray-600">{transaction.date}</p>
                                            </div>
                                        </div>
                                        <div className={`font-bold text-sm ${
                                            transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-200">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-full bg-red-100 text-red-600">
                                                <TrendingDown className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">Pembayaran Listrik</p>
                                                <p className="text-xs text-gray-600">2025-06-15</p>
                                            </div>
                                        </div>
                                        <div className="font-bold text-sm text-red-600">
                                            -Rp 2.550.000
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Appointments */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Janji Temu Mendatang</h3>
                                <p className="text-sm text-gray-600">Jadwal janji temu dengan ustadz</p>
                            </div>
                            
                            <div className="space-y-4">
                                {upcomingAppointments && upcomingAppointments.length > 0 ? upcomingAppointments.map((appointment) => (
                                    <div key={appointment.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <MapPin className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 text-sm">{appointment.name}</p>
                                            <p className="text-xs text-gray-600">{appointment.topic}</p>
                                            <p className="text-xs text-blue-600 font-medium">{appointment.date} • {appointment.time}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                appointment.status === 'confirmed' 
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {appointment.status === 'confirmed' ? 'Dikonfirmasi' : 'Menunggu'}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <MapPin className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 text-sm">Aisha Radhiyallahu Anha</p>
                                            <p className="text-xs text-gray-600">Konsultasi Keluarga</p>
                                            <p className="text-xs text-blue-600 font-medium">2025-06-16 • 10:00</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                Dikonfirmasi
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <Card className="hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-purple-600" />
                                    Kegiatan Mendatang
                                </h3>
                                <p className="text-sm text-gray-600">Jadwal kegiatan dan acara masjid</p>
                            </div>
                            
                            <UpcomingEventsSection />
                        </CardContent>
                    </Card>
                </div>

                {/* Latest News Section */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                            Berita Terbaru
                        </h2>
                        <p className="text-base text-gray-600 max-w-2xl mx-auto">
                            Informasi terkini tentang kegiatan dan program masjid
                        </p>
                    </div>

                    <LatestNewsSection />
                </div>

                {/* CTA Infaq & Sedekah */}
                <Card className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 border-2 border-emerald-300 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8 text-center">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-white mb-3">
                                Mau Ber-infaq dan Sedekah?
                            </h3>
                            <p className="text-emerald-100 text-lg">
                                Mari berbagi kebaikan untuk kemajuan masjid dan umat
                            </p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                                <div className="bg-white rounded-xl p-4 mb-4">
                                    <img 
                                        src="/images/qris-infaq.png" 
                                        alt="QR Code Infaq Masjid Al-Ikhlash"
                                        className="w-full max-w-[200px] h-auto object-contain mx-auto"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                            if (nextElement) {
                                                nextElement.style.display = 'block';
                                            }
                                        }}
                                    />
                                    <div className="hidden text-center">
                                        <div className="text-6xl mb-4">📱</div>
                                        <p className="text-gray-600 font-medium">QR Code Infaq</p>
                                        <p className="text-sm text-gray-500">Scan untuk berdonasi</p>
                                    </div>
                                </div>
                                <p className="text-white font-medium text-sm text-center">
                                    Scan QR Code untuk Infaq & Sedekah
                                </p>
                                <div className="mt-3">
                                    <a 
                                        href="https://wa.me/6287844712393?text=Assalamu%27alaikum.%20Saya%20mau%20Konfirmasi%20Transfer%20Infaq-Sodaqoh"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                        </svg>
                                        Konfirmasi via WhatsApp
                                    </a>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <Link 
                                    href="/laporan-infaq"
                                    className="inline-flex items-center gap-3 bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <Heart className="h-6 w-6" />
                                    Lihat Laporan Infaq
                                </Link>
                                <p className="text-emerald-100 text-sm mt-3">
                                    Transparansi penggunaan dana infaq & sedekah
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Lokasi Masjid */}
                <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <MapPin className="h-6 w-6 text-emerald-600" />
                                Lokasi Masjid Al-Ikhlash
                            </h3>
                            <p className="text-sm text-gray-600">Perumahan Batam Nirwana Residence RW VII, Patam Lestari, Sekupang</p>
                        </div>
                        
                        <div className="rounded-2xl overflow-hidden shadow-lg">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.0489789489648!2d103.96672194554343!3d1.1251944959439397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d98ba4a4497da3%3A0x4d10e595faa24c2a!2sMasjid%20Al-Ikhlash!5e0!3m2!1sid!2sid!4v1752467249023!5m2!1sid!2sid"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full"
                            ></iframe>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <MapPin className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Alamat Lengkap</p>
                                    <p className="text-xs text-gray-600">Batam Nirwana Residence RW VII, Patam Lestari</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">Jam Operasional</p>
                                    <p className="text-xs text-gray-600">24 Jam (Terbuka untuk Jamaah)</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200">
                    <CardContent className="p-8">
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Aksi Cepat</h3>
                            <p className="text-sm text-gray-600">Kelola aktivitas masjid dengan mudah</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <Link 
                                href="/laporan-kas" 
                                className="group flex flex-col items-center p-4 rounded-2xl bg-white hover:bg-emerald-50 border-2 border-transparent hover:border-emerald-200 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="p-3 bg-emerald-100 rounded-2xl mb-3 group-hover:bg-emerald-200 transition-colors">
                                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                                </div>
                                <span className="font-semibold text-gray-900 text-center text-sm">Laporan Kas</span>
                            </Link>
                            
                            <Link 
                                href="/laporan-infaq" 
                                className="group flex flex-col items-center p-4 rounded-2xl bg-white hover:bg-blue-50 border-2 border-transparent hover:border-blue-200 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="p-3 bg-blue-100 rounded-2xl mb-3 group-hover:bg-blue-200 transition-colors">
                                    <CircleAlert className="h-6 w-6 text-blue-600" />
                                </div>
                                <span className="font-semibold text-gray-900 text-center text-sm">Laporan Infaq</span>
                            </Link>
                            
                            <Link 
                                href="/janji-temu" 
                                className="group flex flex-col items-center p-4 rounded-2xl bg-white hover:bg-purple-50 border-2 border-transparent hover:border-purple-200 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="p-3 bg-purple-100 rounded-2xl mb-3 group-hover:bg-purple-200 transition-colors">
                                    <MapPin className="h-6 w-6 text-purple-600" />
                                </div>
                                <span className="font-semibold text-gray-900 text-center text-sm">Janji Temu</span>
                            </Link>
                            
                            <Link 
                                href="/berita-kegiatan" 
                                className="group flex flex-col items-center p-4 rounded-2xl bg-white hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="p-3 bg-orange-100 rounded-2xl mb-3 group-hover:bg-orange-200 transition-colors">
                                    <CircleAlert className="h-6 w-6 text-orange-600" />
                                </div>
                                <span className="font-semibold text-gray-900 text-center text-sm">Berita & Kegiatan</span>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
} 
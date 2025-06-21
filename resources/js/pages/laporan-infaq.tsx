import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Heart,
    Users,
    TrendingUp,
    Gift,
    Calendar,
    Download,
    Filter,
    Plus,
    Search
} from 'lucide-react';

interface LaporanInfaqProps {
    donations: any[];
    summary: {
        totalInfaq: number;
        totalSedekah: number;
        totalZakat: number;
        totalDonasi: number;
        totalDonatur: number;
        totalTransaksi: number;
    };
    topDonors: any[];
    donationsByProgram: any[];
    donationsByMethod: any[];
    filters: {
        start_date: string;
        end_date: string;
        kategori: string;
        status: string;
    };
}

export default function LaporanInfaq({ 
    donations: initialDonations, 
    summary: initialSummary, 
    topDonors: initialTopDonors, 
    donationsByProgram: initialDonationsByProgram, 
    donationsByMethod: initialDonationsByMethod, 
    filters: initialFilters 
}: LaporanInfaqProps) {
    const [selectedCategory, setSelectedCategory] = useState('semua');
    const [donations, setDonations] = useState(initialDonations || []);
    const [summary, setSummary] = useState(initialSummary || {
        totalInfaq: 0,
        totalSedekah: 0,
        totalZakat: 0,
        totalDonasi: 0,
        totalDonatur: 0,
        totalTransaksi: 0
    });
    const [topDonors, setTopDonors] = useState(initialTopDonors || []);
    const [donationsByProgram, setDonationsByProgram] = useState(initialDonationsByProgram || []);
    const [donationsByMethod, setDonationsByMethod] = useState(initialDonationsByMethod || []);
    const [loading, setLoading] = useState(false);

    // Fetch fresh data from API
    useEffect(() => {
        fetchDonationData();
    }, []);

    const fetchDonationData = async () => {
        setLoading(true);
        try {
            // Add cache busting parameter and get all data
            const timestamp = new Date().getTime();
            const response = await fetch(`/api/laporan-infaq?per_page=1000&_t=${timestamp}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                setDonations(result.data);
                
                // Calculate summary from fresh data
                const totalInfaq = result.data.filter((d: any) => d.kategori === 'Infaq').reduce((sum: number, d: any) => sum + parseFloat(d.jumlah), 0);
                const totalSedekah = result.data.filter((d: any) => d.kategori === 'Sedekah').reduce((sum: number, d: any) => sum + parseFloat(d.jumlah), 0);
                const totalZakat = result.data.filter((d: any) => d.kategori === 'Zakat').reduce((sum: number, d: any) => sum + parseFloat(d.jumlah), 0);
                const totalDonasi = totalInfaq + totalSedekah + totalZakat;
                const uniqueDonors = new Set(result.data.filter((d: any) => !d.anonim).map((d: any) => d.nama_donatur));
                
                setSummary({
                    totalInfaq,
                    totalSedekah,
                    totalZakat,
                    totalDonasi,
                    totalDonatur: uniqueDonors.size,
                    totalTransaksi: result.data.length
                });

                // Calculate top donors from fresh data
                const donorMap = new Map();
                result.data.filter((d: any) => !d.anonim).forEach((d: any) => {
                    const name = d.nama_donatur;
                    if (donorMap.has(name)) {
                        donorMap.set(name, {
                            nama_donatur: name,
                            total_donasi: donorMap.get(name).total_donasi + parseFloat(d.jumlah),
                            jumlah_donasi: donorMap.get(name).jumlah_donasi + 1
                        });
                    } else {
                        donorMap.set(name, {
                            nama_donatur: name,
                            total_donasi: parseFloat(d.jumlah),
                            jumlah_donasi: 1
                        });
                    }
                });
                
                const sortedTopDonors = Array.from(donorMap.values())
                    .sort((a, b) => b.total_donasi - a.total_donasi)
                    .slice(0, 10);
                
                setTopDonors(sortedTopDonors);
            }
        } catch (error) {
            console.error('Error fetching donation data:', error);
            // Keep initial data if API fails
        } finally {
            setLoading(false);
        }
    };
    
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const summaryData = [
        {
            title: 'Total Infaq',
            value: formatCurrency(summary.totalInfaq),
            change: `${Math.round((summary.totalInfaq / (summary.totalInfaq + summary.totalSedekah + summary.totalZakat)) * 100)}%`,
            icon: Heart,
            color: 'text-green-600 bg-green-100'
        },
        {
            title: 'Total Sedekah',
            value: formatCurrency(summary.totalSedekah),
            change: `${Math.round((summary.totalSedekah / (summary.totalInfaq + summary.totalSedekah + summary.totalZakat)) * 100)}%`,
            icon: Gift,
            color: 'text-purple-600 bg-purple-100'
        },
        {
            title: 'Total Donatur',
            value: summary.totalDonatur.toString(),
            change: `${summary.totalTransaksi} donasi`,
            icon: Users,
            color: 'text-blue-600 bg-blue-100'
        },
        {
            title: 'Rata-rata Donasi',
            value: formatCurrency(summary.totalDonatur > 0 ? summary.totalDonasi / summary.totalDonatur : 0),
            change: `${summary.totalTransaksi} transaksi`,
            icon: TrendingUp,
            color: 'text-orange-600 bg-orange-100'
        }
    ];

    // Filter donations based on selected category
    const filteredDonations = selectedCategory === 'semua' 
        ? donations 
        : donations.filter((donation: any) => donation.kategori?.toLowerCase() === selectedCategory);

    if (loading) {
        return (
            <MainLayout>
                <Head title="Laporan Infaq & Sedekah - Sistem Informasi Masjid Al-Ikhlash" />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Memuat data donasi...</p>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title="Laporan Infaq & Sedekah - Sistem Informasi Masjid Al-Ikhlash" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                    <Heart className="h-8 w-8 text-green-600" />
                                    Laporan Infaq & Sedekah
                                </h1>
                                <p className="mt-2 text-lg text-gray-600">
                                    Kelola dan pantau donasi jamaah untuk berbagai program masjid
                                </p>
                            </div>
                            <div className="mt-4 flex gap-3 md:mt-0">
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Search className="h-4 w-4" />
                                    Cari Donatur
                                </Button>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Download className="h-4 w-4" />
                                    Export
                                </Button>

                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {summaryData.map((item) => (
                            <Card key={item.title} className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">{item.title}</p>
                                            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                                            <p className="text-sm text-emerald-600 font-medium">{item.change} bulan ini</p>
                                        </div>
                                        <div className={`rounded-full p-3 ${item.color}`}>
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* QR Code Infaq Section */}
                    <Card className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 border-2 border-emerald-300 mb-8">
                        <CardContent className="p-8 text-center">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Infaq & Sedekah Digital
                                </h3>
                                <p className="text-emerald-100 text-lg">
                                    Scan QR Code untuk berinfaq dan bersedekah dengan mudah
                                </p>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 max-w-xs">
                                    <img 
                                        src="/images/qris-infaq.png" 
                                        alt="QR Code Infaq Masjid Al-Ikhlash"
                                        className="w-64 h-64 object-contain rounded-xl mx-auto mb-4 bg-white p-2"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                            if (nextElement) {
                                                nextElement.style.display = 'block';
                                            }
                                        }}
                                    />
                                    <div className="hidden bg-white rounded-xl p-8 text-center">
                                        <div className="text-6xl mb-4">📱</div>
                                        <p className="text-gray-600 font-medium">QR Code Infaq</p>
                                        <p className="text-sm text-gray-500">Scan untuk berdonasi</p>
                                    </div>
                                    <p className="text-white font-medium text-center">
                                        Scan QR Code untuk Infaq & Sedekah
                                    </p>
                                </div>
                                
                                <div className="text-white">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold">1</span>
                                            </div>
                                            <p className="text-emerald-100">Buka aplikasi mobile banking atau e-wallet</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold">2</span>
                                            </div>
                                            <p className="text-emerald-100">Pilih menu scan QR Code</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold">3</span>
                                            </div>
                                            <p className="text-emerald-100">Scan QR Code di samping</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                                <span className="text-white font-bold">4</span>
                                            </div>
                                            <p className="text-emerald-100">Masukkan nominal dan konfirmasi</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 p-4 bg-white/10 rounded-xl">
                                        <p className="text-emerald-100 text-sm">
                                            💡 <strong>Tips:</strong> Minimal infaq Rp 10.000. Semua donasi akan dicatat dan dilaporkan secara transparan.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Donation List */}
                        <div className="lg:col-span-2">
                            <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Riwayat Donasi Terbaru
                                    </CardTitle>
                                    <CardDescription>
                                        Daftar donasi infaq dan sedekah dari jamaah
                                    </CardDescription>
                                    
                                    {/* Category Filter */}
                                    <div className="flex gap-2 flex-wrap pt-4">
                                        {[
                                            { value: 'semua', label: 'Semua' },
                                            { value: 'infaq', label: 'Infaq' },
                                            { value: 'sedekah', label: 'Sedekah' }
                                        ].map((category) => (
                                            <Button
                                                key={category.value}
                                                size="sm"
                                                variant={selectedCategory === category.value ? "default" : "outline"}
                                                onClick={() => setSelectedCategory(category.value)}
                                                className={selectedCategory === category.value ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                                            >
                                                {category.label}
                                            </Button>
                                        ))}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {filteredDonations && filteredDonations.length > 0 ? filteredDonations.map((donation) => (
                                            <div key={donation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className="font-medium text-gray-900">
                                                            {donation.anonim ? 'Donatur Anonim' : donation.nama_donatur}
                                                        </h4>
                                                        <Badge 
                                                            variant={donation.kategori === 'Infaq' ? 'default' : 'secondary'}
                                                            className={donation.kategori === 'Infaq' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}
                                                        >
                                                            {donation.kategori}
                                                        </Badge>
                                                        <Badge 
                                                            variant={donation.status === 'confirmed' ? 'default' : 'secondary'}
                                                            className={donation.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}
                                                        >
                                                            {donation.status === 'confirmed' ? 'Dikonfirmasi' : 'Pending'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        Program: {donation.program}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(donation.tanggal).toLocaleDateString('id-ID')} • {donation.metode}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-green-600">
                                                        {formatCurrency(donation.jumlah)}
                                                    </p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-8">
                                                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Donasi</h3>
                                                <p className="text-gray-600">Belum ada donasi yang tercatat untuk periode ini.</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top Donors */}
                        <div>
                            <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Donatur Teratas
                                    </CardTitle>
                                    <CardDescription>
                                        Jamaah dengan kontribusi terbesar
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {topDonors && topDonors.length > 0 ? topDonors.map((donor, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{donor.nama_donatur}</p>
                                                        <p className="text-sm text-gray-500">{donor.jumlah_donasi} donasi</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-green-600">{formatCurrency(donor.total_donasi)}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-8">
                                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                <p className="text-gray-600">Belum ada data donatur untuk periode ini.</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card className="mt-6 bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="text-lg">Statistik Cepat</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Donasi Hari Ini</span>
                                        <span className="font-bold text-green-600">Rp 2.4M</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Donasi Minggu Ini</span>
                                        <span className="font-bold text-green-600">Rp 12.8M</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Rata-rata Harian</span>
                                        <span className="font-bold text-blue-600">Rp 1.8M</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Target Bulanan</span>
                                        <span className="font-bold text-purple-600">Rp 50M</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
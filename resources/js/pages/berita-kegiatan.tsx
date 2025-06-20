import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar,
    Users,
    MapPin,
    Clock,
    Eye,
    Share2,
    Plus,
    Filter
} from 'lucide-react';

interface BeritaKegiatanProps {
    beritaKegiatan: {
        data: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function BeritaKegiatan({ beritaKegiatan }: BeritaKegiatanProps) {
    const [selectedCategory, setSelectedCategory] = useState('semua');

    // Use data from Inertia props instead of API call
    const beritaData = beritaKegiatan?.data || [];

    const categoryStats = [
        { name: 'Semua', count: beritaData.length, color: 'bg-blue-500' },
        { name: 'Berita', count: beritaData.filter(b => b.jenis === 'berita').length, color: 'bg-green-500' },
        { name: 'Kegiatan', count: beritaData.filter(b => b.jenis === 'kegiatan').length, color: 'bg-purple-500' },
    ];

    const filteredBerita = selectedCategory === 'semua' 
        ? beritaData 
        : beritaData.filter(berita => berita.jenis === selectedCategory);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'berita': 'bg-green-100 text-green-800',
            'kegiatan': 'bg-purple-100 text-purple-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <MainLayout>
            <Head title="Berita & Kegiatan - Sistem Informasi Masjid Al-Ikhlash" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                    <Calendar className="h-8 w-8 text-blue-600" />
                                    Berita & Kegiatan Masjid
                                </h1>
                                <p className="mt-2 text-lg text-gray-600">
                                    Informasi terkini tentang kegiatan dan program masjid
                                </p>
                            </div>
                            <div className="mt-4 flex gap-3 md:mt-0">
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filter
                                </Button>

                            </div>
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
                        {categoryStats.map((stat) => (
                            <Card 
                                key={stat.name.toLowerCase()}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                                    selectedCategory === stat.name.toLowerCase() ? 'ring-2 ring-blue-500 shadow-lg' : ''
                                }`}
                                onClick={() => setSelectedCategory(stat.name.toLowerCase())}
                            >
                                <CardContent className="p-4 text-center">
                                    <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${stat.color} mb-2`}>
                                        <span className="text-sm font-bold text-white">{stat.count}</span>
                                    </div>
                                    <h3 className="font-medium text-gray-900 text-sm">{stat.name}</h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        {/* Berita List */}
                        <div className="lg:col-span-3">
                            <div className="space-y-6">
                                {filteredBerita.map((berita) => (
                                    <Card key={berita.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <div className="md:flex">
                                            <div className="md:w-1/3">
                                                <img 
                                                    src={berita.gambar_url || '/api/placeholder/400/250'} 
                                                    alt={berita.judul}
                                                    className="h-48 w-full object-cover rounded-t-lg md:h-full md:rounded-none md:rounded-l-lg"
                                                />
                                            </div>
                                            <div className="md:w-2/3">
                                                <CardContent className="p-6">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Badge className={getCategoryColor(berita.jenis)}>
                                                            {berita.jenis === 'berita' ? 'Berita' : 'Kegiatan'}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500">
                                                            {formatDate(berita.tanggal_publikasi)}
                                                        </span>
                                                    </div>
                                                    
                                                    <Link href={`/berita-kegiatan/${berita.id}`}>
                                                        <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                                                            {berita.judul}
                                                        </h2>
                                                    </Link>
                                                    
                                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                                        {berita.konten ? berita.konten.slice(0, 200) + '...' : ''}
                                                    </p>
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <div className="flex items-center gap-1">
                                                                <Users className="h-4 w-4" />
                                                                {berita.penulis || 'Penulis'}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Eye className="h-4 w-4" />
                                                                {Math.floor(Math.random() * 500) + 50} views
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex gap-2">
                                                            <Link href={`/berita-kegiatan/${berita.id}`}>
                                                                <Button variant="outline" size="sm">
                                                                    Baca Selengkapnya
                                                                </Button>
                                                            </Link>
                                                            <Button variant="outline" size="sm">
                                                                <Share2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Kegiatan Mendatang */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Clock className="h-5 w-5" />
                                        Kegiatan Mendatang
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="border-l-4 border-green-500 pl-4">
                                        <h4 className="font-semibold text-gray-900">Kajian Fiqih</h4>
                                        <p className="text-sm text-gray-600">26 Maret 2024</p>
                                        <p className="text-xs text-gray-500">Ba'da Maghrib</p>
                                    </div>
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <h4 className="font-semibold text-gray-900">Santunan Yatim</h4>
                                        <p className="text-sm text-gray-600">30 Maret 2024</p>
                                        <p className="text-xs text-gray-500">08:00 - 12:00</p>
                                    </div>
                                    <div className="border-l-4 border-purple-500 pl-4">
                                        <h4 className="font-semibold text-gray-900">Buka Puasa Bersama</h4>
                                        <p className="text-sm text-gray-600">5 April 2024</p>
                                        <p className="text-xs text-gray-500">17:00 - 20:00</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Berita Populer */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Eye className="h-5 w-5" />
                                        Berita Populer
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {beritaData
                                        .slice(0, 3)
                                        .map((berita, index) => (
                                        <div key={berita.id} className="flex gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold text-sm">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <Link href={`/berita-kegiatan/${berita.id}`}>
                                                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2 hover:text-blue-600 cursor-pointer">
                                                        {berita.judul}
                                                    </h4>
                                                </Link>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDate(berita.tanggal_publikasi)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

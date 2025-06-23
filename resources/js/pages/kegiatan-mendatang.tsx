import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar,
    CalendarCheck,
    Clock,
    MapPin,
    Users,
    DollarSign,
    Phone,
    Mail,
    MessageCircle,
    Star,
    ChevronRight
} from 'lucide-react';

interface KegiatanMendatang {
    id: number;
    judul: string;
    slug: string;
    deskripsi: string;
    gambar: string | null;
    formatted_tanggal: string;
    formatted_waktu: string;
    lokasi: string;
    penanggung_jawab: string;
    persyaratan: string | null;
    kuota_peserta: number | null;
    formatted_biaya: string;
    status: 'draft' | 'published' | 'cancelled';
    is_featured: boolean;
    kontak_info: {
        phone?: string;
        email?: string;
        whatsapp?: string;
    };
    catatan_tambahan: string | null;
    is_past_event: boolean;
}

export default function KegiatanMendatangPublic() {
    const [kegiatan, setKegiatan] = useState<KegiatanMendatang[]>([]);
    const [featuredKegiatan, setFeaturedKegiatan] = useState<KegiatanMendatang[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('semua');

    // Fetch data from API
    useEffect(() => {
        fetchKegiatanData();
    }, []);

    const fetchKegiatanData = async () => {
        setLoading(true);
        try {
            const [kegiatanResponse, featuredResponse] = await Promise.all([
                fetch('/api/kegiatan-mendatang'),
                fetch('/api/kegiatan-mendatang/featured')
            ]);

            const kegiatanResult = await kegiatanResponse.json();
            const featuredResult = await featuredResponse.json();

            if (kegiatanResult.success && kegiatanResult.data) {
                setKegiatan(kegiatanResult.data);
            }

            if (featuredResult.success && featuredResult.data) {
                setFeaturedKegiatan(featuredResult.data);
            }
        } catch (error) {
            console.error('Error fetching kegiatan data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredKegiatan = selectedCategory === 'semua' 
        ? kegiatan 
        : kegiatan.filter((k) => {
            if (selectedCategory === 'upcoming') return !k.is_past_event;
            if (selectedCategory === 'featured') return k.is_featured;
            return true;
        });

    if (loading) {
        return (
            <MainLayout>
                <Head title="Kegiatan Mendatang - Sistem Informasi Masjid Al-Ikhlash" />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Memuat kegiatan mendatang...</p>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title="Kegiatan Mendatang - Sistem Informasi Masjid Al-Ikhlash" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
                                <CalendarCheck className="h-10 w-10 text-emerald-600" />
                                Kegiatan Mendatang
                            </h1>
                            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                                Ikuti berbagai kegiatan menarik dan bermanfaat yang diselenggarakan oleh Masjid Al-Ikhlash
                            </p>
                        </div>
                    </div>

                    {/* Featured Events */}
                    {featuredKegiatan.length > 0 && (
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Star className="h-6 w-6 text-yellow-500" />
                                    Kegiatan Unggulan
                                </h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredKegiatan.slice(0, 3).map((item) => (
                                    <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                                        <div className="relative">
                                            {item.gambar ? (
                                                <img 
                                                    src={`/storage/${item.gambar}`} 
                                                    alt={item.judul}
                                                    className="w-full h-48 object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                                    <CalendarCheck className="h-16 w-16 text-emerald-600" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                                    <Star className="h-3 w-3 mr-1" />
                                                    Unggulan
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.judul}</h3>
                                                    <p className="text-gray-600 text-sm line-clamp-3">{item.deskripsi}</p>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4 text-emerald-600" />
                                                        <span>{item.formatted_tanggal}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Clock className="h-4 w-4 text-emerald-600" />
                                                        <span>{item.formatted_waktu}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                                        <span>{item.lokasi}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <DollarSign className="h-4 w-4 text-emerald-600" />
                                                        <span>{item.formatted_biaya}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="pt-4 border-t">
                                                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                                                        Lihat Detail
                                                        <ChevronRight className="h-4 w-4 ml-2" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filter Tabs */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {[
                                { key: 'semua', label: 'Semua Kegiatan' },
                                { key: 'upcoming', label: 'Akan Datang' },
                                { key: 'featured', label: 'Unggulan' }
                            ].map((tab) => (
                                <Button
                                    key={tab.key}
                                    variant={selectedCategory === tab.key ? 'default' : 'outline'}
                                    onClick={() => setSelectedCategory(tab.key)}
                                    className={selectedCategory === tab.key ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* All Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredKegiatan.map((item) => (
                            <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
                                <div className="relative">
                                    {item.gambar ? (
                                        <img 
                                            src={`/storage/${item.gambar}`} 
                                            alt={item.judul}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                            <CalendarCheck className="h-16 w-16 text-emerald-600" />
                                        </div>
                                    )}
                                    {item.is_featured && (
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                                <Star className="h-3 w-3 mr-1" />
                                                Unggulan
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.judul}</h3>
                                            <p className="text-gray-600 text-sm line-clamp-3">{item.deskripsi}</p>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="h-4 w-4 text-emerald-600" />
                                                <span>{item.formatted_tanggal}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock className="h-4 w-4 text-emerald-600" />
                                                <span>{item.formatted_waktu}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="h-4 w-4 text-emerald-600" />
                                                <span>{item.lokasi}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <DollarSign className="h-4 w-4 text-emerald-600" />
                                                <span>{item.formatted_biaya}</span>
                                            </div>
                                            {item.kuota_peserta && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Users className="h-4 w-4 text-emerald-600" />
                                                    <span>Kuota: {item.kuota_peserta} peserta</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="pt-4 border-t">
                                            <div className="flex gap-2">
                                                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                                                    Lihat Detail
                                                    <ChevronRight className="h-4 w-4 ml-2" />
                                                </Button>
                                                
                                                {item.kontak_info && (
                                                    <div className="flex gap-1">
                                                        {item.kontak_info.whatsapp && (
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                onClick={() => window.open(`https://wa.me/${item.kontak_info.whatsapp?.replace(/\D/g, '')}`, '_blank')}
                                                            >
                                                                <MessageCircle className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {item.kontak_info.phone && (
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                onClick={() => window.open(`tel:${item.kontak_info.phone}`, '_blank')}
                                                            >
                                                                <Phone className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {item.kontak_info.email && (
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                onClick={() => window.open(`mailto:${item.kontak_info.email}`, '_blank')}
                                                            >
                                                                <Mail className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredKegiatan.length === 0 && (
                        <div className="text-center py-12">
                            <CalendarCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Belum Ada Kegiatan
                            </h3>
                            <p className="text-gray-600">
                                Kegiatan akan segera diumumkan. Pantau terus halaman ini untuk update terbaru.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
} 
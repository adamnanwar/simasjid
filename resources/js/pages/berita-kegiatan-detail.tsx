import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Calendar,
    Users,
    ArrowLeft,
    Clock,
    Share2,
    BookOpen
} from 'lucide-react';

interface BeritaDetailProps {
    berita: {
        id: number;
        judul: string;
        konten: string;
        gambar: string;
        gambar_url: string;
        tanggal_publikasi: string;
        tanggal_kegiatan: string;
        penulis: string;
        jenis: 'berita' | 'kegiatan';
        slug: string;
    };
}

export default function BeritaKegiatanDetail({ berita }: BeritaDetailProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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
            <Head title={`${berita.judul} - Sistem Informasi Masjid`} />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-4xl px-6 sm:px-12 lg:px-16">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link href="/berita-kegiatan">
                            <Button variant="outline" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Kembali ke Berita & Kegiatan
                            </Button>
                        </Link>
                    </div>

                    <Card className="shadow-lg">
                        <CardContent className="p-0">
                            {/* Hero Image */}
                            {berita.gambar_url && (
                                <div className="relative">
                                    <img 
                                        src={berita.gambar_url}
                                        alt={berita.judul}
                                        className="w-full h-64 md:h-96 object-cover rounded-t-lg"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className={getCategoryColor(berita.jenis)}>
                                            {berita.jenis === 'berita' ? 'Berita' : 'Kegiatan'}
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-8">
                                {/* Title */}
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                    {berita.judul}
                                </h1>

                                {/* Meta Information */}
                                <div className="flex flex-wrap items-center gap-6 mb-8 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        <span>{berita.penulis || 'Penulis'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Dipublikasi: {formatDate(berita.tanggal_publikasi)}</span>
                                    </div>
                                    {berita.tanggal_kegiatan && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>Waktu Kegiatan: {formatDate(berita.tanggal_kegiatan)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="prose prose-lg max-w-none">
                                    <div 
                                        className="text-gray-700 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: berita.konten.replace(/\n/g, '<br />') }}
                                    />
                                </div>

                                {/* Share & Actions */}
                                <div className="mt-12 pt-6 border-t border-gray-200">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <Button variant="outline" size="sm">
                                                <Share2 className="h-4 w-4 mr-2" />
                                                Bagikan
                                            </Button>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            <BookOpen className="h-4 w-4 inline mr-1" />
                                            Artikel ini telah dibaca {Math.floor(Math.random() * 500) + 50} kali
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Articles */}
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Berita & Kegiatan Lainnya</h3>
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-4">Lihat berita dan kegiatan lainnya</p>
                            <Link href="/berita-kegiatan">
                                <Button className="bg-blue-600 hover:bg-blue-700">
                                    Lihat Semua Berita & Kegiatan
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 
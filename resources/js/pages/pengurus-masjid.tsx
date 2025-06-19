import React, { useState, useEffect } from 'react';
import MainLayout from '@/layouts/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, User } from 'lucide-react';

interface PengurusMasjid {
    id: number;
    nama: string;
    jabatan: string;
    telepon: string;
    email: string;
    deskripsi: string;
    foto: string | null;
    foto_url: string | null;
    urutan: number;
}

export default function PengurusMasjidPage() {
    const [pengurus, setPengurus] = useState<PengurusMasjid[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPengurus();
    }, []);

    const fetchPengurus = async () => {
        try {
            const response = await fetch('/api/pengurus-masjid');
            const data = await response.json();
            if (data.success) {
                setPengurus(data.data);
            }
        } catch (error) {
            console.error('Error fetching pengurus:', error);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (nama: string) => {
        return nama
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-12">
                    <div className="container mx-auto px-4">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Memuat data pengurus...</p>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 py-12">
                <div className="container mx-auto px-4">
                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-6">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Pengurus Masjid
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Tim yang berdedikasi untuk memajukan dan mengelola masjid dengan penuh amanah dan tanggung jawab
                        </p>
                    </div>

                    {/* Pengurus Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pengurus.map((person) => (
                            <Card key={person.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white border-0 shadow-lg">
                                <CardContent className="p-6 text-center">
                                    {/* Avatar */}
                                    <div className="relative mb-6">
                                        {person.foto_url ? (
                                            <img
                                                src={person.foto_url}
                                                alt={person.nama}
                                                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-gray-100 group-hover:border-emerald-200 transition-colors"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold border-4 border-gray-100 group-hover:border-emerald-200 transition-colors">
                                                {getInitials(person.nama)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {person.nama}
                                    </h3>

                                    {/* Position Badge */}
                                    <Badge className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-medium px-3 py-1">
                                        {person.jabatan}
                                    </Badge>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                        {person.deskripsi}
                                    </p>

                                    {/* Contact Info */}
                                    <div className="space-y-3">
                                        {person.telepon && (
                                            <div className="flex items-center justify-center text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                                                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                                <span>{person.telepon}</span>
                                            </div>
                                        )}
                                        
                                        {person.email && (
                                            <div className="flex items-center justify-center text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                                                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                                                <span className="truncate">{person.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {pengurus.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <User className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Belum Ada Data Pengurus
                            </h3>
                            <p className="text-gray-600">
                                Data pengurus masjid akan ditampilkan di sini setelah ditambahkan oleh admin.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

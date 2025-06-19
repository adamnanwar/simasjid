import React from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Users, Calendar, DollarSign, FileText, TrendingUp, Banknote } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <AdminLayout title="Dashboard Admin">
            {/* Welcome Card */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        Dashboard SIMASJID
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600">
                        Selamat datang di panel admin SIMASJID. Kelola semua data masjid dengan mudah dan efisien.
                    </p>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Link href="/admin/pengurus-masjid">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-emerald-100">
                                    <Users className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-900">Pengurus Masjid</h3>
                                    <p className="text-sm text-gray-500">Kelola data pengurus</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/janji-temu">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-900">Janji Temu</h3>
                                    <p className="text-sm text-gray-500">Kelola janji temu</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/keuangan/donasi">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-yellow-100">
                                    <Banknote className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-900">Donasi/Infaq</h3>
                                    <p className="text-sm text-gray-500">Kelola donasi masjid</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/keuangan/kas">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-900">Kas Masjid</h3>
                                    <p className="text-sm text-gray-500">Kelola kas masjid</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/berita">
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-900">Berita & Kegiatan</h3>
                                    <p className="text-sm text-gray-500">Kelola berita kegiatan</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Pengurus</p>
                                <p className="text-2xl font-bold text-gray-900">4</p>
                            </div>
                            <Users className="w-8 h-8 text-emerald-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Janji Temu Bulan Ini</p>
                                <p className="text-2xl font-bold text-gray-900">12</p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Donasi</p>
                                <p className="text-2xl font-bold text-gray-900">15.2M</p>
                            </div>
                            <Banknote className="w-8 h-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Berita Aktif</p>
                                <p className="text-2xl font-bold text-gray-900">8</p>
                            </div>
                            <FileText className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activities */}
            <Card>
                <CardHeader>
                    <CardTitle>Aktivitas Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Data pengurus berhasil ditambahkan</p>
                                <p className="text-sm text-gray-500">5 menit yang lalu</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Sukses</Badge>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Laporan keuangan diperbarui</p>
                                <p className="text-sm text-gray-500">1 jam yang lalu</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">Info</Badge>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm font-medium text-gray-900">Berita kegiatan dipublikasikan</p>
                                <p className="text-sm text-gray-500">2 jam yang lalu</p>
                            </div>
                            <Badge className="bg-purple-100 text-purple-800">Publikasi</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}

// Simple Badge component
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
            {children}
        </span>
    );
} 
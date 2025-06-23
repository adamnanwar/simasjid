import React, { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    CalendarCheck, 
    Plus, 
    Edit, 
    Trash2, 
    Star, 
    StarOff, 
    Eye, 
    MapPin, 
    Clock, 
    Users,
    DollarSign
} from 'lucide-react';
import { useAlert } from '@/hooks/use-alert';

interface KegiatanMendatang {
    id: number;
    judul: string;
    slug: string;
    deskripsi: string;
    gambar: string | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    waktu_mulai: string;
    waktu_selesai: string | null;
    lokasi: string;
    penanggung_jawab: string;
    persyaratan: string | null;
    kuota_peserta: number | null;
    biaya_pendaftaran: number;
    status: 'draft' | 'published' | 'cancelled';
    is_featured: boolean;
    kontak_info: {
        phone?: string;
        email?: string;
        whatsapp?: string;
    };
    catatan_tambahan: string | null;
    formatted_tanggal: string;
    formatted_waktu: string;
    formatted_biaya: string;
    status_badge: {
        class: string;
        text: string;
    };
    is_past_event: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    kegiatan: {
        data: KegiatanMendatang[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function KegiatanMendatangAdmin({ kegiatan }: Props) {
    const { alertState, showAlert, hideAlert } = useAlert();
    const [loading, setLoading] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, id: number, judul: string}>({
        show: false,
        id: 0,
        judul: ''
    });

    const showDeleteConfirm = (id: number, judul: string) => {
        setDeleteConfirm({ show: true, id, judul });
    };

    const hideDeleteConfirm = () => {
        setDeleteConfirm({ show: false, id: 0, judul: '' });
    };

    const handleDelete = async () => {
        const { id } = deleteConfirm;
        setLoading(true);
        hideDeleteConfirm();
        
        try {
            await router.delete(`/admin/kegiatan-mendatang/${id}`, {
                onSuccess: () => {
                    showAlert('success', 'Berhasil!', 'Kegiatan berhasil dihapus!');
                },
                onError: () => {
                    showAlert('error', 'Gagal!', 'Gagal menghapus kegiatan. Silakan coba lagi.');
                }
            });
        } catch (error) {
            showAlert('error', 'Error!', 'Terjadi kesalahan jaringan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
        setLoading(true);
        try {
            const response = await fetch(`/admin/kegiatan-mendatang/${id}/toggle-featured`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            
            if (data.success) {
                showAlert('success', 'Berhasil!', data.message);
                router.reload();
            } else {
                showAlert('error', 'Gagal!', 'Gagal mengubah status unggulan.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Terjadi kesalahan jaringan.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/admin/kegiatan-mendatang/${id}/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await response.json();
            
            if (data.success) {
                showAlert('success', 'Berhasil!', data.message);
                router.reload();
            } else {
                showAlert('error', 'Gagal!', 'Gagal mengubah status kegiatan.');
            }
        } catch (error) {
            showAlert('error', 'Error!', 'Terjadi kesalahan jaringan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AdminLayout title="Kelola Kegiatan Mendatang">
                <Head title="Kelola Kegiatan Mendatang - Admin SIMASJID" />
                
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <CalendarCheck className="h-7 w-7 text-indigo-600" />
                                Kelola Kegiatan Mendatang
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Kelola semua kegiatan mendatang masjid
                            </p>
                        </div>
                        <Link href="/admin/kegiatan-mendatang/create">
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Kegiatan
                            </Button>
                        </Link>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Kegiatan</p>
                                        <p className="text-2xl font-bold">{kegiatan.total}</p>
                                    </div>
                                    <CalendarCheck className="h-8 w-8 text-indigo-600" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Dipublikasi</p>
                                        <p className="text-2xl font-bold">
                                            {kegiatan.data.filter(k => k.status === 'published').length}
                                        </p>
                                    </div>
                                    <Eye className="h-8 w-8 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Draft</p>
                                        <p className="text-2xl font-bold">
                                            {kegiatan.data.filter(k => k.status === 'draft').length}
                                        </p>
                                    </div>
                                    <Edit className="h-8 w-8 text-yellow-600" />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Unggulan</p>
                                        <p className="text-2xl font-bold">
                                            {kegiatan.data.filter(k => k.is_featured).length}
                                        </p>
                                    </div>
                                    <Star className="h-8 w-8 text-orange-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Kegiatan List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Kegiatan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {kegiatan.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <CalendarCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Belum ada kegiatan yang ditambahkan</p>
                                    <Link href="/admin/kegiatan-mendatang/create">
                                        <Button className="mt-4">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Tambah Kegiatan Pertama
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {kegiatan.data.map((item) => (
                                        <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {item.judul}
                                                        </h3>
                                                        <Badge className={item.status_badge.class}>
                                                            {item.status_badge.text}
                                                        </Badge>
                                                        {item.is_featured && (
                                                            <Badge className="bg-orange-100 text-orange-800">
                                                                <Star className="h-3 w-3 mr-1" />
                                                                Unggulan
                                                            </Badge>
                                                        )}
                                                        {item.is_past_event && (
                                                            <Badge className="bg-gray-100 text-gray-800">
                                                                Sudah Berlalu
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    
                                                    <p className="text-gray-600 mb-3 line-clamp-2">
                                                        {item.deskripsi}
                                                    </p>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{item.formatted_tanggal}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{item.lokasi}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4" />
                                                            <span>{item.formatted_biaya}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    {item.kuota_peserta && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                                            <Users className="h-4 w-4" />
                                                            <span>Kuota: {item.kuota_peserta} peserta</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-2 ml-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                                                        disabled={loading}
                                                    >
                                                        {item.is_featured ? (
                                                            <StarOff className="h-4 w-4" />
                                                        ) : (
                                                            <Star className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                        className="text-sm border border-gray-300 rounded px-2 py-1"
                                                        disabled={loading}
                                                    >
                                                        <option value="draft">Draft</option>
                                                        <option value="published">Dipublikasi</option>
                                                        <option value="cancelled">Dibatalkan</option>
                                                    </select>
                                                    
                                                    <Link href={`/admin/kegiatan-mendatang/${item.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => showDeleteConfirm(item.id, item.judul)}
                                                        disabled={loading}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
            
            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3 bg-red-100 text-red-600">
                                <Trash2 className="w-4 h-4" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Konfirmasi Hapus</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Apakah Anda yakin ingin menghapus kegiatan <strong>"{deleteConfirm.judul}"</strong>? 
                            Tindakan ini tidak dapat dibatalkan.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button 
                                variant="outline" 
                                onClick={hideDeleteConfirm}
                                disabled={loading}
                            >
                                Batal
                            </Button>
                            <Button 
                                onClick={handleDelete}
                                disabled={loading}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                {loading ? 'Menghapus...' : 'Hapus'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert Component */}
            {alertState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                                alertState.type === 'success' ? 'bg-green-100 text-green-600' :
                                alertState.type === 'error' ? 'bg-red-100 text-red-600' :
                                alertState.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-blue-100 text-blue-600'
                            }`}>
                                {alertState.type === 'success' ? '✓' :
                                 alertState.type === 'error' ? '✕' :
                                 alertState.type === 'warning' ? '⚠' : 'ℹ'}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{alertState.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-6">{alertState.message}</p>
                        <div className="flex justify-end">
                            <Button onClick={hideAlert} className="bg-blue-600 hover:bg-blue-700">
                                OK
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 
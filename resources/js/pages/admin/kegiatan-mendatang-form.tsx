import React, { useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarCheck, ArrowLeft, Save } from 'lucide-react';
import { useAlert } from '@/hooks/use-alert';

interface KegiatanData {
    id?: number;
    judul: string;
    deskripsi: string;
    gambar?: File | null;
    tanggal_mulai: string;
    tanggal_selesai: string;
    waktu_mulai: string;
    waktu_selesai: string;
    lokasi: string;
    penanggung_jawab: string;
    persyaratan: string;
    kuota_peserta: number | null;
    biaya_pendaftaran: number;
    status: 'draft' | 'published' | 'cancelled';
    is_featured: boolean;
    kontak_phone: string;
    kontak_email: string;
    kontak_whatsapp: string;
    catatan_tambahan: string;
}

interface Props {
    kegiatan?: KegiatanData;
    isEdit?: boolean;
}

export default function KegiatanMendatangForm({ kegiatan, isEdit = false }: Props) {
    const { alertState, showAlert, hideAlert } = useAlert();
    
    const { data, setData, post, put, processing, errors, reset } = useForm<KegiatanData>({
        judul: kegiatan?.judul || '',
        deskripsi: kegiatan?.deskripsi || '',
        gambar: null,
        tanggal_mulai: kegiatan?.tanggal_mulai || '',
        tanggal_selesai: kegiatan?.tanggal_selesai || '',
        waktu_mulai: kegiatan?.waktu_mulai || '',
        waktu_selesai: kegiatan?.waktu_selesai || '',
        lokasi: kegiatan?.lokasi || '',
        penanggung_jawab: kegiatan?.penanggung_jawab || '',
        persyaratan: kegiatan?.persyaratan || '',
        kuota_peserta: kegiatan?.kuota_peserta || null,
        biaya_pendaftaran: kegiatan?.biaya_pendaftaran || 0,
        status: kegiatan?.status || 'draft',
        is_featured: kegiatan?.is_featured || false,
        kontak_phone: kegiatan?.kontak_phone || '',
        kontak_email: kegiatan?.kontak_email || '',
        kontak_whatsapp: kegiatan?.kontak_whatsapp || '',
        catatan_tambahan: kegiatan?.catatan_tambahan || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEdit && kegiatan?.id) {
            put(`/admin/kegiatan-mendatang/${kegiatan.id}`, {
                onSuccess: () => {
                    showAlert('success', 'Berhasil!', 'Kegiatan berhasil diperbarui!');
                },
                onError: () => {
                    showAlert('error', 'Gagal!', 'Terjadi kesalahan saat memperbarui kegiatan.');
                }
            });
        } else {
            post('/admin/kegiatan-mendatang', {
                onSuccess: () => {
                    showAlert('success', 'Berhasil!', 'Kegiatan berhasil ditambahkan!');
                    reset();
                },
                onError: () => {
                    showAlert('error', 'Gagal!', 'Terjadi kesalahan saat menambahkan kegiatan.');
                }
            });
        }
    };

    return (
        <>
            <AdminLayout title={isEdit ? 'Edit Kegiatan' : 'Tambah Kegiatan'}>
                <Head title={`${isEdit ? 'Edit' : 'Tambah'} Kegiatan Mendatang - Admin SIMASJID`} />
                
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/kegiatan-mendatang">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Kembali
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <CalendarCheck className="h-7 w-7 text-indigo-600" />
                                    {isEdit ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {isEdit ? 'Perbarui informasi kegiatan' : 'Tambahkan kegiatan mendatang baru'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informasi Dasar</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="judul">Judul Kegiatan *</Label>
                                            <Input
                                                id="judul"
                                                value={data.judul}
                                                onChange={(e) => setData('judul', e.target.value)}
                                                placeholder="Masukkan judul kegiatan"
                                            />
                                            {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="deskripsi">Deskripsi *</Label>
                                            <Textarea
                                                id="deskripsi"
                                                value={data.deskripsi}
                                                onChange={(e) => setData('deskripsi', e.target.value)}
                                                placeholder="Masukkan deskripsi kegiatan"
                                                rows={4}
                                            />
                                            {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="gambar">Gambar Kegiatan</Label>
                                            <Input
                                                id="gambar"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setData('gambar', e.target.files?.[0] || null)}
                                            />
                                            {errors.gambar && <p className="text-red-500 text-sm mt-1">{errors.gambar}</p>}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Date & Time */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Waktu & Tempat</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="tanggal_mulai">Tanggal Mulai *</Label>
                                                <Input
                                                    id="tanggal_mulai"
                                                    type="date"
                                                    value={data.tanggal_mulai}
                                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                                />
                                                {errors.tanggal_mulai && <p className="text-red-500 text-sm mt-1">{errors.tanggal_mulai}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="tanggal_selesai">Tanggal Selesai *</Label>
                                                <Input
                                                    id="tanggal_selesai"
                                                    type="date"
                                                    value={data.tanggal_selesai}
                                                    onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                                />
                                                {errors.tanggal_selesai && <p className="text-red-500 text-sm mt-1">{errors.tanggal_selesai}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="waktu_mulai">Waktu Mulai *</Label>
                                                <Input
                                                    id="waktu_mulai"
                                                    type="time"
                                                    value={data.waktu_mulai}
                                                    onChange={(e) => setData('waktu_mulai', e.target.value)}
                                                />
                                                {errors.waktu_mulai && <p className="text-red-500 text-sm mt-1">{errors.waktu_mulai}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="waktu_selesai">Waktu Selesai</Label>
                                                <Input
                                                    id="waktu_selesai"
                                                    type="time"
                                                    value={data.waktu_selesai}
                                                    onChange={(e) => setData('waktu_selesai', e.target.value)}
                                                />
                                                {errors.waktu_selesai && <p className="text-red-500 text-sm mt-1">{errors.waktu_selesai}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="lokasi">Lokasi *</Label>
                                            <Input
                                                id="lokasi"
                                                value={data.lokasi}
                                                onChange={(e) => setData('lokasi', e.target.value)}
                                                placeholder="Masukkan lokasi kegiatan"
                                            />
                                            {errors.lokasi && <p className="text-red-500 text-sm mt-1">{errors.lokasi}</p>}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Additional Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informasi Tambahan</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="penanggung_jawab">Penanggung Jawab *</Label>
                                            <Input
                                                id="penanggung_jawab"
                                                value={data.penanggung_jawab}
                                                onChange={(e) => setData('penanggung_jawab', e.target.value)}
                                                placeholder="Nama penanggung jawab"
                                            />
                                            {errors.penanggung_jawab && <p className="text-red-500 text-sm mt-1">{errors.penanggung_jawab}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="persyaratan">Persyaratan</Label>
                                            <Textarea
                                                id="persyaratan"
                                                value={data.persyaratan}
                                                onChange={(e) => setData('persyaratan', e.target.value)}
                                                placeholder="Persyaratan untuk mengikuti kegiatan"
                                                rows={3}
                                            />
                                            {errors.persyaratan && <p className="text-red-500 text-sm mt-1">{errors.persyaratan}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="kuota_peserta">Kuota Peserta</Label>
                                                <Input
                                                    id="kuota_peserta"
                                                    type="number"
                                                    min="1"
                                                    value={data.kuota_peserta || ''}
                                                    onChange={(e) => setData('kuota_peserta', e.target.value ? parseInt(e.target.value) : null)}
                                                    placeholder="Jumlah maksimal peserta"
                                                />
                                                {errors.kuota_peserta && <p className="text-red-500 text-sm mt-1">{errors.kuota_peserta}</p>}
                                            </div>

                                            <div>
                                                <Label htmlFor="biaya_pendaftaran">Biaya Pendaftaran *</Label>
                                                <Input
                                                    id="biaya_pendaftaran"
                                                    type="number"
                                                    min="0"
                                                    value={data.biaya_pendaftaran}
                                                    onChange={(e) => setData('biaya_pendaftaran', parseFloat(e.target.value) || 0)}
                                                    placeholder="0 untuk gratis"
                                                />
                                                {errors.biaya_pendaftaran && <p className="text-red-500 text-sm mt-1">{errors.biaya_pendaftaran}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="catatan_tambahan">Catatan Tambahan</Label>
                                            <Textarea
                                                id="catatan_tambahan"
                                                value={data.catatan_tambahan}
                                                onChange={(e) => setData('catatan_tambahan', e.target.value)}
                                                placeholder="Catatan atau informasi tambahan"
                                                rows={3}
                                            />
                                            {errors.catatan_tambahan && <p className="text-red-500 text-sm mt-1">{errors.catatan_tambahan}</p>}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Status & Options */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Status & Opsi</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="status">Status *</Label>
                                            <select
                                                id="status"
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value as 'draft' | 'published' | 'cancelled')}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Dipublikasi</option>
                                                <option value="cancelled">Dibatalkan</option>
                                            </select>
                                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="is_featured"
                                                checked={data.is_featured}
                                                onCheckedChange={(checked) => setData('is_featured', checked as boolean)}
                                            />
                                            <Label htmlFor="is_featured">Jadikan Kegiatan Unggulan</Label>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Contact Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informasi Kontak</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="kontak_phone">No. Telepon</Label>
                                            <Input
                                                id="kontak_phone"
                                                value={data.kontak_phone}
                                                onChange={(e) => setData('kontak_phone', e.target.value)}
                                                placeholder="08xxxxxxxxxx"
                                            />
                                            {errors.kontak_phone && <p className="text-red-500 text-sm mt-1">{errors.kontak_phone}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="kontak_email">Email</Label>
                                            <Input
                                                id="kontak_email"
                                                type="email"
                                                value={data.kontak_email}
                                                onChange={(e) => setData('kontak_email', e.target.value)}
                                                placeholder="email@example.com"
                                            />
                                            {errors.kontak_email && <p className="text-red-500 text-sm mt-1">{errors.kontak_email}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="kontak_whatsapp">WhatsApp</Label>
                                            <Input
                                                id="kontak_whatsapp"
                                                value={data.kontak_whatsapp}
                                                onChange={(e) => setData('kontak_whatsapp', e.target.value)}
                                                placeholder="08xxxxxxxxxx"
                                            />
                                            {errors.kontak_whatsapp && <p className="text-red-500 text-sm mt-1">{errors.kontak_whatsapp}</p>}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Submit Button */}
                                <Card>
                                    <CardContent className="pt-6">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {processing ? 'Menyimpan...' : (isEdit ? 'Perbarui Kegiatan' : 'Simpan Kegiatan')}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </AdminLayout>

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
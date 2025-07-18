import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, DollarSign, TrendingUp, User, Calendar } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

interface Donasi {
    id: number;
    nama: string;
    email: string;
    telepon: string;
    jumlah: number;
    keterangan: string;
    tanggal: string;
    kategori?: string;
    program?: string;
    metode?: string;
    created_at: string;
}

export default function AdminKeuanganDonasi() {
    const [donations, setDonations] = useState<Donasi[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [editingDonation, setEditingDonation] = useState<Donasi | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        email: '',
        telepon: '',
        jumlah: '',
        keterangan: '',
        tanggal: new Date().toISOString().split('T')[0],
        kategori: 'Infaq',
        program: 'Donasi Umum',
        metode: 'Tunai',
    });

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await fetch('/api/laporan-infaq');
            const result = await response.json();
            console.log('Donasi API Response:', result); // Debug log
            if (result.success && result.data) {
                const processedData = result.data.map((item: any) => ({
                    id: item.id,
                    nama: item.nama || item.nama_donatur || 'Donatur Anonim',
                    email: item.email || '',
                    telepon: item.telepon || '',
                    jumlah: parseFloat(item.jumlah) || 0,
                    keterangan: item.keterangan || '',
                    tanggal: item.tanggal,
                    created_at: item.created_at
                }));
                setDonations(processedData);
                console.log('Donasi successfully loaded', processedData.length, 'items'); // Debug log
            } else {
                console.log('Donasi: No data from API, using fallback'); // Debug log
                setDonations([]);
            }
        } catch (error) {
            console.error('Error fetching donations:', error);
            setDonations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (donationData?: Donasi) => {
        if (donationData) {
            setEditingDonation(donationData);
            setData({
                nama: donationData.nama,
                email: donationData.email || '',
                telepon: donationData.telepon || '',
                jumlah: donationData.jumlah.toString(),
                keterangan: donationData.keterangan || '',
                tanggal: donationData.tanggal.split('T')[0],
                kategori: donationData.kategori || 'Infaq',
                program: donationData.program || 'Donasi Umum',
                metode: donationData.metode || 'Tunai',
            });
        } else {
            setEditingDonation(null);
            reset();
            setData({
                nama: '',
                email: '',
                telepon: '',
                jumlah: '',
                keterangan: '',
                tanggal: new Date().toISOString().split('T')[0],
                kategori: 'Infaq',
                program: 'Donasi Umum',
                metode: 'Tunai',
            });
        }
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingDonation(null);
        reset();
    };

        const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Set default values untuk field yang kosong
        const finalNama = data.nama.trim() || 'Hamba Allah';
        const finalEmail = data.email.trim() || 'hamba.allah@alikhlash.com';
        const finalTelepon = data.telepon.trim() || '-';
        
        const formData = {
            nama_donatur: finalNama,
            email: finalEmail,
            phone: finalTelepon,
            tanggal: data.tanggal,
            kategori: data.kategori,
            program: data.program,
            jumlah: parseFloat(data.jumlah) || 0,
            metode: data.metode,
            description: data.keterangan,
            anonim: false
        };

        if (editingDonation) {
            // Use router.post with _method: 'PUT' for update
            router.post(`/laporan-infaq/${editingDonation.id}`, {
                ...formData,
                _method: 'PUT'
            }, {
                onSuccess: () => {
                    handleCloseDialog();
                    fetchDonations();
                },
                onError: (errors) => {
                    console.error('Error updating donation:', errors);
                }
            });
        } else {
            router.post('/laporan-infaq', formData, {
                onSuccess: () => {
                    handleCloseDialog();
                    fetchDonations();
                },
                onError: (errors) => {
                    console.error('Error creating donation:', errors);
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data donasi ini?')) {
            fetch(`/laporan-infaq/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                }
            }).then(() => {
                fetchDonations();
            });
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const totalDonasi = donations.reduce((sum, donation) => sum + donation.jumlah, 0);
    const donasiBulanIni = donations.filter(d => {
        const donationDate = new Date(d.tanggal);
        const now = new Date();
        return donationDate.getMonth() === now.getMonth() && donationDate.getFullYear() === now.getFullYear();
    });
    const totalBulanIni = donasiBulanIni.reduce((sum, donation) => sum + donation.jumlah, 0);

    if (loading) {
        return (
            <AdminLayout title="Kelola Donasi/Infaq">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data donasi...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Kelola Donasi/Infaq">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Donasi</p>
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalDonasi)}</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
                                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBulanIni)}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Donatur</p>
                                <p className="text-2xl font-bold text-purple-600">{donations.length}</p>
                            </div>
                            <User className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-gray-600">Kelola data donasi dan infaq masjid</p>
                </div>
                
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Donasi
                        </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingDonation ? 'Edit Donasi' : 'Tambah Donasi Baru'}
                            </DialogTitle>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nama">Nama Donatur</Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        placeholder="Masukkan nama donatur (opsional)"
                                    />
                                    {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="jumlah">Jumlah Donasi *</Label>
                                    <Input
                                        id="jumlah"
                                        type="number"
                                        value={data.jumlah}
                                        onChange={(e) => setData('jumlah', e.target.value)}
                                        placeholder="50000"
                                        required
                                        min="0"
                                    />
                                    {errors.jumlah && <p className="text-red-500 text-sm mt-1">{errors.jumlah}</p>}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@contoh.com (opsional)"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="telepon">Nomor Telepon</Label>
                                    <Input
                                        id="telepon"
                                        value={data.telepon}
                                        onChange={(e) => setData('telepon', e.target.value)}
                                        placeholder="+62 812-3456-7890 (opsional)"
                                    />
                                    {errors.telepon && <p className="text-red-500 text-sm mt-1">{errors.telepon}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="tanggal">Tanggal Donasi *</Label>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                    required
                                />
                                {errors.tanggal && <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="kategori">Kategori Donasi *</Label>
                                    <select
                                        id="kategori"
                                        value={data.kategori || 'Infaq'}
                                        onChange={(e) => setData('kategori', e.target.value)}
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        required
                                    >
                                        <option value="Infaq">Infaq</option>
                                        <option value="Sedekah">Sedekah</option>
                                        <option value="Zakat">Zakat</option>
                                    </select>
                                    {errors.kategori && <p className="text-red-500 text-sm mt-1">{errors.kategori}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="program">Program *</Label>
                                    <select
                                        id="program"
                                        value={data.program || 'Donasi Umum'}
                                        onChange={(e) => setData('program', e.target.value)}
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        required
                                    >
                                        <option value="Donasi Umum">Donasi Umum</option>
                                        <option value="Pembangunan">Pembangunan</option>
                                        <option value="Operasional">Operasional</option>
                                        <option value="Ramadan">Ramadan</option>
                                        <option value="Qurban">Qurban</option>
                                    </select>
                                    {errors.program && <p className="text-red-500 text-sm mt-1">{errors.program}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="metode">Metode Pembayaran *</Label>
                                    <select
                                        id="metode"
                                        value={data.metode || 'Tunai'}
                                        onChange={(e) => setData('metode', e.target.value)}
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        required
                                    >
                                        <option value="Tunai">Tunai</option>
                                        <option value="Transfer Bank">Transfer Bank</option>
                                        <option value="E-Wallet">E-Wallet</option>
                                        <option value="Kartu Kredit">Kartu Kredit</option>
                                    </select>
                                    {errors.metode && <p className="text-red-500 text-sm mt-1">{errors.metode}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="keterangan">Keterangan</Label>
                                <textarea
                                    id="keterangan"
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    placeholder="Keterangan donasi (opsional)..."
                                    rows={3}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.keterangan && <p className="text-red-500 text-sm mt-1">{errors.keterangan}</p>}
                            </div>
                            
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    {processing ? 'Menyimpan...' : editingDonation ? 'Perbarui' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Donations List */}
            <div className="grid grid-cols-1 gap-4">
                {donations.map((donation) => (
                    <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">
                                        {donation.nama ? donation.nama.charAt(0).toUpperCase() : 'D'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{donation.nama}</h3>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {new Date(donation.tanggal).toLocaleDateString('id-ID')}
                                            </span>
                                            {donation.email && <span>{donation.email}</span>}
                                            {donation.telepon && <span>{donation.telepon}</span>}
                                        </div>
                                        {donation.keterangan && (
                                            <p className="text-sm text-gray-600 mt-1">{donation.keterangan}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-600">
                                            {formatCurrency(donation.jumlah)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Dibuat: {new Date(donation.created_at).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenDialog(donation)}
                                        >
                                            <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(donation.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {donations.length === 0 && (
                <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data Donasi</h3>
                    <p className="text-gray-600 mb-4">Mulai dengan menambahkan data donasi pertama</p>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Donasi
                    </Button>
                </div>
            )}
        </AdminLayout>
    );
} 
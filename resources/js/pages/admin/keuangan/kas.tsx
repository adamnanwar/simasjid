import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, Wallet, Calendar, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';

interface TransaksiKas {
    id: number;
    jenis: 'masuk' | 'keluar';
    keterangan: string;
    jumlah: number;
    tanggal: string;
    kategori: string;
    created_at: string;
}

interface Props {
    laporanKas: {
        data: TransaksiKas[];
        links: any;
        meta: any;
    };
}

export default function AdminKeuanganKas({ laporanKas }: Props) {
    const [showDialog, setShowDialog] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<TransaksiKas | null>(null);
    const [filter, setFilter] = useState<'all' | 'masuk' | 'keluar'>('all');

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        jenis: 'masuk' as 'masuk' | 'keluar',
        keterangan: '',
        jumlah: '',
        tanggal: new Date().toISOString().split('T')[0],
        kategori: '',
    });

    // Use transactions from Inertia props
    const transactions = laporanKas?.data || [];

    const handleOpenDialog = (transactionData?: TransaksiKas) => {
        if (transactionData) {
            setEditingTransaction(transactionData);
            setData({
                jenis: transactionData.jenis,
                keterangan: transactionData.keterangan,
                jumlah: transactionData.jumlah.toString(),
                tanggal: transactionData.tanggal.split('T')[0],
                kategori: transactionData.kategori,
            });
        } else {
            setEditingTransaction(null);
            reset();
            setData({
                jenis: 'masuk',
                keterangan: '',
                jumlah: '',
                tanggal: new Date().toISOString().split('T')[0],
                kategori: '',
            });
        }
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingTransaction(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = {
            ...data,
            jumlah: parseFloat(data.jumlah) || 0,
        };

        if (editingTransaction) {
            // Use router.put for update
            router.put(`/laporan-kas/${editingTransaction.id}`, formData, {
                onSuccess: () => {
                    handleCloseDialog();
                }
            });
        } else {
            // Use router.post for create
            router.post('/laporan-kas', formData, {
                onSuccess: () => {
                    handleCloseDialog();
                }
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
            router.delete(`/laporan-kas/${id}`);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const totalMasuk = transactions.filter(t => t.jenis === 'masuk').reduce((sum, t) => sum + t.jumlah, 0);
    const totalKeluar = transactions.filter(t => t.jenis === 'keluar').reduce((sum, t) => sum + t.jumlah, 0);
    const saldoKas = totalMasuk - totalKeluar;

    const masukBulanIni = transactions.filter(t => {
        const transDate = new Date(t.tanggal);
        const now = new Date();
        return t.jenis === 'masuk' && transDate.getMonth() === now.getMonth() && transDate.getFullYear() === now.getFullYear();
    }).reduce((sum, t) => sum + t.jumlah, 0);

    const keluarBulanIni = transactions.filter(t => {
        const transDate = new Date(t.tanggal);
        const now = new Date();
        return t.jenis === 'keluar' && transDate.getMonth() === now.getMonth() && transDate.getFullYear() === now.getFullYear();
    }).reduce((sum, t) => sum + t.jumlah, 0);

    const filteredTransactions = transactions.filter(transaction => {
        if (filter === 'all') return true;
        return transaction.jenis === filter;
    }).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

    const kategoriOptions = ['Donasi', 'Operasional', 'Pembangunan', 'Kegiatan', 'Utilitas', 'Lainnya'];

    if (laporanKas === null) {
        return (
            <AdminLayout title="Kelola Kas Masjid">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data kas...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Kelola Kas Masjid">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Saldo Kas</p>
                                <p className={`text-2xl font-bold ${saldoKas >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(saldoKas)}
                                </p>
                            </div>
                            <Wallet className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Masuk</p>
                                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalMasuk)}</p>
                            </div>
                            <ArrowUpCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Keluar</p>
                                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalKeluar)}</p>
                            </div>
                            <ArrowDownCircle className="w-8 h-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Transaksi</p>
                                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and Add Button */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-1">
                    {[
                        { key: 'all', label: 'Semua', count: transactions.length },
                        { key: 'masuk', label: 'Kas Masuk', count: transactions.filter(t => t.jenis === 'masuk').length },
                        { key: 'keluar', label: 'Kas Keluar', count: transactions.filter(t => t.jenis === 'keluar').length },
                    ].map(tab => (
                        <Button
                            key={tab.key}
                            variant={filter === tab.key ? 'default' : 'outline'}
                            onClick={() => setFilter(tab.key as any)}
                            className={filter === tab.key ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                        >
                            {tab.label} ({tab.count})
                        </Button>
                    ))}
                </div>
                
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Transaksi
                        </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingTransaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
                            </DialogTitle>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="jenis">Jenis Transaksi *</Label>
                                    <select
                                        id="jenis"
                                        value={data.jenis}
                                        onChange={(e) => setData('jenis', e.target.value as 'masuk' | 'keluar')}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="masuk">Kas Masuk</option>
                                        <option value="keluar">Kas Keluar</option>
                                    </select>
                                    {errors.jenis && <p className="text-red-500 text-sm mt-1">{errors.jenis}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="jumlah">Jumlah *</Label>
                                    <Input
                                        id="jumlah"
                                        type="number"
                                        value={data.jumlah}
                                        onChange={(e) => setData('jumlah', e.target.value)}
                                        placeholder="100000"
                                        required
                                        min="0"
                                    />
                                    {errors.jumlah && <p className="text-red-500 text-sm mt-1">{errors.jumlah}</p>}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="kategori">Kategori *</Label>
                                    <select
                                        id="kategori"
                                        value={data.kategori}
                                        onChange={(e) => setData('kategori', e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {kategoriOptions.map(kategori => (
                                            <option key={kategori} value={kategori}>{kategori}</option>
                                        ))}
                                    </select>
                                    {errors.kategori && <p className="text-red-500 text-sm mt-1">{errors.kategori}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="tanggal">Tanggal *</Label>
                                    <Input
                                        id="tanggal"
                                        type="date"
                                        value={data.tanggal}
                                        onChange={(e) => setData('tanggal', e.target.value)}
                                        required
                                    />
                                    {errors.tanggal && <p className="text-red-500 text-sm mt-1">{errors.tanggal}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="keterangan">Keterangan *</Label>
                                <textarea
                                    id="keterangan"
                                    value={data.keterangan}
                                    onChange={(e) => setData('keterangan', e.target.value)}
                                    placeholder="Deskripsi transaksi..."
                                    rows={3}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />
                                {errors.keterangan && <p className="text-red-500 text-sm mt-1">{errors.keterangan}</p>}
                            </div>
                            
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    {processing ? 'Menyimpan...' : editingTransaction ? 'Perbarui' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Transactions List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredTransactions.map((transaction) => (
                    <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                                        transaction.jenis === 'masuk' 
                                            ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                                            : 'bg-gradient-to-br from-red-400 to-rose-500'
                                    }`}>
                                        {transaction.jenis === 'masuk' ? 
                                            <ArrowUpCircle className="w-6 h-6" /> : 
                                            <ArrowDownCircle className="w-6 h-6" />
                                        }
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-lg font-semibold text-gray-900">{transaction.keterangan}</h3>
                                            <Badge 
                                                className={transaction.jenis === 'masuk' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                                }
                                            >
                                                {transaction.jenis === 'masuk' ? 'Masuk' : 'Keluar'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                                            <span className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {new Date(transaction.tanggal).toLocaleDateString('id-ID')}
                                            </span>
                                            <Badge variant="outline" className="text-xs">
                                                {transaction.kategori}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className={`text-2xl font-bold ${
                                            transaction.jenis === 'masuk' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {transaction.jenis === 'masuk' ? '+' : '-'}{formatCurrency(transaction.jumlah)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Dibuat: {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenDialog(transaction)}
                                        >
                                            <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(transaction.id)}
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
            {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                    <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {filter === 'all' ? 'Belum Ada Transaksi' : `Tidak Ada Transaksi ${filter === 'masuk' ? 'Masuk' : 'Keluar'}`}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {filter === 'all' ? 'Mulai dengan menambahkan transaksi kas pertama' : 'Pilih filter lain untuk melihat transaksi.'}
                    </p>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Transaksi
                    </Button>
                </div>
            )}
        </AdminLayout>
    );
} 
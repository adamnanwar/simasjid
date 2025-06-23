import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    FileText,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar,
    Download
} from 'lucide-react';
import { useAlert } from '@/hooks/use-alert';

interface LaporanKasProps {
    transactions: any[];
    summary: {
        totalPemasukan: number;
        totalPengeluaran: number;
        saldo: number;
        totalTransaksi: number;
    };
    transactionsBySumber: any[];
    filters: {
        start_date: string;
        end_date: string;
        kategori: string;
        status: string;
    };
}

export default function LaporanKas({ 
    transactions, 
    summary, 
    transactionsBySumber, 
    filters 
}: LaporanKasProps) {
    const [selectedPeriod, setSelectedPeriod] = useState('bulan-ini');
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);
    const { alertState, showAlert, hideAlert } = useAlert();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const exportToPDF = async () => {
        try {
            const response = await fetch('/api/export/laporan-kas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    period: selectedPeriod,
                    transactions: filteredTransactions,
                    summary: {
                        totalPemasukan: summary.totalPemasukan,
                        totalPengeluaran: summary.totalPengeluaran,
                        saldo: summary.saldo,
                        totalTransaksi: summary.totalTransaksi
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Gagal mengunduh laporan');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `laporan-kas-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            showAlert('success', 'Berhasil!', 'Laporan kas berhasil diunduh dalam format PDF');
        } catch (error) {
            showAlert('error', 'Gagal!', 'Terjadi kesalahan saat mengunduh laporan. Silakan coba lagi.');
        }
    };

    const filterTransactionsByPeriod = (period: string) => {
        const now = new Date();
        let startDate: Date;
        
        switch (period) {
            case 'hari-ini':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'minggu-ini':
                const dayOfWeek = now.getDay();
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
                break;
            case 'bulan-ini':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'tahun-ini':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        
        const filtered = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.tanggal);
            return transactionDate >= startDate && transactionDate <= now;
        });
        
        setFilteredTransactions(filtered);
        setSelectedPeriod(period);
    };

    // Initialize with current month data when component mounts
    useEffect(() => {
        filterTransactionsByPeriod('bulan-ini');
    }, []);

    const summaryData = [
        {
            title: 'Total Pemasukan',
            value: formatCurrency(summary.totalPemasukan),
            change: `${summary.totalTransaksi} transaksi`,
            trend: 'up',
            icon: TrendingUp,
            color: 'text-green-600 bg-green-100'
        },
        {
            title: 'Total Pengeluaran',
            value: formatCurrency(summary.totalPengeluaran),
            change: `${Math.abs(summary.totalPengeluaran)} pengeluaran`,
            trend: 'up',
            icon: TrendingDown,
            color: 'text-red-600 bg-red-100'
        },
        {
            title: 'Saldo Akhir',
            value: formatCurrency(summary.saldo),
            change: summary.saldo > 0 ? 'Surplus' : 'Defisit',
            trend: summary.saldo > 0 ? 'up' : 'down',
            icon: DollarSign,
            color: summary.saldo > 0 ? 'text-blue-600 bg-blue-100' : 'text-red-600 bg-red-100'
        }
    ];

    return (
        <>
            <MainLayout>
                <Head title="Laporan Kas - Sistem Informasi Masjid Al-Ikhlash" />
                
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        <FileText className="h-8 w-8 text-blue-600" />
                                        Laporan Kas Masjid
                                    </h1>
                                    <p className="mt-2 text-lg text-gray-600">
                                        Kelola dan pantau keuangan masjid secara real-time
                                    </p>
                                </div>
                                <div className="mt-4 flex gap-3 md:mt-0">
                                    <Button variant="outline" className="flex items-center gap-2" onClick={exportToPDF}>
                                        <Download className="h-4 w-4" />
                                        Export
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Period Selection */}
                        <div className="mb-8">
                            <div className="flex gap-2 flex-wrap">
                                {[
                                    { value: 'hari-ini', label: 'Hari Ini' },
                                    { value: 'minggu-ini', label: 'Minggu Ini' },
                                    { value: 'bulan-ini', label: 'Bulan Ini' },
                                    { value: 'tahun-ini', label: 'Tahun Ini' }
                                ].map((period) => (
                                    <Button
                                        key={period.value}
                                        variant={selectedPeriod === period.value ? "default" : "outline"}
                                        onClick={() => filterTransactionsByPeriod(period.value)}
                                        className={selectedPeriod === period.value ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                                    >
                                        {period.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                            {summaryData.map((item) => (
                                <Card key={item.title} className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600">{item.title}</p>
                                                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                                                <p className="text-sm text-emerald-600 font-medium">{item.change}</p>
                                            </div>
                                            <div className={`rounded-full p-3 ${item.color}`}>
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Transaction Table */}
                        <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Riwayat Transaksi
                                </CardTitle>
                                <CardDescription>
                                    Daftar transaksi pemasukan dan pengeluaran kas masjid
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Tanggal</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Kategori</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Sumber</th>
                                                <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Jumlah</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Keterangan</th>
                                                <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredTransactions.map((transaction) => (
                                                <tr key={transaction.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-4 text-sm text-gray-900">
                                                        {new Date(transaction.tanggal).toLocaleDateString('id-ID')}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <Badge 
                                                            variant={transaction.kategori === 'Pemasukan' ? 'default' : 'destructive'}
                                                            className={transaction.kategori === 'Pemasukan' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                                        >
                                                            {transaction.kategori}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-900">{transaction.sumber}</td>
                                                    <td className={`px-4 py-4 text-sm font-medium text-right ${
                                                        transaction.jumlah > 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {formatCurrency(Math.abs(transaction.jumlah))}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{transaction.keterangan}</td>
                                                    <td className="px-4 py-4 text-center">
                                                        <Badge 
                                                            variant={transaction.status === 'verified' ? 'default' : 'secondary'}
                                                            className={transaction.status === 'verified' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}
                                                        >
                                                            {transaction.status === 'verified' ? 'Terverifikasi' : 'Pending'}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </MainLayout>
            
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
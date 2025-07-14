import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertModal } from '@/components/ui/alert-modal';
import { Plus, Calculator, Users, DollarSign, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { useAlert } from '@/hooks/use-alert';
import { router } from '@inertiajs/react';

interface ZakatData {
    id: number;
    jenis_zakat: string;
    nama_muzaki: string;
    jumlah: number;
    tanggal: string;
    status: 'collected' | 'distributed';
    keterangan?: string;
    created_at: string;
    updated_at: string;
}

export default function KelolaZakat() {
    const [zakatData, setZakatData] = useState<ZakatData[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingZakat, setEditingZakat] = useState<ZakatData | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, id: number | null}>({isOpen: false, id: null});
    
    const { alertState, showAlert, hideAlert } = useAlert();
    
    const [formData, setFormData] = useState({
        jenis_zakat: '',
        nama_muzaki: '',
        jumlah: '',
        tanggal: new Date().toISOString().split('T')[0],
        status: 'collected' as 'collected' | 'distributed',
        keterangan: ''
    });

    useEffect(() => {
        fetchZakatData();
    }, []);

    const fetchZakatData = async () => {
        setLoading(true);
        try {
            // Fetch zakat data from donations API where kategori = 'Zakat'
            const timestamp = new Date().getTime();
            const response = await fetch(`/api/laporan-infaq?kategori=Zakat&per_page=1000&_t=${timestamp}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                // Transform donation data to zakat format
                const transformedData = result.data.map((donation: any) => ({
                    id: donation.id,
                    jenis_zakat: donation.program || 'Zakat Umum',
                    nama_muzaki: donation.nama_donatur,
                    jumlah: parseFloat(donation.jumlah),
                    tanggal: donation.tanggal,
                    status: 'collected',
                    keterangan: donation.description || '',
                    created_at: donation.created_at,
                    updated_at: donation.updated_at
                }));
                setZakatData(transformedData);
            }
        } catch (error) {
            console.error('Error fetching zakat data:', error);
            showAlert('error', 'Error!', 'Gagal memuat data zakat');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const endpoint = editingZakat ? `/laporan-infaq/${editingZakat.id}` : '/laporan-infaq';
            const method = editingZakat ? 'PUT' : 'POST';
            
            // Transform zakat data to donation format
            const donationData = {
                nama_donatur: formData.nama_muzaki || 'Hamba Allah',
                email: 'zakat@masjid-alikhlash.com',
                phone: '',
                tanggal: formData.tanggal,
                kategori: 'Zakat',
                program: formData.jenis_zakat,
                jumlah: parseFloat(formData.jumlah),
                metode: 'Tunai',
                anonim: 0, // Send as integer instead of boolean
                description: formData.keterangan,
                _method: editingZakat ? 'PUT' : undefined
            };

            // Validate required fields
            if (!formData.jenis_zakat || !formData.jumlah || !formData.tanggal) {
                showAlert('error', 'Error!', 'Mohon lengkapi semua field yang wajib diisi');
                return;
            }

            const formDataToSend = new FormData();
            Object.entries(donationData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formDataToSend.append(key, value.toString());
                }
            });

            console.log('Sending zakat data:', donationData);
            console.log('Endpoint:', endpoint);

            // Get CSRF token from meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                showAlert('error', 'Error!', 'CSRF token tidak ditemukan. Silakan refresh halaman.');
                return;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('HTTP Error:', response.status, response.statusText);
                console.error('Response body:', errorText);
                
                if (response.status === 422) {
                    try {
                        const errorData = JSON.parse(errorText);
                        const validationErrors = errorData.errors ? Object.values(errorData.errors).flat() : [errorData.message];
                        throw new Error(`Validation Error: ${validationErrors.join(', ')}`);
                    } catch (parseError) {
                        throw new Error('Validation Error: Data tidak valid');
                    }
                } else if (response.status === 419) {
                    throw new Error('Session expired. Silakan refresh halaman dan coba lagi.');
                } else {
                    throw new Error(`Server Error (${response.status}): ${response.statusText}`);
                }
            }

            const result = await response.json();
            console.log('Server response:', result);
            
            if (result.success) {
                showAlert('success', 'Berhasil!', editingZakat ? 'Data zakat berhasil diperbarui!' : 'Data zakat berhasil ditambahkan!');
                resetForm();
                fetchZakatData();
            } else {
                console.error('Server response:', result);
                throw new Error(result.message || 'Gagal menyimpan data');
            }
        } catch (error) {
            console.error('Error saving zakat:', error);
            let errorMessage = 'Gagal menyimpan data zakat';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            showAlert('error', 'Error!', errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (zakat: ZakatData) => {
        setEditingZakat(zakat);
        setFormData({
            jenis_zakat: zakat.jenis_zakat,
            nama_muzaki: zakat.nama_muzaki,
            jumlah: zakat.jumlah.toString(),
            tanggal: zakat.tanggal,
            status: zakat.status,
            keterangan: zakat.keterangan || ''
        });
        setShowForm(true);
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        
        try {
            const response = await fetch(`/laporan-infaq/${deleteConfirm.id}`, {
                method: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const result = await response.json();
            
            if (result.success) {
                showAlert('success', 'Berhasil!', 'Data zakat berhasil dihapus!');
                fetchZakatData();
                setDeleteConfirm({isOpen: false, id: null});
            } else {
                throw new Error(result.message || 'Gagal menghapus data');
            }
        } catch (error) {
            console.error('Error deleting zakat:', error);
            showAlert('error', 'Error!', 'Gagal menghapus data zakat');
        }
    };

    const resetForm = () => {
        setFormData({
            jenis_zakat: '',
            nama_muzaki: '',
            jumlah: '',
            tanggal: new Date().toISOString().split('T')[0],
            status: 'collected',
            keterangan: ''
        });
        setEditingZakat(null);
        setShowForm(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const totalZakat = zakatData.reduce((sum, zakat) => sum + zakat.jumlah, 0);
    const totalMuzaki = new Set(zakatData.map(z => z.nama_muzaki)).size;

    if (loading) {
        return (
            <AdminLayout title="Kelola Zakat">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data zakat...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Kelola Zakat">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Zakat</h1>
                        <p className="text-gray-600">Manajemen pengumpulan dan penyaluran zakat</p>
                    </div>
                    <div className="flex space-x-3">
                        <Button 
                            onClick={() => setShowForm(true)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Data Zakat
                        </Button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Terkumpul</p>
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalZakat)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Muzaki</p>
                                    <p className="text-2xl font-bold text-gray-900">{totalMuzaki}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Zakat</p>
                                    <p className="text-2xl font-bold text-gray-900">{zakatData.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Zakat Data List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Data Zakat</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {zakatData.map((zakat) => (
                                <div key={zakat.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h4 className="font-semibold">{zakat.nama_muzaki}</h4>
                                                <p className="text-sm text-gray-600">{zakat.jenis_zakat}</p>
                                            </div>
                                            <Badge variant={zakat.status === 'collected' ? 'default' : 'secondary'}>
                                                {zakat.status === 'collected' ? 'Terkumpul' : 'Disalurkan'}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(zakat.tanggal).toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-green-600">{formatCurrency(zakat.jumlah)}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleEdit(zakat)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => setDeleteConfirm({isOpen: true, id: zakat.id})}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Add/Edit Dialog */}
                <Dialog open={showForm} onOpenChange={setShowForm}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>{editingZakat ? 'Edit Data Zakat' : 'Tambah Data Zakat'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="jenis_zakat">Jenis Zakat</Label>
                                <select 
                                    id="jenis_zakat"
                                    value={formData.jenis_zakat}
                                    onChange={(e) => setFormData({...formData, jenis_zakat: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                >
                                    <option value="">Pilih Jenis Zakat</option>
                                    <option value="Zakat Fitrah">Zakat Fitrah</option>
                                    <option value="Zakat Maal">Zakat Maal</option>
                                    <option value="Zakat Profesi">Zakat Profesi</option>
                                    <option value="Zakat Emas">Zakat Emas</option>
                                    <option value="Zakat Perak">Zakat Perak</option>
                                    <option value="Zakat Uang">Zakat Uang/Tabungan</option>
                                </select>
                            </div>
                            
                            <div>
                                <Label htmlFor="nama_muzaki">Nama Muzaki</Label>
                                <Input
                                    id="nama_muzaki"
                                    value={formData.nama_muzaki}
                                    onChange={(e) => setFormData({...formData, nama_muzaki: e.target.value})}
                                    placeholder="Nama muzaki (opsional)"
                                />
                            </div>

                            <div>
                                <Label htmlFor="jumlah">Jumlah Zakat</Label>
                                <Input
                                    id="jumlah"
                                    type="number"
                                    value={formData.jumlah}
                                    onChange={(e) => setFormData({...formData, jumlah: e.target.value})}
                                    placeholder="Jumlah dalam rupiah"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="tanggal">Tanggal</Label>
                                <Input
                                    id="tanggal"
                                    type="date"
                                    value={formData.tanggal}
                                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="status">Status</Label>
                                <select 
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setFormData({...formData, status: e.target.value as 'collected' | 'distributed'})}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                >
                                    <option value="collected">Terkumpul</option>
                                    <option value="distributed">Disalurkan</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="keterangan">Keterangan</Label>
                                <textarea
                                    id="keterangan"
                                    value={formData.keterangan}
                                    onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                                    placeholder="Keterangan tambahan"
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                    Batal
                                </Button>
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={submitting}>
                                    {submitting ? 'Menyimpan...' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <AlertModal
                    isOpen={deleteConfirm.isOpen}
                    onClose={() => setDeleteConfirm({isOpen: false, id: null})}
                    onConfirm={handleDelete}
                    type="warning"
                    title="Hapus Data Zakat"
                    message="Apakah Anda yakin ingin menghapus data zakat ini? Tindakan ini tidak dapat dibatalkan."
                    confirmText="Hapus"
                    cancelText="Batal"
                    showCancel={true}
                />
            </div>
        </AdminLayout>
    );
} 
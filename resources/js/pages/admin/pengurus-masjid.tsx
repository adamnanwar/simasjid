import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, User, Phone, Mail } from 'lucide-react';
import { useForm, router } from '@inertiajs/react';
import { AlertModal } from '@/components/ui/alert-modal';
import { useAlert } from '@/hooks/use-alert';

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

export default function AdminPengurusMasjid() {
    const [pengurus, setPengurus] = useState<PengurusMasjid[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [editingPengurus, setEditingPengurus] = useState<PengurusMasjid | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, id: number | null}>({isOpen: false, id: null});

    const { alertState, showAlert, hideAlert } = useAlert();

    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        jabatan: '',
        telepon: '',
        email: '',
        deskripsi: '',
        foto: null as File | null,
        urutan: 0,
    });

    useEffect(() => {
        fetchPengurus();
    }, []);

    const fetchPengurus = async () => {
        try {
            const response = await fetch('/api/pengurus-masjid');
            const result = await response.json();
            if (result.success) {
                setPengurus(result.data);
            }
        } catch (error) {
            console.error('Error fetching pengurus:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (pengurusData?: PengurusMasjid) => {
        if (pengurusData) {
            setEditingPengurus(pengurusData);
            setData({
                nama: pengurusData.nama,
                jabatan: pengurusData.jabatan,
                telepon: pengurusData.telepon || '',
                email: pengurusData.email || '',
                deskripsi: pengurusData.deskripsi || '',
                foto: null,
                urutan: pengurusData.urutan,
            });
        } else {
            setEditingPengurus(null);
            reset();
        }
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingPengurus(null);
        reset();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingPengurus) {
            // For update, we need to use router.post with _method: 'PUT' in the form data
            const formData = new FormData();
            formData.append('nama', data.nama);
            formData.append('jabatan', data.jabatan);
            formData.append('telepon', data.telepon || '');
            formData.append('email', data.email || '');
            formData.append('deskripsi', data.deskripsi || '');
            formData.append('urutan', data.urutan.toString());
            formData.append('_method', 'PUT');
            
            if (data.foto) {
                formData.append('foto', data.foto);
            }
            
            router.post(`/pengurus-masjid/${editingPengurus.id}`, formData, {
                onSuccess: () => {
                    handleCloseDialog();
                    fetchPengurus();
                }
            });
        } else {
            post('/pengurus-masjid', {
                forceFormData: true,
                onSuccess: () => {
                    handleCloseDialog();
                    fetchPengurus();
                }
            });
        }
    };

    const handleDeleteConfirm = (id: number) => {
        setDeleteConfirm({isOpen: true, id});
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        
        try {
            const response = await fetch(`/pengurus-masjid/${deleteConfirm.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                showAlert('success', 'Berhasil!', 'Pengurus berhasil dihapus!');
                await fetchPengurus();
            } else {
                const errorData = await response.json().catch(() => null);
                showAlert('error', 'Gagal!', errorData?.message || 'Gagal menghapus pengurus. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Error deleting pengurus:', error);
            showAlert('error', 'Error!', 'Terjadi kesalahan jaringan. Silakan coba lagi.');
        } finally {
            setDeleteConfirm({isOpen: false, id: null});
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
            <AdminLayout title="Kelola Pengurus Masjid">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data pengurus...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Kelola Pengurus Masjid">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-gray-600">Tambah, edit, atau hapus data pengurus masjid</p>
                </div>
                
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Pengurus
                        </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingPengurus ? 'Edit Pengurus' : 'Tambah Pengurus Baru'}
                            </DialogTitle>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nama">Nama Lengkap *</Label>
                                    <Input
                                        id="nama"
                                        value={data.nama}
                                        onChange={(e) => setData('nama', e.target.value)}
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                    {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="jabatan">Jabatan *</Label>
                                    <Input
                                        id="jabatan"
                                        value={data.jabatan}
                                        onChange={(e) => setData('jabatan', e.target.value)}
                                        placeholder="Contoh: Ketua, Sekretaris, Bendahara"
                                        required
                                    />
                                    {errors.jabatan && <p className="text-red-500 text-sm mt-1">{errors.jabatan}</p>}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="telepon">Nomor Telepon</Label>
                                    <Input
                                        id="telepon"
                                        value={data.telepon}
                                        onChange={(e) => setData('telepon', e.target.value)}
                                        placeholder="+62 812-3456-7890"
                                    />
                                    {errors.telepon && <p className="text-red-500 text-sm mt-1">{errors.telepon}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@contoh.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    placeholder="Deskripsi singkat tentang pengurus..."
                                    rows={3}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {errors.deskripsi && <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="foto">Foto Profil</Label>
                                    <Input
                                        id="foto"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('foto', e.target.files?.[0] || null)}
                                    />
                                    {errors.foto && <p className="text-red-500 text-sm mt-1">{errors.foto}</p>}
                                    <p className="text-sm text-gray-500 mt-1">Format: JPG, PNG. Max: 2MB</p>
                                </div>
                                
                                <div>
                                    <Label htmlFor="urutan">Urutan Tampil</Label>
                                    <Input
                                        id="urutan"
                                        type="number"
                                        value={data.urutan}
                                        onChange={(e) => setData('urutan', parseInt(e.target.value) || 0)}
                                        placeholder="1"
                                        min="0"
                                    />
                                    {errors.urutan && <p className="text-red-500 text-sm mt-1">{errors.urutan}</p>}
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    {processing ? 'Menyimpan...' : editingPengurus ? 'Perbarui' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Pengurus Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pengurus.map((person) => (
                    <Card key={person.id} className="group hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    {person.foto_url ? (
                                        <img
                                            src={person.foto_url}
                                            alt={person.nama}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                                            {getInitials(person.nama)}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{person.nama}</h3>
                                        <Badge variant="secondary" className="text-xs">
                                            {person.jabatan}
                                        </Badge>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    #{person.urutan}
                                </Badge>
                            </div>
                            
                            {person.deskripsi && (
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {person.deskripsi}
                                </p>
                            )}
                            
                            <div className="space-y-2 mb-4">
                                {person.telepon && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="w-3 h-3 mr-2" />
                                        {person.telepon}
                                    </div>
                                )}
                                {person.email && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="w-3 h-3 mr-2" />
                                        {person.email}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleOpenDialog(person)}
                                    className="flex-1"
                                >
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteConfirm(person.id)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {pengurus.length === 0 && (
                <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data Pengurus</h3>
                    <p className="text-gray-600 mb-4">Mulai dengan menambahkan pengurus masjid pertama</p>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Pengurus
                    </Button>
                </div>
            )}

            {/* Alert Modal */}
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={hideAlert}
                type={alertState.type}
                title={alertState.title}
                message={alertState.message}
            />

            {/* Delete Confirmation Modal */}
            <AlertModal
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({isOpen: false, id: null})}
                type="warning"
                title="Konfirmasi Hapus"
                message="Apakah Anda yakin ingin menghapus data pengurus ini? Tindakan ini tidak dapat dibatalkan."
                confirmText="Hapus"
                cancelText="Batal"
                showCancel={true}
                onConfirm={handleDelete}
            />
        </AdminLayout>
    );
} 
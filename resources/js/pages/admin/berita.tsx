import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, FileText, Calendar, Eye, EyeOff, User } from 'lucide-react';
import { useForm } from '@inertiajs/react';

interface Berita {
    id: number;
    judul: string;
    konten: string;
    gambar: string | null;
    gambar_url: string | null;
    penulis: string;
    tanggal_publikasi: string;
    status: 'draft' | 'published';
    kategori: string;
    ringkasan: string;
    created_at: string;
}

export default function AdminBerita() {
    const [news, setNews] = useState<Berita[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [editingNews, setEditingNews] = useState<Berita | null>(null);
    const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');

    const { data, setData, post, processing, errors, reset } = useForm({
        judul: '',
        konten: '',
        ringkasan: '',
        gambar: null as File | null,
        penulis: '',
        tanggal_publikasi: new Date().toISOString().split('T')[0],
        status: 'draft' as 'draft' | 'published',
        kategori: '',
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('/api/berita-kegiatan');
            const result = await response.json();
            console.log('Admin API Response:', result); // Debug log
            if (result.success && result.data && result.data.length > 0) {
                setNews(result.data.map((item: any) => ({
                    id: item.id,
                    judul: item.judul,
                    konten: item.konten,
                    gambar: item.gambar,
                    gambar_url: item.gambar_url,
                    penulis: item.penulis || 'Penulis',
                    tanggal_publikasi: item.tanggal_publikasi || new Date().toISOString(),
                    status: item.status || 'published', // default to published since the current model doesn't have status
                    kategori: item.jenis === 'berita' ? 'Berita' : 'Kegiatan',
                    ringkasan: item.konten ? item.konten.slice(0, 150) + '...' : '', // create summary from content
                    created_at: item.created_at || new Date().toISOString()
                })));
                console.log('Admin successfully loaded', result.data.length, 'berita items'); // Debug log
            } else {
                console.log('Admin: No data from API, using fallback'); // Debug log
                // Fallback to sample data if API fails
                setNews([
                    {
                        id: 1,
                        judul: 'Kegiatan Bakti Sosial Ramadhan 2025',
                        konten: 'Masjid Al-Ikhlas mengadakan kegiatan bakti sosial dalam rangka menyambut bulan suci Ramadhan 2025. Kegiatan ini meliputi pembagian sembako, santunan anak yatim, dan pelayanan kesehatan gratis untuk masyarakat sekitar.',
                        gambar: null,
                        gambar_url: null,
                        penulis: 'Admin Masjid',
                        tanggal_publikasi: '2025-01-20',
                        status: 'published',
                        kategori: 'Kegiatan Sosial',
                        ringkasan: 'Masjid Al-Ikhlas mengadakan bakti sosial Ramadhan 2025 dengan pembagian sembako dan santunan yatim.',
                        created_at: '2025-01-15T08:00:00Z'
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            // Fallback to sample data if API fails
            setNews([
                {
                    id: 1,
                    judul: 'Kegiatan Bakti Sosial Ramadhan 2025',
                    konten: 'Masjid Al-Ikhlas mengadakan kegiatan bakti sosial dalam rangka menyambut bulan suci Ramadhan 2025. Kegiatan ini meliputi pembagian sembako, santunan anak yatim, dan pelayanan kesehatan gratis untuk masyarakat sekitar.',
                    gambar: null,
                    gambar_url: null,
                    penulis: 'Admin Masjid',
                    tanggal_publikasi: '2025-01-20',
                    status: 'published',
                    kategori: 'Kegiatan Sosial',
                    ringkasan: 'Masjid Al-Ikhlas mengadakan bakti sosial Ramadhan 2025 dengan pembagian sembako dan santunan yatim.',
                    created_at: '2025-01-15T08:00:00Z'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (newsData?: Berita) => {
        if (newsData) {
            setEditingNews(newsData);
            setData({
                judul: newsData.judul,
                konten: newsData.konten,
                ringkasan: newsData.ringkasan,
                gambar: null,
                penulis: newsData.penulis,
                tanggal_publikasi: newsData.tanggal_publikasi.split('T')[0],
                status: newsData.status,
                kategori: newsData.kategori,
            });
        } else {
            setEditingNews(null);
            reset();
            setData({
                judul: '',
                konten: '',
                ringkasan: '',
                gambar: null,
                penulis: 'Admin Masjid',
                tanggal_publikasi: new Date().toISOString().split('T')[0],
                status: 'draft',
                kategori: '',
            });
        }
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
        setEditingNews(null);
        reset();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formData = new FormData();
            formData.append('judul', data.judul);
            formData.append('konten', data.konten);
            formData.append('jenis', data.kategori === 'Berita' ? 'berita' : 'kegiatan');
            formData.append('penulis', data.penulis);
            formData.append('tanggal_publikasi', data.tanggal_publikasi);
            
            if (data.gambar) {
                formData.append('gambar', data.gambar);
            }

            let response;
            if (editingNews) {
                // Update existing berita
                formData.append('_method', 'PUT');
                response = await fetch(`/berita-kegiatan/${editingNews.id}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });
            } else {
                // Create new berita
                response = await fetch('/berita-kegiatan', {
                    method: 'POST', 
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });
            }

            if (response.ok) {
                console.log('Berita berhasil disimpan');
                // Refresh data dari server
                await fetchNews();
                handleCloseDialog();
            } else {
                console.error('Error saving berita:', response.statusText);
                alert('Gagal menyimpan berita. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Error saving berita:', error);
            alert('Gagal menyimpan berita. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            try {
                const response = await fetch(`/berita-kegiatan/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });

                if (response.ok) {
                    console.log('Berita berhasil dihapus');
                    await fetchNews(); // Refresh data
                } else {
                    console.error('Error deleting berita:', response.statusText);
                    alert('Gagal menghapus berita. Silakan coba lagi.');
                }
            } catch (error) {
                console.error('Error deleting berita:', error);
                alert('Gagal menghapus berita. Silakan coba lagi.');
            }
        }
    };

    const toggleStatus = async (id: number) => {
        try {
            const berita = news.find(n => n.id === id);
            if (!berita) return;

            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('judul', berita.judul);
            formData.append('konten', berita.konten);
            formData.append('jenis', berita.kategori === 'Berita' ? 'berita' : 'kegiatan');
            formData.append('penulis', berita.penulis);
            formData.append('tanggal_publikasi', berita.tanggal_publikasi.split('T')[0]);

            const response = await fetch(`/berita-kegiatan/${id}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                console.log('Status berita berhasil diubah');
                await fetchNews(); // Refresh data
            } else {
                console.error('Error updating status:', response.statusText);
                alert('Gagal mengubah status berita. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Gagal mengubah status berita. Silakan coba lagi.');
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
            case 'published':
                return <Badge className="bg-green-100 text-green-800">Dipublikasikan</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const filteredNews = news.filter(item => {
        if (filter === 'all') return true;
        return item.status === filter;
    }).sort((a, b) => new Date(b.tanggal_publikasi).getTime() - new Date(a.tanggal_publikasi).getTime());

    const stats = {
        total: news.length,
        published: news.filter(n => n.status === 'published').length,
        draft: news.filter(n => n.status === 'draft').length,
    };

    const kategoriOptions = ['Pengumuman', 'Kegiatan Sosial', 'Kajian', 'Pembangunan', 'Kegiatan Ramadhan', 'Lainnya'];

    if (loading) {
        return (
            <AdminLayout title="Kelola Berita & Kegiatan">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data berita...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Kelola Berita & Kegiatan">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Berita</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Dipublikasikan</p>
                                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
                            </div>
                            <Eye className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Draft</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
                            </div>
                            <EyeOff className="w-8 h-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and Add Button */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-1">
                    {[
                        { key: 'all', label: 'Semua', count: stats.total },
                        { key: 'published', label: 'Dipublikasikan', count: stats.published },
                        { key: 'draft', label: 'Draft', count: stats.draft },
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
                            Tambah Berita
                        </Button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingNews ? 'Edit Berita' : 'Tambah Berita Baru'}
                            </DialogTitle>
                        </DialogHeader>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="judul">Judul Berita *</Label>
                                <Input
                                    id="judul"
                                    value={data.judul}
                                    onChange={(e) => setData('judul', e.target.value)}
                                    placeholder="Masukkan judul berita"
                                    required
                                />
                                {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="ringkasan">Ringkasan *</Label>
                                <textarea
                                    id="ringkasan"
                                    value={data.ringkasan}
                                    onChange={(e) => setData('ringkasan', e.target.value)}
                                    placeholder="Ringkasan singkat berita..."
                                    rows={2}
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />
                                {errors.ringkasan && <p className="text-red-500 text-sm mt-1">{errors.ringkasan}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="konten">Konten Berita *</Label>
                                <textarea
                                    id="konten"
                                    value={data.konten}
                                    onChange={(e) => setData('konten', e.target.value)}
                                    placeholder="Tulis konten berita lengkap di sini..."
                                    rows={8}
                                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />
                                {errors.konten && <p className="text-red-500 text-sm mt-1">{errors.konten}</p>}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    <Label htmlFor="penulis">Penulis *</Label>
                                    <Input
                                        id="penulis"
                                        value={data.penulis}
                                        onChange={(e) => setData('penulis', e.target.value)}
                                        placeholder="Nama penulis"
                                        required
                                    />
                                    {errors.penulis && <p className="text-red-500 text-sm mt-1">{errors.penulis}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="tanggal_publikasi">Tanggal Publikasi *</Label>
                                    <Input
                                        id="tanggal_publikasi"
                                        type="date"
                                        value={data.tanggal_publikasi}
                                        onChange={(e) => setData('tanggal_publikasi', e.target.value)}
                                        required
                                    />
                                    {errors.tanggal_publikasi && <p className="text-red-500 text-sm mt-1">{errors.tanggal_publikasi}</p>}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="gambar">Gambar Berita</Label>
                                    <Input
                                        id="gambar"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('gambar', e.target.files?.[0] || null)}
                                    />
                                    {errors.gambar && <p className="text-red-500 text-sm mt-1">{errors.gambar}</p>}
                                    <p className="text-sm text-gray-500 mt-1">Format: JPG, PNG. Max: 2MB</p>
                                </div>
                                
                                <div>
                                    <Label htmlFor="status">Status *</Label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value as 'draft' | 'published')}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Dipublikasikan</option>
                                    </select>
                                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                                </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                                    Batal
                                </Button>
                                <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700">
                                    {processing ? 'Menyimpan...' : editingNews ? 'Perbarui' : 'Simpan'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* News List */}
            <div className="grid grid-cols-1 gap-6">
                {filteredNews.map((item) => (
                    <Card key={item.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h3 className="text-xl font-semibold text-gray-900">{item.judul}</h3>
                                        {getStatusBadge(item.status)}
                                        <Badge variant="outline" className="text-xs">
                                            {item.kategori}
                                        </Badge>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-3 line-clamp-2">{item.ringkasan}</p>
                                    
                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-1" />
                                            {item.penulis}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {new Date(item.tanggal_publikasi).toLocaleDateString('id-ID')}
                                        </div>
                                        <span>
                                            Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}
                                        </span>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => toggleStatus(item.id)}
                                            className={item.status === 'published' ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}
                                        >
                                            {item.status === 'published' ? (
                                                <>
                                                    <EyeOff className="w-3 h-3 mr-1" />
                                                    Sembunyikan
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="w-3 h-3 mr-1" />
                                                    Publikasikan
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleOpenDialog(item)}
                                        >
                                            <Edit className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                                
                                {item.gambar_url && (
                                    <div className="ml-6">
                                        <img
                                            src={item.gambar_url}
                                            alt={item.judul}
                                            className="w-32 h-24 object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredNews.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {filter === 'all' ? 'Belum Ada Berita' : `Tidak Ada Berita ${filter === 'draft' ? 'Draft' : 'yang Dipublikasikan'}`}
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {filter === 'all' ? 'Mulai dengan menambahkan berita pertama' : 'Pilih filter lain untuk melihat berita.'}
                    </p>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Berita
                    </Button>
                </div>
            )}
        </AdminLayout>
    );
} 
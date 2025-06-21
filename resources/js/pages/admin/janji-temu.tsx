import React, { useState, useEffect } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertModal } from '@/components/ui/alert-modal';
import { Calendar, Clock, User, Phone, Mail, Check, X, Filter, Search, Plus, Edit, Trash2, Settings } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useAlert } from '@/hooks/use-alert';

interface JanjiTemu {
    id: number;
    nama: string;
    email: string;
    telepon: string;
    tanggal: string;
    waktu: string;
    keperluan: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

interface Ustadz {
    id: number;
    name: string;
    specialization: string;
    experience: string;
    schedule: string; // For backward compatibility display
    schedule_days: string[];
    schedule_start_time: string;
    schedule_end_time: string;
    phone?: string;
    email?: string;
    bio?: string;
    active: boolean;
}

export default function AdminJanjiTemu() {
    const [appointments, setAppointments] = useState<JanjiTemu[]>([]);
    const [ustadzList, setUstadzList] = useState<Ustadz[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showUstadzForm, setShowUstadzForm] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<JanjiTemu | null>(null);
    const [editingUstadz, setEditingUstadz] = useState<Ustadz | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, id: number | null, type: 'appointment' | 'ustadz'}>({isOpen: false, id: null, type: 'appointment'});

    const { alertState, showAlert, hideAlert } = useAlert();

    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        telepon: '',
        tanggal: '',
        waktu: '',
        keperluan: '',
        status: 'pending' as 'pending' | 'approved' | 'rejected'
    });

    const [ustadzFormData, setUstadzFormData] = useState({
        name: '',
        specialization: '',
        experience: '',
        schedule_days: [] as string[],
        schedule_start_time: '08:00',
        schedule_end_time: '17:00',
        phone: '',
        email: '',
        bio: '',
        active: true
    });

    useEffect(() => {
        fetchAppointments();
        fetchUstadz();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch('/api/janji-temu');
            const result = await response.json();
            if (result.success) {
                setAppointments(result.data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUstadz = async () => {
        try {
            // Add cache busting parameter
            const timestamp = new Date().getTime();
            const response = await fetch(`/api/ustadz?_t=${timestamp}`);
            const result = await response.json();
            if (result.success) {
                setUstadzList(result.data);
            }
        } catch (error) {
            console.error('Error fetching ustadz:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingAppointment) {
                // Update existing
                router.put(`/janji-temu/${editingAppointment.id}`, formData, {
                    onSuccess: () => {
                        showAlert('success', 'Berhasil!', 'Janji temu berhasil diperbarui!');
                        setShowEditForm(false);
                        setEditingAppointment(null);
                        resetForm();
                        fetchAppointments();
                    },
                    onError: (errors) => {
                        console.error('Validation errors:', errors);
                        showAlert('error', 'Terjadi Kesalahan', 'Terjadi kesalahan. Silakan periksa data Anda.');
                    },
                    onFinish: () => {
                        setSubmitting(false);
                    }
                });
            } else {
                // Create new
                router.post('/janji-temu', formData, {
                    onSuccess: () => {
                        showAlert('success', 'Berhasil!', 'Janji temu berhasil ditambahkan!');
                        setShowAddForm(false);
                        resetForm();
                        fetchAppointments();
                    },
                    onError: (errors) => {
                        console.error('Validation errors:', errors);
                        showAlert('error', 'Terjadi Kesalahan', 'Terjadi kesalahan. Silakan periksa data Anda.');
                    },
                    onFinish: () => {
                        setSubmitting(false);
                    }
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            showAlert('error', 'Terjadi Kesalahan', 'Terjadi kesalahan saat mengirim data');
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nama: '',
            email: '',
            telepon: '',
            tanggal: '',
            waktu: '',
            keperluan: '',
            status: 'pending'
        });
    };

    const handleEdit = (appointment: JanjiTemu) => {
        setEditingAppointment(appointment);
        setFormData({
            nama: appointment.nama,
            email: appointment.email,
            telepon: appointment.telepon,
            tanggal: appointment.tanggal,
            waktu: appointment.waktu,
            keperluan: appointment.keperluan,
            status: appointment.status
        });
        setShowEditForm(true);
    };

    const updateStatus = async (id: number, status: 'approved' | 'rejected') => {
        try {
            const response = await fetch(`/janji-temu/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ status })
            });
            
            if (response.ok) {
                fetchAppointments();
                showAlert('success', 'Berhasil!', `Janji temu berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDeleteConfirm = (id: number, type: 'appointment' | 'ustadz') => {
        setDeleteConfirm({isOpen: true, id, type});
    };

    const handleDelete = async () => {
        if (!deleteConfirm.id) return;
        
        try {
            const url = deleteConfirm.type === 'appointment' 
                ? `/janji-temu/${deleteConfirm.id}` 
                : `/api/ustadz/${deleteConfirm.id}`;

            const formData = new FormData();
            formData.append('_method', 'DELETE');
                
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: formData
            });

            if (response.ok) {
                const message = deleteConfirm.type === 'appointment' 
                    ? 'Janji temu berhasil dihapus!' 
                    : 'Ustadz berhasil dihapus!';
                showAlert('success', 'Berhasil!', message);
                
                if (deleteConfirm.type === 'appointment') {
                    await fetchAppointments();
                } else {
                    await fetchUstadz();
                }
            } else {
                const errorData = await response.json().catch(() => null);
                showAlert('error', 'Gagal!', errorData?.message || 'Gagal menghapus data. Silakan coba lagi.');
            }
        } catch (error) {
            console.error('Error deleting:', error);
            showAlert('error', 'Error!', 'Terjadi kesalahan jaringan. Silakan coba lagi.');
        } finally {
            setDeleteConfirm({isOpen: false, id: null, type: 'appointment'});
        }
    };

    const handleUstadzSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', ustadzFormData.name);
            formData.append('specialization', ustadzFormData.specialization);
            formData.append('experience', ustadzFormData.experience);
            
            // Append schedule_days as individual array items
            ustadzFormData.schedule_days.forEach((day, index) => {
                formData.append(`schedule_days[${index}]`, day);
            });
            
            formData.append('schedule_start_time', ustadzFormData.schedule_start_time);
            formData.append('schedule_end_time', ustadzFormData.schedule_end_time);
            formData.append('phone', ustadzFormData.phone);
            formData.append('email', ustadzFormData.email);
            formData.append('bio', ustadzFormData.bio);
            formData.append('active', ustadzFormData.active ? '1' : '0');

            if (editingUstadz) {
                formData.append('_method', 'PUT');
            }

            const url = editingUstadz ? `/api/ustadz/${editingUstadz.id}` : '/api/ustadz';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json',
                },
                body: formData
            });

            if (response.ok) {
                const message = editingUstadz ? 'Ustadz berhasil diperbarui!' : 'Ustadz berhasil ditambahkan!';
                showAlert('success', 'Berhasil!', message);
                resetUstadzForm();
                setShowUstadzForm(false);
                await fetchUstadz();
            } else {
                const errorData = await response.json().catch(() => null);
                showAlert('error', 'Gagal!', errorData?.message || 'Gagal menyimpan data ustadz.');
            }
        } catch (error) {
            console.error('Error submitting ustadz:', error);
            showAlert('error', 'Error!', 'Terjadi kesalahan jaringan.');
        } finally {
            setSubmitting(false);
        }
    };

    const resetUstadzForm = () => {
        setUstadzFormData({
            name: '',
            specialization: '',
            experience: '',
            schedule_days: [],
            schedule_start_time: '08:00',
            schedule_end_time: '17:00',
            phone: '',
            email: '',
            bio: '',
            active: true
        });
        setEditingUstadz(null);
    };

    const handleEditUstadz = (ustadz: Ustadz) => {
        setEditingUstadz(ustadz);
        
        // Use structured data if available, otherwise parse from schedule string
        let days: string[] = ustadz.schedule_days || [];
        let startTime = ustadz.schedule_start_time || '08:00';
        let endTime = ustadz.schedule_end_time || '17:00';
        
        // Fallback: parse from schedule string if structured data not available
        if (days.length === 0 && ustadz.schedule) {
            const scheduleMatch = ustadz.schedule.match(/^(.+):\s*(\d{2}:\d{2})-(\d{2}:\d{2})$/);
            if (scheduleMatch) {
                days = scheduleMatch[1].split(',').map(day => day.trim());
                startTime = scheduleMatch[2];
                endTime = scheduleMatch[3];
            }
        }

        setUstadzFormData({
            name: ustadz.name,
            specialization: ustadz.specialization,
            experience: ustadz.experience,
            schedule_days: days,
            schedule_start_time: startTime,
            schedule_end_time: endTime,
            phone: ustadz.phone || '',
            email: ustadz.email || '',
            bio: ustadz.bio || '',
            active: ustadz.active
        });
        setShowUstadzForm(true);
    };

    const handleScheduleDayToggle = (day: string) => {
        setUstadzFormData(prev => ({
            ...prev,
            schedule_days: prev.schedule_days.includes(day)
                ? prev.schedule_days.filter(d => d !== day)
                : [...prev.schedule_days, day]
        }));
    };

    const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Menunggu</Badge>;
            case 'approved':
                return <Badge className="bg-green-100 text-green-800">Disetujui</Badge>;
            case 'rejected':
                return <Badge className="bg-red-100 text-red-800">Ditolak</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const filteredAppointments = appointments.filter(appointment => {
        if (filter === 'all') return true;
        return appointment.status === filter;
    });

    const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        approved: appointments.filter(a => a.status === 'approved').length,
        rejected: appointments.filter(a => a.status === 'rejected').length,
    };

    if (loading) {
        return (
            <AdminLayout title="Kelola Janji Temu">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat data janji temu...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Kelola Janji Temu">
            {/* Action Buttons */}
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Kelola Janji Temu</h2>
                <div className="flex gap-3">
                    <Button
                        onClick={() => setShowUstadzForm(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Settings className="w-4 h-4 mr-2" />
                        Kelola Jadwal
                    </Button>
                    {/* Comment: Tombol Tambah Janji Temu disembunyikan sesuai permintaan
                    <Button
                        onClick={() => setShowAddForm(true)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Janji Temu
                    </Button>
                    */}
                </div>
            </div>

            {/* Add/Edit Form Modal */}
            {(showAddForm || showEditForm) && (
                <Card className="mb-8 shadow-lg border-2 border-emerald-200">
                    <CardHeader className="bg-emerald-50">
                        <CardTitle className="flex items-center gap-2 text-emerald-800">
                            {editingAppointment ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                            {editingAppointment ? 'Edit Janji Temu' : 'Tambah Janji Temu Baru'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nama">Nama Lengkap *</Label>
                                    <Input
                                        id="nama"
                                        value={formData.nama}
                                        onChange={(e) => setFormData({...formData, nama: e.target.value})}
                                        placeholder="Masukkan nama lengkap"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="telepon">Nomor Telepon *</Label>
                                    <Input
                                        id="telepon"
                                        value={formData.telepon}
                                        onChange={(e) => setFormData({...formData, telepon: e.target.value})}
                                        placeholder="08xx-xxxx-xxxx"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="email@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="status">Status *</Label>
                                    <select
                                        id="status"
                                        value={formData.status}
                                        onChange={(e) => setFormData({...formData, status: e.target.value as 'pending' | 'approved' | 'rejected'})}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        <option value="pending">Menunggu</option>
                                        <option value="approved">Disetujui</option>
                                        <option value="rejected">Ditolak</option>
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="tanggal">Tanggal *</Label>
                                    <Input
                                        id="tanggal"
                                        type="date"
                                        value={formData.tanggal}
                                        onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="waktu">Waktu *</Label>
                                    <Input
                                        id="waktu"
                                        type="time"
                                        value={formData.waktu}
                                        onChange={(e) => setFormData({...formData, waktu: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="keperluan">Keperluan *</Label>
                                <textarea
                                    id="keperluan"
                                    value={formData.keperluan}
                                    onChange={(e) => setFormData({...formData, keperluan: e.target.value})}
                                    placeholder="Jelaskan keperluan janji temu"
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={submitting}>
                                    {editingAppointment ? 'Update' : 'Tambah'} Janji Temu
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => {
                                        setShowAddForm(false);
                                        setShowEditForm(false);
                                        setEditingAppointment(null);
                                        resetForm();
                                    }}
                                    disabled={submitting}
                                >
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Ustadz Management Modal */}
            {showUstadzForm && (
                <Card className="mb-8 shadow-lg border-2 border-blue-200">
                    <CardHeader className="bg-blue-50">
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                            <Settings className="h-5 w-5" />
                            Kelola Jadwal Ustadz
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {/* Ustadz List */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Daftar Ustadz</h3>
                                <Button
                                    onClick={() => {
                                        console.log('Adding new ustadz'); // Debug log
                                        setEditingUstadz(null);
                                        resetUstadzForm();
                                        // Scroll to form
                                        setTimeout(() => {
                                            const formElement = document.getElementById('ustadz-form');
                                            if (formElement) {
                                                formElement.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }, 100);
                                    }}
                                    className="bg-green-600 hover:bg-green-700"
                                    size="sm"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Ustadz
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ustadzList.map((ustadz) => (
                                    <Card key={ustadz.id} className="border">
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{ustadz.name}</h4>
                                                    <Badge className={ustadz.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                        {ustadz.active ? 'Aktif' : 'Tidak Aktif'}
                                                    </Badge>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleEditUstadz(ustadz)}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeleteConfirm(ustadz.id, 'ustadz')}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600 hover:bg-red-50"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <p><span className="font-medium">Spesialisasi:</span> {ustadz.specialization}</p>
                                                <p><span className="font-medium">Pengalaman:</span> {ustadz.experience}</p>
                                                <p><span className="font-medium">Jadwal:</span> {ustadz.schedule}</p>
                                                {ustadz.phone && <p><span className="font-medium">Telepon:</span> {ustadz.phone}</p>}
                                                {ustadz.email && <p><span className="font-medium">Email:</span> {ustadz.email}</p>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Ustadz Form */}
                        <form onSubmit={handleUstadzSubmit} className="space-y-6 border-t pt-6" id="ustadz-form">
                            <div className={`p-4 rounded-lg ${editingUstadz ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}>
                                <h3 className="text-lg font-semibold">
                                    {editingUstadz ? `🔧 Edit Ustadz: ${editingUstadz.name}` : '➕ Tambah Ustadz Baru'}
                                </h3>
                                {editingUstadz && (
                                    <p className="text-sm text-blue-600 mt-1">
                                        Form telah diisi dengan data ustadz yang dipilih
                                    </p>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="ustadz-name">Nama Ustadz *</Label>
                                    <Input
                                        id="ustadz-name"
                                        value={ustadzFormData.name}
                                        onChange={(e) => setUstadzFormData({...ustadzFormData, name: e.target.value})}
                                        placeholder="Masukkan nama ustadz"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ustadz-specialization">Spesialisasi *</Label>
                                    <Input
                                        id="ustadz-specialization"
                                        value={ustadzFormData.specialization}
                                        onChange={(e) => setUstadzFormData({...ustadzFormData, specialization: e.target.value})}
                                        placeholder="Contoh: Fiqh, Akidah, Konsultasi Keluarga"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ustadz-experience">Pengalaman *</Label>
                                    <Input
                                        id="ustadz-experience"
                                        value={ustadzFormData.experience}
                                        onChange={(e) => setUstadzFormData({...ustadzFormData, experience: e.target.value})}
                                        placeholder="Contoh: 15 tahun"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ustadz-schedule">Jadwal Ketersediaan *</Label>
                                    
                                    {/* Days Selection */}
                                    <div className="space-y-3">
                                        <div>
                                            <Label className="text-sm font-medium">Hari Kerja:</Label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {daysOfWeek.map((day) => (
                                                    <button
                                                        key={day}
                                                        type="button"
                                                        onClick={() => handleScheduleDayToggle(day)}
                                                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                                                            ustadzFormData.schedule_days.includes(day)
                                                                ? 'bg-emerald-600 text-white border-emerald-600'
                                                                : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                                                        }`}
                                                    >
                                                        {day}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Time Range */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="schedule-start">Jam Mulai:</Label>
                                                <Input
                                                    id="schedule-start"
                                                    type="time"
                                                    value={ustadzFormData.schedule_start_time}
                                                    onChange={(e) => setUstadzFormData({...ustadzFormData, schedule_start_time: e.target.value})}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="schedule-end">Jam Selesai:</Label>
                                                <Input
                                                    id="schedule-end"
                                                    type="time"
                                                    value={ustadzFormData.schedule_end_time}
                                                    onChange={(e) => setUstadzFormData({...ustadzFormData, schedule_end_time: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Schedule Preview */}
                                        {ustadzFormData.schedule_days.length > 0 && (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <Label className="text-sm font-medium text-gray-700">Preview Jadwal:</Label>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {ustadzFormData.schedule_days.join(', ')}: {ustadzFormData.schedule_start_time}-{ustadzFormData.schedule_end_time}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="ustadz-phone">Nomor Telepon</Label>
                                    <Input
                                        id="ustadz-phone"
                                        value={ustadzFormData.phone}
                                        onChange={(e) => setUstadzFormData({...ustadzFormData, phone: e.target.value})}
                                        placeholder="08xx-xxxx-xxxx"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="ustadz-email">Email</Label>
                                    <Input
                                        id="ustadz-email"
                                        type="email"
                                        value={ustadzFormData.email}
                                        onChange={(e) => setUstadzFormData({...ustadzFormData, email: e.target.value})}
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="ustadz-bio">Bio/Deskripsi</Label>
                                <textarea
                                    id="ustadz-bio"
                                    value={ustadzFormData.bio}
                                    onChange={(e) => setUstadzFormData({...ustadzFormData, bio: e.target.value})}
                                    placeholder="Deskripsi singkat tentang ustadz"
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="ustadz-active"
                                    checked={ustadzFormData.active}
                                    onChange={(e) => setUstadzFormData({...ustadzFormData, active: e.target.checked})}
                                    className="rounded"
                                />
                                <Label htmlFor="ustadz-active">Ustadz Aktif</Label>
                            </div>
                            
                            <div className="flex gap-3">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                                    {editingUstadz ? 'Update' : 'Tambah'} Ustadz
                                </Button>
                                {editingUstadz && (
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => {
                                            setEditingUstadz(null);
                                            resetUstadzForm();
                                        }}
                                        disabled={submitting}
                                        className="border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                                    >
                                        Reset Form
                                    </Button>
                                )}
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={() => {
                                        setShowUstadzForm(false);
                                        setEditingUstadz(null);
                                        resetUstadzForm();
                                    }}
                                    disabled={submitting}
                                >
                                    Tutup
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Janji Temu</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Calendar className="w-8 h-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Disetujui</p>
                                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                            </div>
                            <Check className="w-8 h-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Ditolak</p>
                                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                            </div>
                            <X className="w-8 h-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 mb-6">
                {[
                    { key: 'all', label: 'Semua', count: stats.total },
                    { key: 'pending', label: 'Menunggu', count: stats.pending },
                    { key: 'approved', label: 'Disetujui', count: stats.approved },
                    { key: 'rejected', label: 'Ditolak', count: stats.rejected },
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

            {/* Appointments List */}
            <div className="grid grid-cols-1 gap-6">
                {filteredAppointments.map((appointment) => (
                    <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {appointment.nama ? appointment.nama.charAt(0).toUpperCase() : 'U'}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{appointment.nama}</h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Mail className="w-4 h-4 mr-1" />
                                                    {appointment.email}
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="w-4 h-4 mr-1" />
                                                    {appointment.telepon}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>Tanggal: {new Date(appointment.tanggal).toLocaleDateString('id-ID')}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span>Waktu: {appointment.waktu}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-1">Keperluan:</p>
                                        <p className="text-sm text-gray-600">{appointment.keperluan}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {getStatusBadge(appointment.status)}
                                            <span className="text-xs text-gray-500">
                                                Dibuat: {new Date(appointment.created_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>

                                        <div className="flex space-x-2 flex-wrap">
                                            {appointment.status === 'pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => updateStatus(appointment.id, 'approved')}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Setujui
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateStatus(appointment.id, 'rejected')}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <X className="w-3 h-3 mr-1" />
                                                        Tolak
                                                    </Button>
                                                </>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(appointment)}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <Edit className="w-3 h-3 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDeleteConfirm(appointment.id, 'appointment')}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-3 h-3 mr-1" />
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {filteredAppointments.length === 0 && (
                <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {filter === 'all' ? 'Belum Ada Janji Temu' : `Tidak Ada Janji Temu ${filter === 'pending' ? 'yang Menunggu' : filter === 'approved' ? 'yang Disetujui' : 'yang Ditolak'}`}
                    </h3>
                    <p className="text-gray-600">
                        {filter === 'all' ? 'Janji temu dari jamaah akan ditampilkan di sini.' : 'Pilih filter lain untuk melihat janji temu.'}
                    </p>
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
                onClose={() => setDeleteConfirm({isOpen: false, id: null, type: 'appointment'})}
                type="warning"
                title="Konfirmasi Hapus"
                message={`Apakah Anda yakin ingin menghapus ${deleteConfirm.type === 'appointment' ? 'janji temu' : 'data ustadz'} ini? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Hapus"
                cancelText="Batal"
                showCancel={true}
                onConfirm={handleDelete}
            />
        </AdminLayout>
    );
} 
import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertModal } from '@/components/ui/alert-modal';
import { useAlert } from '@/hooks/use-alert';
import { 
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    Plus,
    CheckCircle,
    XCircle,
    AlertCircle,
    MapPin,
    BookOpen
} from 'lucide-react';

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
    schedule_days?: string[];
    schedule_start_time?: string;
    schedule_end_time?: string;
    phone?: string;
    email?: string;
    bio?: string;
    active: boolean;
}

interface JanjiTemuPageProps {
    janjiTemu?: {
        data: JanjiTemu[];
        meta?: any;
    };
    ustadz: Ustadz[];
}

interface TimeSlot {
    time: string;
    available: boolean;
    ustadz: string;
}

export default function JanjiTemu({ janjiTemu: initialData, ustadz }: JanjiTemuPageProps) {
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedUstadz, setSelectedUstadz] = useState<Ustadz | null>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [appointments, setAppointments] = useState<JanjiTemu[]>(initialData?.data || []);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    const { alertState, showAlert, hideAlert } = useAlert();
    
    const [bookingForm, setBookingForm] = useState({
        nama: '',
        email: '',
        telepon: '',
        keperluan: ''
    });

    // Fetch appointments from API
    useEffect(() => {
        if (!initialData) {
            fetchAppointments();
        }
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            // Add cache busting parameter
            const timestamp = new Date().getTime();
            const response = await fetch(`/api/janji-temu?_t=${timestamp}`);
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

    // Generate time slots based on selected ustadz schedule and date
    const generateTimeSlots = (): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        
        if (!selectedUstadz || !selectedDate) return slots;
        
        // Get ustadz schedule data
        let days: string[] = selectedUstadz.schedule_days || [];
        let startTime = selectedUstadz.schedule_start_time || '';
        let endTime = selectedUstadz.schedule_end_time || '';
        
        // Fallback: parse from schedule string if structured data not available
        if (days.length === 0 && selectedUstadz.schedule) {
            const scheduleMatch = selectedUstadz.schedule.match(/(.+):\s*(\d{2}:\d{2})-(\d{2}:\d{2})/);
            if (scheduleMatch) {
                const [, daysStr, start, end] = scheduleMatch;
                days = daysStr.split(',').map(d => d.trim());
                startTime = start;
                endTime = end;
            }
        }
        
        if (days.length === 0 || !startTime || !endTime) return slots;
        
        // Check if selected date is within working days
        const selectedDateObj = new Date(selectedDate);
        const dayMapping: { [key: string]: string } = {
            'Monday': 'Senin',
            'Tuesday': 'Selasa', 
            'Wednesday': 'Rabu',
            'Thursday': 'Kamis',
            'Friday': 'Jumat',
            'Saturday': 'Sabtu',
            'Sunday': 'Minggu'
        };
        const indonesianDay = dayMapping[selectedDateObj.toLocaleDateString('en-US', { weekday: 'long' })];
        
        if (!days.includes(indonesianDay)) {
            return slots; // Return empty if ustadz not available on this day
        }
        
        // Parse start and end times
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        
        // Generate time slots in 30-minute intervals
        let currentHour = startHour;
        let currentMinute = startMinute;
        
        while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
            const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            
            // Check if slot is already booked
            const isBooked = appointments.some(appointment => 
                appointment.tanggal === selectedDate && 
                appointment.waktu === timeString &&
                appointment.status !== 'rejected'
            );

            if (!isBooked) {
                slots.push({
                    time: timeString,
                    available: true,
                    ustadz: selectedUstadz.name
                });
            }
            
            // Increment by 30 minutes
            currentMinute += 30;
            if (currentMinute >= 60) {
                currentMinute = 0;
                currentHour += 1;
            }
        }
        
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-4 w-4" />;
            case 'pending':
                return <AlertCircle className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'approved':
                return 'Disetujui';
            case 'pending':
                return 'Menunggu';
            case 'rejected':
                return 'Ditolak';
            default:
                return status;
        }
    };

    const handleSubmitBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedUstadz || !selectedDate || !selectedTime) {
            showAlert('error', 'Data Tidak Lengkap', 'Silakan lengkapi semua data yang diperlukan');
            return;
        }
        
        setSubmitting(true);

        const formData = new FormData();
        formData.append('nama', bookingForm.nama);
        formData.append('email', bookingForm.email);
        formData.append('telepon', bookingForm.telepon);
        formData.append('tanggal', selectedDate);
        formData.append('waktu', selectedTime);
        formData.append('keperluan', bookingForm.keperluan);
        formData.append('ustadz_id', selectedUstadz.id.toString());

        try {
            router.post('/janji-temu', formData, {
                onSuccess: () => {
                    showAlert('success', 'Berhasil!', 'Janji temu berhasil dibuat!');
                    setShowBookingForm(false);
                    // Reset form
                    setBookingForm({
                        nama: '',
                        email: '',
                        telepon: '',
                        keperluan: ''
                    });
                    setSelectedUstadz(null);
                    setSelectedDate('');
                    setSelectedTime('');
                    // Refresh data
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
        } catch (error) {
            console.error('Error submitting booking:', error);
            showAlert('error', 'Terjadi Kesalahan', 'Terjadi kesalahan saat mengirim data');
            setSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <Head title="Janji Temu - Sistem Informasi Masjid Al-Ikhlash" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                    <Calendar className="h-8 w-8 text-teal-600" />
                                    Janji Temu dengan Ustadz
                                </h1>
                                <p className="mt-2 text-lg text-gray-600">
                                    Sistem booking konsultasi dan bimbingan keagamaan
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <Button 
                                    onClick={() => setShowBookingForm(true)}
                                    className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    Buat Janji Temu
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form Modal */}
                    {showBookingForm && (
                        <Card className="mb-8 shadow-lg border-2 border-teal-200">
                            <CardHeader className="bg-teal-50">
                                <CardTitle className="flex items-center gap-2 text-teal-800">
                                    <Plus className="h-5 w-5" />
                                    Buat Janji Temu Baru
                                </CardTitle>
                                <CardDescription>
                                    Isi form berikut untuk membuat janji temu dengan ustadz
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmitBooking} className="space-y-6">
                                    {/* Step 1: Personal Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            1. Informasi Pribadi
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="nama">Nama Lengkap *</Label>
                                                <Input
                                                    id="nama"
                                                    value={bookingForm.nama}
                                                    onChange={(e) => setBookingForm({...bookingForm, nama: e.target.value})}
                                                    placeholder="Masukkan nama lengkap"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="telepon">Nomor Telepon *</Label>
                                                <Input
                                                    id="telepon"
                                                    value={bookingForm.telepon}
                                                    onChange={(e) => setBookingForm({...bookingForm, telepon: e.target.value})}
                                                    placeholder="08xx-xxxx-xxxx"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={bookingForm.email}
                                                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                                                    placeholder="email@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step 2: Choose Ustadz */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5" />
                                            2. Pilih Ustadz
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {ustadz.filter(u => u.active).map((u) => (
                                                <div
                                                    key={u.id}
                                                    onClick={() => {
                                                        setSelectedUstadz(u);
                                                        setSelectedDate(''); // Reset date when ustadz changes
                                                        setSelectedTime(''); // Reset time when ustadz changes
                                                    }}
                                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                        selectedUstadz?.id === u.id
                                                            ? 'border-teal-500 bg-teal-50'
                                                            : 'border-gray-200 hover:border-teal-300'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">{u.name}</h4>
                                                            <p className="text-sm text-gray-600 mb-2">{u.specialization}</p>
                                                            <p className="text-xs text-gray-500 mb-2">{u.experience}</p>
                                                            <div className="flex items-center gap-1 text-xs text-teal-600">
                                                                <Clock className="h-3 w-3" />
                                                                {u.schedule}
                                                            </div>
                                                        </div>
                                                        {selectedUstadz?.id === u.id && (
                                                            <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {!selectedUstadz && (
                                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                                                <p className="text-sm text-blue-700">
                                                    Pilih ustadz terlebih dahulu untuk melihat jadwal yang tersedia
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Step 3: Choose Date and Time */}
                                    {selectedUstadz && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                <Calendar className="h-5 w-5" />
                                                3. Pilih Tanggal & Waktu
                                            </h3>
                                            <div className="bg-teal-50 p-4 rounded-lg">
                                                <p className="text-sm text-teal-700 mb-2">
                                                    <strong>Ustadz terpilih:</strong> {selectedUstadz.name}
                                                </p>
                                                <p className="text-sm text-teal-600">
                                                    <strong>Jadwal tersedia:</strong> {selectedUstadz.schedule}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label htmlFor="tanggal">Tanggal *</Label>
                                                    <Input
                                                        id="tanggal"
                                                        type="date"
                                                        value={selectedDate}
                                                        onChange={(e) => {
                                                            setSelectedDate(e.target.value);
                                                            setSelectedTime(''); // Reset time when date changes
                                                        }}
                                                        min={new Date().toISOString().split('T')[0]}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="waktu">Waktu *</Label>
                                                    {selectedDate ? (
                                                        timeSlots.length > 0 ? (
                                                            <select
                                                                id="waktu"
                                                                value={selectedTime}
                                                                onChange={(e) => setSelectedTime(e.target.value)}
                                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                                required
                                                            >
                                                                <option value="">Pilih waktu yang tersedia</option>
                                                                {timeSlots.map((slot) => (
                                                                    <option 
                                                                        key={slot.time} 
                                                                        value={slot.time}
                                                                    >
                                                                        {slot.time}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <div className="p-2 border border-gray-300 rounded-md bg-red-50 text-red-700">
                                                                {selectedUstadz.name} tidak tersedia pada tanggal ini
                                                            </div>
                                                        )
                                                    ) : (
                                                        <div className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                                                            Pilih tanggal terlebih dahulu
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Purpose */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <Mail className="h-5 w-5" />
                                            4. Keperluan Konsultasi
                                        </h3>
                                        <div>
                                            <Label htmlFor="keperluan">Jelaskan keperluan konsultasi *</Label>
                                            <textarea
                                                id="keperluan"
                                                value={bookingForm.keperluan}
                                                onChange={(e) => setBookingForm({...bookingForm, keperluan: e.target.value})}
                                                placeholder="Jelaskan secara singkat hal yang ingin dikonsultasikan, seperti: masalah fiqih, konseling keluarga, kajian Al-Quran, dll."
                                                rows={4}
                                                className="w-full p-3 border border-gray-300 rounded-md"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t">
                                                                                <Button 
                                            type="submit" 
                                            className="bg-teal-600 hover:bg-teal-700" 
                                            disabled={submitting || !selectedUstadz || !selectedDate || !selectedTime}
                                        >
                                            {submitting ? 'Memproses...' : 'Buat Janji Temu'}
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline"
                                            onClick={() => {
                                                setShowBookingForm(false);
                                                setSelectedUstadz(null);
                                                setSelectedDate('');
                                                setSelectedTime('');
                                                setBookingForm({
                                                    nama: '',
                                                    email: '',
                                                    telepon: '',
                                                    keperluan: ''
                                                });
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

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Appointments List */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Daftar Janji Temu Anda
                                    </CardTitle>
                                    <CardDescription>
                                        Pantau status janji temu yang telah dibuat
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                                            <p className="mt-4 text-gray-600">Memuat data janji temu...</p>
                                        </div>
                                    ) : appointments.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <h3 className="font-medium text-gray-900 mb-2">Belum Ada Janji Temu</h3>
                                            <p className="text-gray-600">Buat janji temu pertama Anda dengan ustadz</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {appointments.map((appointment) => (
                                                <div key={appointment.id} className="p-4 bg-gray-50 rounded-lg border">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                                <User className="h-4 w-4" />
                                                                {appointment.nama}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                                                                <Calendar className="h-4 w-4" />
                                                                {new Date(appointment.tanggal).toLocaleDateString('id-ID')} - {appointment.waktu}
                                                            </p>
                                                        </div>
                                                        <Badge className={`flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                                                            {getStatusIcon(appointment.status)}
                                                            {getStatusText(appointment.status)}
                                                        </Badge>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                        <div>
                                                            <p className="text-gray-600">
                                                                <span className="font-medium">Keperluan:</span> {appointment.keperluan}
                                                            </p>
                                                            <p className="text-gray-600 text-xs">
                                                                Dibuat: {new Date(appointment.created_at).toLocaleDateString('id-ID')}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-600 flex items-center gap-1">
                                                                <Phone className="h-3 w-3" />
                                                                {appointment.telepon}
                                                            </p>
                                                            <p className="text-gray-600 flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {appointment.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Ustadz Information */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Daftar Ustadz
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {ustadz.map((u) => (
                                        <div key={u.id} className="p-3 bg-gray-50 rounded-lg">
                                            <h4 className="font-semibold text-gray-900">{u.name}</h4>
                                            <p className="text-sm text-gray-600 mb-1">
                                                <span className="font-medium">Spesialisasi:</span> {u.specialization}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-1">
                                                <span className="font-medium">Pengalaman:</span> {u.experience}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Jadwal:</span> {u.schedule}
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Quick Stats */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle>Statistik</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Janji Temu Hari Ini</span>
                                        <span className="font-bold text-teal-600">
                                            {appointments.filter(a => new Date(a.tanggal).toDateString() === new Date().toDateString()).length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Menunggu Konfirmasi</span>
                                        <span className="font-bold text-yellow-600">
                                            {appointments.filter(a => a.status === 'pending').length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Disetujui</span>
                                        <span className="font-bold text-green-600">
                                            {appointments.filter(a => a.status === 'approved').length}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Janji Temu</span>
                                        <span className="font-bold text-blue-600">{appointments.length}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Available Times Today Preview */}
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Waktu Tersedia {selectedDate ? `(${new Date(selectedDate).toLocaleDateString('id-ID')})` : 'Hari Ini'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {selectedDate && timeSlots.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {timeSlots.map((slot) => (
                                                <div key={slot.time} className="p-2 bg-green-50 rounded text-center text-sm">
                                                    <div className="font-medium text-green-800">{slot.time}</div>
                                                    <div className="text-xs text-green-600">{slot.ustadz}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : selectedDate ? (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500">Tidak ada waktu yang tersedia untuk tanggal ini</p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500">Pilih tanggal untuk melihat waktu yang tersedia</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert Modal */}
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={hideAlert}
                type={alertState.type}
                title={alertState.title}
                message={alertState.message}
            />
        </MainLayout>
    );
} 
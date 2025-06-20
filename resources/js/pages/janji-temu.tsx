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

    // Generate time slots based on ustadz schedules and selected date
    const generateTimeSlots = (): TimeSlot[] => {
        const slots: TimeSlot[] = [];
        
        // Generate time slots from 08:00 to 20:00 in 1-hour intervals
        for (let hour = 8; hour <= 20; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            
            // Find ustadz available at this time
            const availableUstadz = ustadz.find(u => {
                if (!u.active) return false;
                
                // Use structured data if available, otherwise parse schedule string
                let days: string[] = u.schedule_days || [];
                let startTime = u.schedule_start_time || '';
                let endTime = u.schedule_end_time || '';
                
                // Fallback: parse from schedule string if structured data not available
                if (days.length === 0 && u.schedule) {
                    const scheduleMatch = u.schedule.match(/(.+):\s*(\d{2}:\d{2})-(\d{2}:\d{2})/);
                    if (scheduleMatch) {
                        const [, daysStr, start, end] = scheduleMatch;
                        days = daysStr.split(',').map(d => d.trim());
                        startTime = start;
                        endTime = end;
                    }
                }
                
                if (days.length === 0 || !startTime || !endTime) return false;
                
                // Check if selected date is within working days
                if (selectedDate) {
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
                        return false;
                    }
                }
                
                // Check if time is within working hours
                return timeString >= startTime && timeString <= endTime;
            });

            // Check if slot is already booked
            const isBooked = selectedDate && appointments.some(appointment => 
                appointment.tanggal === selectedDate && 
                appointment.waktu === timeString &&
                appointment.status !== 'rejected'
            );

            if (availableUstadz && !isBooked) {
                slots.push({
                    time: timeString,
                    available: true,
                    ustadz: availableUstadz.name
                });
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
        setSubmitting(true);

        const formData = new FormData();
        formData.append('nama', bookingForm.nama);
        formData.append('email', bookingForm.email);
        formData.append('telepon', bookingForm.telepon);
        formData.append('tanggal', selectedDate);
        formData.append('waktu', selectedTime);
        formData.append('keperluan', bookingForm.keperluan);

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
                                        <div>
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={bookingForm.email}
                                                onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                                                placeholder="email@example.com"
                                            />
                                        </div>
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
                                        <div className="md:col-span-2">
                                            <Label htmlFor="waktu">Waktu *</Label>
                                            {selectedDate ? (
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
                                                            {slot.time} - dengan {slot.ustadz}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <div className="p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                                                    Pilih tanggal terlebih dahulu
                                                </div>
                                            )}
                                            
                                            {selectedDate && timeSlots.length === 0 && (
                                                <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
                                                    <p className="text-sm text-orange-700">
                                                        Tidak ada waktu yang tersedia untuk tanggal ini. Silakan pilih tanggal lain.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="keperluan">Keperluan *</Label>
                                        <textarea
                                            id="keperluan"
                                            value={bookingForm.keperluan}
                                            onChange={(e) => setBookingForm({...bookingForm, keperluan: e.target.value})}
                                            placeholder="Jelaskan secara singkat hal yang ingin dikonsultasikan"
                                            rows={3}
                                            className="w-full p-2 border border-gray-300 rounded-md"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={submitting}>
                                            {submitting ? 'Memproses...' : 'Buat Janji Temu'}
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => setShowBookingForm(false)}
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
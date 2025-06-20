import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Calculator,
    Info
} from 'lucide-react';

export default function HitungZakat() {
    const [selectedZakat, setSelectedZakat] = useState('');
    const [isManualInput, setIsManualInput] = useState(false);
    const [zakatAmount, setZakatAmount] = useState(0);
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Zakat options from reference
    const zakatOptions = {
        'Zakat Maal': 'Zakat Maal',
        'Zakat Profesi': 'Zakat Profesi',
        'Zakat Emas, Perak, dan Logam mulia': 'Zakat Emas, Perak, dan Logam mulia',
        'Zakat Pendapatan Dan Jasa': 'Zakat Pendapatan Dan Jasa',
        'Zakat Perniagaan': 'Zakat Perniagaan',
        'Zakat Pertambangan': 'Zakat Pertambangan',
        'Zakat Pertanian, Perkebunan, dan Kehutanan': 'Zakat Pertanian, Perkebunan, dan Kehutanan',
        'Zakat Perusahaan': 'Zakat Perusahaan',
        'Zakat Peternakan dan Perikanan': 'Zakat Peternakan dan Perikanan',
        'Zakat Rikaz': 'Zakat Rikaz',
        'Zakat uang dan surat berharga lainnya': 'Zakat uang dan surat berharga lainnya'
    };

    // Field requirements for each zakat type
    const zakatFieldRequirements: Record<string, any[]> = {
        'Zakat Maal': [
            {
                id: 'jumlah_harta',
                label: 'Jumlah Harta',
                placeholder: 'Masukkan jumlah harta',
                type: 'number',
                required: true
            }
        ],
        'Zakat Profesi': [
            {
                id: 'gaji',
                label: 'Gaji Bulanan',
                placeholder: 'Masukkan gaji bulanan',
                type: 'number',
                required: true
            },
            {
                id: 'bonus',
                label: 'Bonus Tahunan',
                placeholder: 'Masukkan bonus tahunan',
                type: 'number',
                required: false
            }
        ],
        'Zakat Emas, Perak, dan Logam mulia': [
            {
                id: 'jumlah_emas',
                label: 'Jumlah Emas (gram)',
                placeholder: 'Masukkan jumlah emas',
                type: 'number',
                required: true
            },
            {
                id: 'harga_emas',
                label: 'Harga Emas per gram',
                placeholder: 'Masukkan harga emas per gram',
                type: 'number',
                required: true
            }
        ],
        'Zakat Pendapatan Dan Jasa': [
            {
                id: 'pendapatan',
                label: 'Pendapatan Bulanan',
                placeholder: 'Masukkan pendapatan bulanan',
                type: 'number',
                required: true
            },
            {
                id: 'biaya_operasional',
                label: 'Biaya Operasional',
                placeholder: 'Masukkan biaya operasional',
                type: 'number',
                required: false
            }
        ],
        'Zakat Perniagaan': [
            {
                id: 'modal',
                label: 'Modal Dagang',
                placeholder: 'Masukkan modal dagang',
                type: 'number',
                required: true
            },
            {
                id: 'utang_jatuh_tempo',
                label: 'Utang Jatuh Tempo',
                placeholder: 'Masukkan utang jatuh tempo',
                type: 'number',
                required: false
            }
        ],
        'Zakat Pertambangan': [
            {
                id: 'hasil_tambang',
                label: 'Hasil Tambang',
                placeholder: 'Masukkan hasil tambang',
                type: 'number',
                required: true
            },
            {
                id: 'biaya_produksi',
                label: 'Biaya Produksi',
                placeholder: 'Masukkan biaya produksi',
                type: 'number',
                required: false
            }
        ],
        'Zakat Pertanian, Perkebunan, dan Kehutanan': [
            {
                id: 'hasil_panen',
                label: 'Hasil Panen',
                placeholder: 'Masukkan hasil panen',
                type: 'number',
                required: true
            },
            {
                id: 'biaya_operasional',
                label: 'Biaya Operasional',
                placeholder: 'Masukkan biaya operasional',
                type: 'number',
                required: false
            }
        ],
        'Zakat Perusahaan': [
            {
                id: 'pendapatan_tahunan',
                label: 'Pendapatan Tahunan',
                placeholder: 'Masukkan pendapatan tahunan',
                type: 'number',
                required: true
            },
            {
                id: 'pengeluaran_tahunan',
                label: 'Pengeluaran Tahunan',
                placeholder: 'Masukkan pengeluaran tahunan',
                type: 'number',
                required: true
            }
        ],
        'Zakat Peternakan dan Perikanan': [
            {
                id: 'jumlah_ternak',
                label: 'Jumlah Ternak',
                placeholder: 'Masukkan jumlah ternak',
                type: 'number',
                required: true
            },
            {
                id: 'hasil_perikanan',
                label: 'Hasil Perikanan',
                placeholder: 'Masukkan hasil perikanan',
                type: 'number',
                required: false
            }
        ],
        'Zakat Rikaz': [
            {
                id: 'jumlah_temuan',
                label: 'Jumlah Harta Temuan',
                placeholder: 'Masukkan jumlah harta temuan',
                type: 'number',
                required: true
            }
        ],
        'Zakat uang dan surat berharga lainnya': [
            {
                id: 'jumlah_uang',
                label: 'Jumlah Uang',
                placeholder: 'Masukkan jumlah uang',
                type: 'number',
                required: true
            },
            {
                id: 'jumlah_surat_berharga',
                label: 'Jumlah Surat Berharga',
                placeholder: 'Masukkan jumlah surat berharga',
                type: 'number',
                required: false
            }
        ]
    };

    // Adjust dynamic fields based on selected zakat type
    const adjustFields = () => {
        setIsManualInput(false);
        setZakatAmount(0);
        setFormData({});
    };

    // Calculation function for each Zakat type (pure calculation without side effects)
    const calculateZakatAmount = () => {
        const zakatType = selectedZakat;
        const fields = zakatFieldRequirements[zakatType] || [];
        const values = Object.fromEntries(
            fields.map((field) => [field.id, Number(formData[field.id] || 0)])
        );

        if (zakatType && isManualInput && zakatAmount) {
            return zakatAmount;
        }

        let calculatedAmount = 0;

        switch (zakatType) {
            case 'Zakat Maal':
                calculatedAmount = values.jumlah_harta * 0.025;
                break;
            case 'Zakat Profesi':
                calculatedAmount = (values.gaji + (values.bonus || 0)) * 0.025;
                break;
            case 'Zakat Emas, Perak, dan Logam mulia':
                calculatedAmount = values.jumlah_emas * values.harga_emas * 0.025;
                break;
            case 'Zakat Pendapatan Dan Jasa':
                calculatedAmount = (values.pendapatan - (values.biaya_operasional || 0)) * 0.025;
                break;
            case 'Zakat Perniagaan':
                calculatedAmount = (values.modal - (values.utang_jatuh_tempo || 0)) * 0.025;
                break;
            case 'Zakat Pertambangan':
                calculatedAmount = (values.hasil_tambang - (values.biaya_produksi || 0)) * 0.025;
                break;
            case 'Zakat Pertanian, Perkebunan, dan Kehutanan':
                calculatedAmount = (values.hasil_panen - (values.biaya_operasional || 0)) * 0.05;
                break;
            case 'Zakat Perusahaan':
                calculatedAmount = (values.pendapatan_tahunan - values.pengeluaran_tahunan) * 0.025;
                break;
            case 'Zakat Peternakan dan Perikanan':
                calculatedAmount = values.jumlah_ternak * 0.025;
                break;
            case 'Zakat Rikaz':
                calculatedAmount = values.jumlah_temuan * 0.2;
                break;
            case 'Zakat uang dan surat berharga lainnya':
                calculatedAmount = (values.jumlah_uang + (values.jumlah_surat_berharga || 0)) * 0.025;
                break;
            default:
                return 0;
        }
        
        const returnValue = Number(calculatedAmount);
        return returnValue < 0 ? 0 : returnValue;
    };

    // Function to handle calculation button click
    const handleCalculateZakat = () => {
        const result = calculateZakatAmount();
        setZakatAmount(result);
    };

    const handleInputChange = (fieldId: string, value: string) => {
        setFormData({
            ...formData,
            [fieldId]: value
        });
    };

    const handleZakatTypeChange = (value: string) => {
        setSelectedZakat(value);
        adjustFields();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getNisabInfo = (zakatType: string) => {
        const nisabInfo: Record<string, string> = {
            'Zakat Maal': 'Rp 7.425.000 (setara 85 gram emas)',
            'Zakat Profesi': 'Rp 7.425.000 per tahun (setara 653 kg beras)',
            'Zakat Emas, Perak, dan Logam mulia': '85 gram emas atau 595 gram perak',
            'Zakat Pendapatan Dan Jasa': 'Rp 7.425.000 per tahun',
            'Zakat Perniagaan': 'Rp 7.425.000 (modal + keuntungan - utang)',
            'Zakat Pertambangan': 'Tidak ada nisab minimum',
            'Zakat Pertanian, Perkebunan, dan Kehutanan': '5 wasaq (± 653 kg gabah/beras)',
            'Zakat Perusahaan': 'Rp 7.425.000 (aset bersih)',
            'Zakat Peternakan dan Perikanan': 'Kambing: 40 ekor, Sapi: 30 ekor, Unta: 5 ekor',
            'Zakat Rikaz': 'Tidak ada nisab minimum (1/5 dari temuan)',
            'Zakat uang dan surat berharga lainnya': 'Rp 7.425.000 (setara 85 gram emas)'
        };
        return nisabInfo[zakatType] || 'Konsultasikan dengan ahli fiqih untuk nisab yang tepat';
    };

    return (
        <MainLayout>
            <Head title="Simulasi Hitung Zakat - Sistem Informasi Masjid Al-Ikhlash" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-16">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
                            <Calculator className="h-8 w-8 text-purple-600" />
                            Simulasi Hitung Zakat
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 max-w-2xl mx-auto">
                            Kalkulator zakat untuk membantu jamaah menghitung kewajiban zakat sesuai syariat Islam
                        </p>
                    </div>

                    {/* Zakat Selection */}
                    <Card className="mb-8 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="h-5 w-5" />
                                Pilih Jenis Zakat
                            </CardTitle>
                            <CardDescription>
                                Pilih jenis zakat yang ingin Anda hitung
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="zakat-type">Jenis Zakat</Label>
                                    <select
                                        id="zakat-type"
                                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        value={selectedZakat}
                                        onChange={(e) => handleZakatTypeChange(e.target.value)}
                                    >
                                        <option value="">Pilih Jenis Zakat</option>
                                        {Object.entries(zakatOptions).map(([key, value]) => (
                                            <option key={key} value={key}>{value}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {selectedZakat && (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="manual-input"
                                            checked={isManualInput}
                                            onChange={(e) => setIsManualInput(e.target.checked)}
                                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                        />
                                        <Label htmlFor="manual-input" className="text-sm">
                                            Saya mengetahui jumlah {selectedZakat} saya, Saya ingin isi sendiri
                                        </Label>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Calculator Form */}
                        <div className="lg:col-span-2">
                            {selectedZakat && (
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calculator className="h-5 w-5" />
                                            {selectedZakat}
                                        </CardTitle>
                                        <CardDescription>
                                            Masukkan data untuk menghitung {selectedZakat}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {isManualInput ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="manual-amount">Jumlah {selectedZakat} (Rp)</Label>
                                                    <Input
                                                        id="manual-amount"
                                                        type="number"
                                                        placeholder={`Masukkan Jumlah ${selectedZakat} Anda`}
                                                        value={zakatAmount}
                                                        onChange={(e) => setZakatAmount(Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {zakatFieldRequirements[selectedZakat]?.map((field) => (
                                                    <div key={field.id}>
                                                        <Label htmlFor={field.id}>
                                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                                        </Label>
                                                        <Input
                                                            id={field.id}
                                                            type={field.type}
                                                            placeholder={field.placeholder}
                                                            value={formData[field.id] || ''}
                                                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                                                            required={field.required}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        
                                        <div className="space-y-4">
                                            <div className="p-4 bg-purple-50 rounded-lg">
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">
                                                    Total {selectedZakat} yang harus dibayar
                                                </h4>
                                                <p className="text-3xl font-bold text-purple-600">
                                                    {formatCurrency(zakatAmount)}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Rate: {selectedZakat === 'Zakat Rikaz' ? '20%' : 
                                                           selectedZakat === 'Zakat Pertanian, Perkebunan, dan Kehutanan' ? '5-10%' : '2.5%'}
                                                </p>
                                            </div>
                                            
                                            <Button 
                                                onClick={handleCalculateZakat}
                                                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                                disabled={!selectedZakat || (!isManualInput && zakatFieldRequirements[selectedZakat]?.some(field => field.required && !formData[field.id]))}
                                            >
                                                Hitung {selectedZakat}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Info Panel */}
                        <div className="space-y-6">
                            {selectedZakat && (
                                <Card className="shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Info className="h-5 w-5" />
                                            Informasi {selectedZakat}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <h4 className="font-semibold text-blue-900 mb-2">Rate Zakat</h4>
                                                <p className="text-blue-800 text-sm">
                                                    {selectedZakat === 'Zakat Rikaz' ? '20% dari harta temuan' : 
                                                     selectedZakat === 'Zakat Pertanian, Perkebunan, dan Kehutanan' ? '5% (irigasi) atau 10% (tadah hujan)' : 
                                                     '2.5% dari total harta'}
                                                </p>
                                            </div>
                                            
                                            <div className="p-4 bg-orange-50 rounded-lg">
                                                <h4 className="font-semibold text-orange-900 mb-2">Nisab</h4>
                                                <p className="text-orange-800 text-sm">
                                                    {getNisabInfo(selectedZakat)}
                                                </p>
                                            </div>
                                            
                                            <div className="p-4 bg-green-50 rounded-lg">
                                                <h4 className="font-semibold text-green-900 mb-2">Ketentuan Syariat</h4>
                                                <p className="text-green-800 text-sm">
                                                    Zakat wajib dikeluarkan sesuai dengan ketentuan syariat Islam dan telah mencapai nisab serta haul (1 tahun).
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
} 
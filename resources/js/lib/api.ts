import axios, { AxiosResponse } from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

// Request interceptor to add CSRF token
api.interceptors.request.use(
    (config) => {
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            config.headers['X-CSRF-TOKEN'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// API Types
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    source?: string;
}

export interface Article {
    id: number;
    title: string;
    content: string;
    excerpt: string;
    image_url?: string;
    published_at: string;
    created_at: string;
    updated_at: string;
}

export interface PengurusMasjid {
    id: number;
    name: string;
    position: string;
    photo_url?: string;
    phone?: string;
    email?: string;
    description?: string;
    is_active: boolean;
}

export interface JanjiTemu {
    id: number;
    name: string;
    phone: string;
    email?: string;
    subject: string;
    message: string;
    preferred_date: string;
    preferred_time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    ustadz_response?: string;
    created_at: string;
}

export interface LaporanKas {
    id: number;
    tanggal: string;
    keterangan: string;
    jenis: 'masuk' | 'keluar';
    jumlah: number;
    kategori: string;
    created_at: string;
}

export interface LaporanInfaq {
    id: number;
    nama_donatur: string;
    jumlah: number;
    tanggal: string;
    jenis_donasi: string;
    metode_pembayaran: string;
    keterangan?: string;
    created_at: string;
}

export interface SholatTime {
    shubuh: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
}

export interface Statistics {
    totalKas: number;
    totalDonasi: number;
    totalJanjiTemu: number;
    janjiTemuPending: number;
    monthlyIncome: number;
    monthlyExpense: number;
}

export interface HeroBanner {
    id: number;
    title: string;
    subtitle: string;
    image_url: string;
    link_url?: string;
    link_text?: string;
    is_active: boolean;
    order: number;
}

// API Functions
export const articlesApi = {
    getAll: (): Promise<AxiosResponse<ApiResponse<Article[]>>> =>
        api.get('/articles'),
    
    getById: (id: number): Promise<AxiosResponse<ApiResponse<Article>>> =>
        api.get(`/articles/${id}`),
    
    getFeatured: (): Promise<AxiosResponse<ApiResponse<Article[]>>> =>
        api.get('/articles/featured'),
};

export const pengurusMasjidApi = {
    getAll: (): Promise<AxiosResponse<ApiResponse<PengurusMasjid[]>>> =>
        api.get('/pengurus-masjid'),
};

export const janjiTemuApi = {
    getAll: (): Promise<AxiosResponse<ApiResponse<JanjiTemu[]>>> =>
        api.get('/janji-temu'),
    
    create: (data: Omit<JanjiTemu, 'id' | 'status' | 'created_at' | 'ustadz_response'>): Promise<AxiosResponse<ApiResponse<JanjiTemu>>> =>
        api.post('/janji-temu', data),
};

export const laporanKasApi = {
    getAll: (): Promise<AxiosResponse<ApiResponse<LaporanKas[]>>> =>
        api.get('/laporan-kas'),
    
    getStatistics: (): Promise<AxiosResponse<ApiResponse<{
        totalIncome: number;
        totalExpense: number;
        balance: number;
        monthlyIncome: number;
        monthlyExpense: number;
    }>>> =>
        api.get('/laporan-kas/statistics'),
};

export const laporanInfaqApi = {
    getAll: (): Promise<AxiosResponse<ApiResponse<LaporanInfaq[]>>> =>
        api.get('/laporan-infaq'),
    
    getStatistics: (): Promise<AxiosResponse<ApiResponse<{
        totalDonasi: number;
        totalDonatur: number;
        monthlyDonasi: number;
        averageDonasi: number;
    }>>> =>
        api.get('/laporan-infaq/statistics'),
};

export const statisticsApi = {
    getDashboard: (): Promise<AxiosResponse<ApiResponse<Statistics>>> =>
        api.get('/statistics/dashboard'),
    
    getKas: (): Promise<AxiosResponse<ApiResponse<{
        totalIncome: number;
        totalExpense: number;
        balance: number;
    }>>> =>
        api.get('/statistics/kas'),
    
    getInfaq: (): Promise<AxiosResponse<ApiResponse<{
        totalDonasi: number;
        totalDonatur: number;
        monthlyDonasi: number;
    }>>> =>
        api.get('/statistics/infaq'),
    
    getJanjiTemu: (): Promise<AxiosResponse<ApiResponse<{
        totalJanjiTemu: number;
        pending: number;
        confirmed: number;
        completed: number;
    }>>> =>
        api.get('/statistics/janji-temu'),
};

export const heroBannersApi = {
    getAll: (): Promise<AxiosResponse<ApiResponse<HeroBanner[]>>> =>
        api.get('/hero-banners'),
};

export const sholatTimesApi = {
    getToday: (date?: string): Promise<AxiosResponse<ApiResponse<SholatTime>>> =>
        api.get(`/sholat-times${date ? `?date=${date}` : ''}`),
};

// Helper function for error handling
export const handleApiError = (error: any): string => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }
    if (error.message) {
        return error.message;
    }
    return 'Terjadi kesalahan tidak dikenal';
};

export default api; 
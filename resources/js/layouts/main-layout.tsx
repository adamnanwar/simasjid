import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Building2, 
    Menu, 
    X,
    FileText, 
    Heart, 
    Calculator, 
    Clock, 
    Calendar,
    LayoutGrid,
    Users,
    Newspaper,
    UserCheck,
    Settings
} from 'lucide-react';
import { type SharedData } from '@/types';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNavbarHidden, setIsNavbarHidden] = useState(false);
    const { auth, url } = usePage<SharedData>().props;
    
    let lastScrollPosition = 0;
    const scrollThreshold = 100;

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPosition = window.pageYOffset;
            if (currentScrollPosition > scrollThreshold) {
                setIsNavbarHidden(currentScrollPosition > lastScrollPosition);
            } else {
                setIsNavbarHidden(false);
            }
            lastScrollPosition = currentScrollPosition;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigationItems = [
        { name: 'Home', href: '/', icon: LayoutGrid },
        { name: 'Laporan Kas', href: '/laporan-kas', icon: FileText },
        { name: 'Laporan Infaq', href: '/laporan-infaq', icon: Heart },
        { name: 'Hitung Zakat', href: '/hitung-zakat', icon: Calculator },
        { name: 'Jam Sholat', href: '/jam-sholat', icon: Clock },
        { name: 'Janji Temu', href: '/janji-temu', icon: Calendar },
        { name: 'Berita & Kegiatan', href: '/berita-kegiatan', icon: Newspaper },
        { name: 'Pengurus Masjid', href: '/pengurus-masjid', icon: UserCheck },
    ];

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const isCurrentPage = (href: string) => {
        if (!url) return false;
        if (href === '/') {
            return url === '/' || url === '/dashboard';
        }
        return url === href || url.startsWith(href);
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-50 overflow-x-hidden">
            {/* Header Navigation */}
            <header 
                className={`relative top-0 z-50 w-full transition-transform duration-300 lg:fixed ${
                    isNavbarHidden ? '-translate-y-full' : 'translate-y-0'
                }`}
            >
                <div className="w-full px-4 lg:px-8">
                    <div className="mx-auto mt-4 w-full rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-sm p-4 lg:p-6 shadow-lg lg:rounded-[2rem] lg:mt-6">
                        <nav className="flex items-center justify-between">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-md">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div className="hidden md:block">
                                    <div className="text-lg font-bold text-gray-900">SIMASJID</div>
                                    <div className="text-xs text-gray-700">Sistem Informasi Masjid</div>
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex lg:items-center lg:space-x-4 xl:space-x-6 flex-1 justify-center">
                                {navigationItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                            isCurrentPage(item.href)
                                                ? 'bg-emerald-600 text-white shadow-md'
                                                : 'text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm'
                                        }`}
                                    >
                                        <item.icon className="h-4 w-4 flex-shrink-0" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </div>

                            {/* User Area */}
                            {/* <div className="hidden lg:flex lg:items-center lg:gap-3 flex-shrink-0">
                                {auth.user ? (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 border-2 border-emerald-200">
                                            <Users className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900">{auth.user.name}</div>
                                            <div className="text-gray-700">Admin</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 border-2 border-emerald-200">
                                            <Users className="h-5 w-5 text-emerald-600" />
                                        </div>
                                    </div>
                                )}
                            </div> */}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-800 hover:bg-emerald-50 hover:text-emerald-700 lg:hidden transition-colors duration-200 flex-shrink-0"
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </nav>

                        {/* Mobile Menu */}
                        {isMenuOpen && (
                            <div className="lg:hidden mt-4 border-t border-gray-200 pt-4">
                                <div className="space-y-2">
                                    {navigationItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                                                isCurrentPage(item.href)
                                                    ? 'bg-emerald-600 text-white shadow-md'
                                                    : 'text-gray-800 hover:bg-emerald-50 hover:text-emerald-700'
                                            }`}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile User Info */}
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    {auth.user ? (
                                        <div className="flex items-center gap-3 px-3 py-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                                <Users className="h-4 w-4 text-emerald-600" />
                                            </div>
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-900">{auth.user.name}</div>
                                                <div className="text-gray-700">Admin</div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 w-full flex-grow mt-6 lg:mt-20 px-4 lg:px-8">
                <div className="w-full bg-white shadow-sm rounded-t-3xl">
                    <div className="px-6 py-8 lg:px-12 lg:py-12">
                        {children}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 bg-gray-100 border-t border-gray-200 w-full">
                <div className="w-full px-6 py-8 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Logo & Info */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-900">SIMASJID</div>
                                    <div className="text-sm text-gray-700">Sistem Informasi Masjid</div>
                                </div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                <span className="font-bold text-emerald-600">SIMASJID</span> adalah sistem informasi masjid terpadu 
                                yang membantu mengelola kegiatan masjid, keuangan, donasi, dan layanan keagamaan 
                                secara digital dan terintegrasi.
                            </p>
                        </div>

                        {/* Menu Links */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">MENU</h3>
                            <ul className="space-y-3 text-sm">
                                <li><Link href="/pengurus-masjid" className="text-gray-700 hover:text-emerald-600 transition-colors">Pengurus Masjid</Link></li>
                                <li><Link href="/berita-kegiatan" className="text-gray-700 hover:text-emerald-600 transition-colors">Berita & Kegiatan</Link></li>
                                <li><Link href="/laporan-kas" className="text-gray-700 hover:text-emerald-600 transition-colors">Laporan Keuangan</Link></li>
                                <li><Link href="/laporan-infaq" className="text-gray-700 hover:text-emerald-600 transition-colors">Laporan Donasi</Link></li>
                                <li><Link href="/janji-temu" className="text-gray-700 hover:text-emerald-600 transition-colors">Konsultasi Ustadz</Link></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">INFORMASI MASJID</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>Masjid Al-Ikhlash</li>
                                <li>Perumahan Batam Nirwana Residence</li>
                                <li>RW VII, Patam Lestari, Sekupang</li>
                                <li>Kota Batam, Kepulauan Riau 29125</li>
                                <li>Telp: (0778) 7001234</li>
                                <li>Email: info@masjidalikhlash.id</li>
                                <li className="pt-2 border-t border-gray-300">
                                    <Link href="/admin/dashboard" className="text-gray-500 hover:text-emerald-600 transition-colors text-xs">
                                        Admin Panel
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 mt-8 pt-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-600 text-sm">
                                © 2024 SIMASJID - Sistem Informasi Masjid Al-Ikhlash Al-Ikhlash. All Rights Reserved
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
} 
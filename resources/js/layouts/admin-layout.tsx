import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Users, 
    Calendar, 
    DollarSign, 
    FileText, 
    Settings, 
    LogOut, 
    Menu,
    X,
    Home,
    Banknote,
    TrendingUp,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title = 'Admin Dashboard' }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(false);
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string } || {};

    // Show flash message when it exists
    useEffect(() => {
        if (flash.success || flash.error) {
            setShowFlash(true);
            const timer = setTimeout(() => {
                setShowFlash(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const navigation = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: Home,
            current: window.location.pathname === '/admin/dashboard'
        },
        {
            name: 'Pengurus Masjid',
            href: '/admin/pengurus-masjid',
            icon: Users,
            current: window.location.pathname === '/admin/pengurus-masjid'
        },
        {
            name: 'Janji Temu',
            href: '/admin/janji-temu',
            icon: Calendar,
            current: window.location.pathname === '/admin/janji-temu'
        },
        {
            name: 'Keuangan',
            href: '/admin/keuangan',
            icon: DollarSign,
            current: window.location.pathname === '/admin/keuangan',
            children: [
                {
                    name: 'Donasi/Infaq',
                    href: '/admin/keuangan/donasi',
                    icon: Banknote,
                    current: window.location.pathname === '/admin/keuangan/donasi'
                },
                {
                    name: 'Kas Masjid',
                    href: '/admin/keuangan/kas',
                    icon: TrendingUp,
                    current: window.location.pathname === '/admin/keuangan/kas'
                }
            ]
        },
        {
            name: 'Berita & Kegiatan',
            href: '/admin/berita',
            icon: FileText,
            current: window.location.pathname === '/admin/berita'
        }
    ];

    return (
        <>
            <Head title={title} />
            
            <div className="min-h-screen bg-gray-50">
                {/* Flash Messages */}
                {showFlash && (flash.success || flash.error) && (
                    <div className="fixed top-4 right-4 z-50 max-w-sm">
                        <div className={`rounded-md p-4 shadow-lg ${
                            flash.success 
                                ? 'bg-green-50 border border-green-200' 
                                : 'bg-red-50 border border-red-200'
                        }`}>
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {flash.success ? (
                                        <CheckCircle className="h-5 w-5 text-green-400" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-400" />
                                    )}
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm font-medium ${
                                        flash.success ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                        {flash.success || flash.error}
                                    </p>
                                </div>
                                <div className="ml-auto pl-3">
                                    <div className="-mx-1.5 -my-1.5">
                                        <button
                                            type="button"
                                            className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                flash.success
                                                    ? 'text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50'
                                                    : 'text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50'
                                            }`}
                                            onClick={() => setShowFlash(false)}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mobile sidebar */}
                <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <SidebarContent navigation={navigation} />
                    </div>
                </div>

                {/* Desktop sidebar */}
                <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-lg">
                        <SidebarContent navigation={navigation} />
                    </div>
                </div>

                {/* Main content */}
                <div className="lg:pl-72">
                    {/* Top header */}
                    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Separator */}
                        <div className="h-6 w-px bg-gray-200 lg:hidden" />

                        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                            <div className="relative flex flex-1 items-center">
                                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                            </div>
                            <div className="flex items-center gap-x-4 lg:gap-x-6">
                                <span className="text-sm text-gray-600">Selamat datang, Admin</span>
                                <Link
                                    href="/admin/logout"
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Page content */}
                    <main className="py-6">
                        <div className="px-4 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

function SidebarContent({ navigation }: { navigation: any[] }) {
    return (
        <>
            <div className="flex h-16 shrink-0 items-center">
                <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                        <Settings className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">SIMASJID</span>
                </div>
            </div>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    {!item.children ? (
                                        <Link
                                            href={item.href}
                                            className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                                item.current
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                                            }`}
                                        >
                                            <item.icon className="h-6 w-6 shrink-0" />
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <div>
                                            <div className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                                                item.current
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'text-gray-700'
                                            }`}>
                                                <item.icon className="h-6 w-6 shrink-0" />
                                                {item.name}
                                            </div>
                                            <ul className="mt-1 px-2">
                                                {item.children.map((subItem: any) => (
                                                    <li key={subItem.name}>
                                                        <Link
                                                            href={subItem.href}
                                                            className={`group flex gap-x-3 rounded-md p-2 pl-8 text-sm leading-6 ${
                                                                subItem.current
                                                                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                                                    : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50'
                                                            }`}
                                                        >
                                                            <subItem.icon className="h-5 w-5 shrink-0" />
                                                            {subItem.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </nav>
        </>
    );
} 
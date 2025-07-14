import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Calculator, 
    Calendar, 
    Clock, 
    FileText, 
    Folder, 
    Heart, 
    LayoutGrid,
    Building2 
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Laporan Kas',
        href: '/laporan-kas',
        icon: FileText,
    },
    {
        title: 'Zakat Infaq Sedekah',
        href: '/laporan-infaq',
        icon: Heart,
    },
    {
        title: 'Simulasi Hitung Zakat',
        href: '/hitung-zakat',
        icon: Calculator,
    },
    {
        title: 'Jam Sholat Batam',
        href: '/jam-sholat',
        icon: Clock,
    },
    {
        title: 'Janji Temu',
        href: '/janji-temu',
        icon: Calendar,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Sistem Informasi',
        href: '#',
        icon: Building2,
    },
    {
        title: 'Masjid',
        href: '#',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type RouteName, route } from 'ziggy-js';
import '../css/app.css';

// Global error handling
window.addEventListener('error', (event) => {
    // Suppress Google APIs, search-related, and common external script errors
    if (event.filename?.includes('main.js') || 
        event.filename?.includes('search') ||
        event.filename?.includes('google') ||
        event.filename?.includes('common.js') ||
        event.filename?.includes('search_impl.js') ||
        event.message?.includes('search') ||
        event.message?.includes('google') ||
        event.message?.includes('_.Nc') ||
        event.message?.includes('_.G') ||
        event.message?.includes('_.gB')) {
        console.warn('Suppressed external script error:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
        event.preventDefault();
        return false;
    }
});

window.addEventListener('unhandledrejection', (event) => {
    // Handle promise rejections gracefully
    if (event.reason?.message?.includes('search') || 
        event.reason?.message?.includes('google') ||
        event.reason?.message?.includes('CORS') ||
        event.reason?.message?.includes('fetch')) {
        console.warn('Suppressed promise rejection:', event.reason);
        event.preventDefault();
        return false;
    }
});

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
        },
    },
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        /* eslint-disable */
        // @ts-expect-error
        window.route<RouteName> = (name, params, absolute) =>
            route(name, params as any, absolute, {
                // @ts-expect-error
                ...props.initialPage.props.ziggy,
                // @ts-expect-error
                location: new URL(props.initialPage.props.ziggy.location),
            });
        /* eslint-enable */

        const root = createRoot(el);
        root.render(
            <React.StrictMode>
                <QueryClientProvider client={queryClient}>
                    <App {...props} />
                </QueryClientProvider>
            </React.StrictMode>
        );
    },
    progress: {
        color: '#4F46E5',
    },
}); 
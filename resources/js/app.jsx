import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * Tab Session System
 * ------------------
 * Ensure Inertia router sends X-Tab-Id header with every request.
 * This enables per-tab authentication (different accounts on different tabs).
 */
router.on('before', (event) => {
    const tabId = sessionStorage.getItem('luxedrop_tab_id');
    if (tabId) {
        event.detail.visit.headers['X-Tab-Id'] = tabId;
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);

        /**
         * On initial page load (full browser GET), the X-Tab-Id header isn't sent
         * because it's a normal browser request, not an XHR/Inertia request.
         * We do a silent Inertia reload after mount to re-fetch auth data
         * with the correct tab session. Only runs once per page load.
         */
        if (!window.__tabSessionResolved) {
            window.__tabSessionResolved = true;
            const tabId = sessionStorage.getItem('luxedrop_tab_id');
            if (tabId) {
                // Small delay to let the page render first, then reload with correct auth
                setTimeout(() => {
                    router.reload({ 
                        only: ['auth'],
                        headers: { 'X-Tab-Id': tabId },
                    });
                }, 100);
            }
        }
    },
    progress: {
        color: '#4B5563',
    },
});

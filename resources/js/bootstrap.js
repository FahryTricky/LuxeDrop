import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Tab Session System
 * ------------------
 * Each browser tab gets a unique ID stored in sessionStorage (which is tab-isolated).
 * This ID is sent as X-Tab-Id header with every request so the server can authenticate
 * different users per tab in the same browser.
 */
function getTabId() {
    let tabId = sessionStorage.getItem('luxedrop_tab_id');
    if (!tabId) {
        tabId = 'tab_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('luxedrop_tab_id', tabId);
    }
    return tabId;
}

// Send X-Tab-Id header with every Axios request
window.axios.interceptors.request.use(function (config) {
    config.headers['X-Tab-Id'] = getTabId();
    return config;
});

// Export for use in components that need it
window.getTabId = getTabId;

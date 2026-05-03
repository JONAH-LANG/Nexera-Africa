/**
 * NEXERA AFRICA - Main Logic
 * Integrates: Pi SDK, Multi-language, Navigation, and Role-Based Dashboards
 */

// --- 1. PI SDK INITIALIZATION ---
const Pi = window.Pi;
if (typeof Pi !== 'undefined') {
    Pi.init({ version: "2.0", sandbox: true });
}

// --- 2. CORE AUTH FUNCTIONS ---
async function authWithPi() {
    try {
        const scopes = ['username', 'payments'];
        // Triggers the native Pi Browser authentication popup
        const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        console.log(`Authenticated: ${auth.user.username}`);
        return auth.user; 
    } catch (err) {
        console.error("Pi Auth failed:", err);
        alert("Authentication failed. Please ensure you are using the Pi Browser.");
    }
}

function onIncompletePaymentFound(payment) {
    console.log("Incomplete payment detected:", payment);
}

// --- 3. DOM CONTENT LOADED ---
document.addEventListener('DOMContentLoaded', () => {
    
    initLanguage();
    checkAuth();

    // --- A. LANGUAGE LOGIC ---
    function initLanguage() {
        const savedLang = localStorage.getItem('nexera_lang') || 'en';
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = savedLang;
            selector.addEventListener('change', (e) => {
                const lang = e.target.value;
                localStorage.setItem('nexera_lang', lang);
                applyLanguage(lang);
            });
        }
        applyLanguage(savedLang);
    }

    function applyLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (window.translations && translations[lang] && translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });
        document.documentElement.lang = lang;
    }

    // --- B. AUTHENTICATION & LOGIN LOGIC ---
    
    // Pi Network Login Button
    const piLoginBtn = document.getElementById('pi-login-btn');
    if (piLoginBtn) {
        piLoginBtn.addEventListener('click', async () => {
            const piUser = await authWithPi();
            if (piUser) {
                const users = JSON.parse(localStorage.getItem('nexera_users')) || [];
                const existingUser = users.find(u => u.username === piUser.username);

                if (existingUser) {
                    saveAndRedirect(existingUser);
                } else {
                    alert("Pi account recognized. Please Register to select your role (Admin, Vendor, or User).");
                    closeModal('loginModal');
                    openModal('registerModal');
                    document.getElementById('reg-username').value = piUser.username;
                }
            }
        });
    }

    // Manual Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('login-username').value;
            const p = document.getElementById('login-password').value;
            
            const users = JSON.parse(localStorage.getItem('nexera_users')) || [];
            const found = users.find(user => user.username === u && user.password === p);

            if (found) {
                saveAndRedirect(found);
            } else {
                alert("Invalid credentials");
            }
        });
    }

    // Manual Register Form (With Role Selection)
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('reg-username').value;
            const p = document.getElementById('reg-password').value;
            const r = document.getElementById('reg-role').value; // 'admin', 'vendor', or 'user'
            
            const users = JSON.parse(localStorage.getItem('nexera_users')) || [];
            if (users.some(user => user.username === u)) {
                alert("User exists");
                return;
            }

            const newUser = { username: u, password: p, role: r };
            users.push(newUser);
            localStorage.setItem('nexera_users', JSON.stringify(users));
            
            alert(`Registered as ${r}! Please login.`);
            closeModal('registerModal');
            openModal('loginModal');
        });
    }

    // Common function to save login state and show dashboard
    function saveAndRedirect(user) {
        localStorage.setItem('nexera_user', JSON.stringify(user));
        updateAuthUI(user.username);
        closeModal('loginModal');
        handleDashboardRedirection(user);
    }

    // --- C. DASHBOARD REDIRECTION LOGIC ---
    window.handleDashboardRedirection = function(user) {
        // Update all name displays
        document.querySelectorAll('.display-name').forEach(el => el.innerText = user.username);

        // Logic based on role
        if (user.role === 'admin') {
            renderAdminStats();
            navigate('admin-dashboard');
        } else if (user.role === 'vendor') {
            if (typeof renderVendorItems === 'function') renderVendorItems(user.username);
            document.getElementById('btn-open-sell').style.display = 'block';
            navigate('vendor-dashboard');
        } else {
            document.getElementById('btn-open-sell').style.display = 'none';
            navigate('user-dashboard');
        }
    };

    function renderAdminStats() {
        const users = JSON.parse(localStorage.getItem('nexera_users')) || [];
        const adminTotalUsers = document.getElementById('admin-total-users');
        const adminTotalVendors = document.getElementById('admin-total-vendors');
        
        if (adminTotalUsers) adminTotalUsers.innerText = users.length;
        if (adminTotalVendors) adminTotalVendors.innerText = users.filter(u => u.role === 'vendor').length;
    }

    function checkAuth() {
        const user = JSON.parse(localStorage.getItem('nexera_user'));
        if (user) {
            updateAuthUI(user.username);
            // If user is already logged in on refresh, stay on dashboard
            handleDashboardRedirection(user);
        }
    }

    function updateAuthUI(username) {
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('username-display').innerText = username;
    }

    // --- D. NAVIGATION & MODALS ---
    window.navigate = function(pageId) {
        document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
        const target = document.getElementById(pageId);
        if (target) target.classList.add('active');
        window.scrollTo(0, 0);

        if (pageId === 'marketplace' && typeof renderMarketplace === 'function') {
            renderMarketplace();
        }
    };

    window.logout = function() {
        localStorage.removeItem('nexera_user');
        location.reload();
    };

    window.openModal = function(id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'flex';
    };

    window.closeModal = function(id) {
        const modal = document.getElementById(id);
        if (modal) modal.style.display = 'none';
    };

    window.onclick = function(e) {
        if (e.target.classList.contains('modal')) e.target.style.display = 'none';
    };
});
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INITIALIZATION ---
    initLanguage();
    checkAuth();

    // --- 2. LANGUAGE SWITCHER LOGIC ---
    function initLanguage() {
        // Check local storage for saved language, default to English
        const savedLang = localStorage.getItem('nexera_lang') || 'en';
        const selector = document.getElementById('language-selector');
        if(selector) selector.value = savedLang;
        
        applyLanguage(savedLang);

        // Listen for dropdown changes
        if(selector) {
            selector.addEventListener('change', (e) => {
                const lang = e.target.value;
                localStorage.setItem('nexera_lang', lang);
                applyLanguage(lang);
            });
        }
    }

    function applyLanguage(lang) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });
        
        // Update html lang attribute
        document.documentElement.lang = lang;
    }

    // --- 3. NAVIGATION LOGIC ---
    // Exposed to global scope for HTML onclick events
    window.navigate = function(pageId) {
        // Hide all sections
        document.querySelectorAll('.page-section').forEach(sec => {
            sec.classList.remove('active');
        });
        // Show target section
        document.getElementById(pageId).classList.add('active');
        // Scroll to top
        window.scrollTo(0, 0);
    };

    // --- 4. AUTHENTICATION LOGIC ---
    const piLoginBtn = document.getElementById('pi-login-btn');
    
    // Initialize Pi SDK
    if(typeof Pi !== 'undefined') {
        Pi.init({ version: "2.0", sandbox: true });
    }

    if (piLoginBtn) {
        piLoginBtn.addEventListener('click', async () => {
            try {
                // Mock Pi Auth (Since we have no backend)
                // In real production: const authResult = await Pi.authenticate(...)
                alert("Simulating Pi Login...");
                const user = { username: "PiUser_" + Math.floor(Math.random()*1000) };
                
                localStorage.setItem('nexera_user', JSON.stringify(user));
                updateAuthUI(user.username);
                closeModal('loginModal');
                alert("Logged in via Pi!");
            } catch (err) {
                console.error(err);
            }
        });
    }

    // Manual Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('login-username').value;
            const p = document.getElementById('login-password').value;
            
            const users = JSON.parse(localStorage.getItem('nexera_users')) || [];
            const found = users.find(user => user.username === u && user.password === p);

            if (found) {
                localStorage.setItem('nexera_user', JSON.stringify({ username: found.username }));
                updateAuthUI(found.username);
                closeModal('loginModal');
            } else {
                alert("Invalid credentials");
            }
        });
    }

    // Manual Register
    const regForm = document.getElementById('registerForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const u = document.getElementById('reg-username').value;
            const p = document.getElementById('reg-password').value;
            
            const users = JSON.parse(localStorage.getItem('nexera_users')) || [];
            if (users.some(user => user.username === u)) {
                alert("User exists");
                return;
            }

            users.push({ username: u, password: p });
            localStorage.setItem('nexera_users', JSON.stringify(users));
            alert("Registered! Please login.");
            closeModal('registerModal');
            openModal('loginModal');
        });
    }

    function checkAuth() {
        const user = JSON.parse(localStorage.getItem('nexera_user'));
        if (user) updateAuthUI(user.username);
    }

    function updateAuthUI(username) {
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('username-display').innerText = username;
    }

    window.logout = function() {
        localStorage.removeItem('nexera_user');
        location.reload();
    };

    // --- 5. MODAL UTILS ---
    window.openModal = function(id) {
        document.getElementById(id).style.display = 'flex';
    };
    window.closeModal = function(id) {
        document.getElementById(id).style.display = 'none';
    };
    // Close modal on outside click
    window.onclick = function(e) {
        if (e.target.classList.contains('modal')) e.target.style.display = 'none';
    };
});
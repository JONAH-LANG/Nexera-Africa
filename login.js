document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PI NETWORK LOGIN LOGIC ---
    const piLoginBtn = document.getElementById('pi-login-btn');
    
    // Initialize Pi SDK (Replace with your actual App Key from Pi Network Platform)
    Pi.init({ version: "2.0", sandbox: true }); 

    piLoginBtn.addEventListener('click', async () => {
        try {
            // Authenticate with Pi
            const authResult = await Pi.authenticate(['username', 'payments'], {
                onComplete: function(payment) { console.log("Payment complete", payment) },
                onCancel: function(payment) { console.log("Payment cancelled", payment) },
                onError: function(error, payment) { console.log("Payment error", error, payment) }
            });

            // Mocking success for demo purposes since we have no backend
            const user = {
                username: authResult.user.username,
                uid: authResult.user.uid,
                accessToken: authResult.accessToken
            };

            // Save session
            localStorage.setItem('nexera_user', JSON.stringify(user));
            updateUI(user.username);
            closeModal('loginModal');
            alert(`Welcome, Pi User: ${user.username}!`);

        } catch (err) {
            console.error("Pi Login Failed", err);
            // Fallback for testing in non-Pi browser
            alert("Pi Browser not detected. (If testing on standard browser, this is expected behavior)");
        }
    });


    // --- 2. MANUAL LOGIN LOGIC ---
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userIn = document.getElementById('login-username').value;
        const passIn = document.getElementById('login-password').value;

        // Check LocalStorage
        const storedUsers = JSON.parse(localStorage.getItem('nexera_users')) || [];
        const foundUser = storedUsers.find(u => u.username === userIn && u.password === passIn);

        if (foundUser) {
            localStorage.setItem('nexera_user', JSON.stringify({ username: foundUser.username }));
            updateUI(foundUser.username);
            closeModal('loginModal');
            alert(`Login successful! Welcome ${foundUser.username}`);
        } else {
            alert("Invalid username or password.");
        }
    });


    // --- UI HELPER FUNCTIONS ---
    function updateUI(username) {
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('username-display').innerText = username;
    }

    // Check if already logged in on page load
    const currentUser = JSON.parse(localStorage.getItem('nexera_user'));
    if (currentUser) {
        updateUI(currentUser.username);
    }
});

// Global Logout function
function logout() {
    localStorage.removeItem('nexera_user');
    location.reload();
}
document.addEventListener('DOMContentLoaded', () => {

    const piLoginBtn = document.getElementById('pi-login-btn');

    Pi.init({ version: "2.0", sandbox: true });

    // --- PI LOGIN ---
    piLoginBtn.addEventListener('click', async () => {
        try {
            const authResult = await Pi.authenticate(['username', 'payments'], {});

            const user = {
                username: authResult.user.username,
                piUid: authResult.user.uid
            };

            localStorage.setItem('nexera_user', JSON.stringify(user));

            updateUI(user.username);
            closeModal('loginModal');

        } catch (err) {
            alert("Pi login failed");
        }
    });

    // --- MANUAL LOGIN (DB) ---
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('login-username').value;

        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username })
        });

        const data = await res.json();

        if (!data.success) {
            alert(data.error);
            return;
        }

        localStorage.setItem('nexera_user', JSON.stringify(data.user));

        updateUI(data.user.username);
        closeModal('loginModal');

        alert(`Welcome ${data.user.username}`);
    });

    function updateUI(username) {
        document.getElementById('auth-buttons').style.display = 'none';
        document.getElementById('user-info').style.display = 'flex';
        document.getElementById('username-display').innerText = username;
    }

    const currentUser = JSON.parse(localStorage.getItem('nexera_user'));
    if (currentUser) updateUI(currentUser.username);
});

function logout() {
    localStorage.removeItem('nexera_user');
    location.reload();
}
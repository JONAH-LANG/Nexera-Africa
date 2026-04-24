document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value;

        if (username.length < 3 || password.length < 4) {
            alert("Username must be 3+ chars and Password 4+ chars.");
            return;
        }

        // Get existing users
        const storedUsers = JSON.parse(localStorage.getItem('nexera_users')) || [];

        // Check if user exists
        if (storedUsers.some(user => user.username === username)) {
            alert("Username already exists!");
            return;
        }

        // Create new user object
        const newUser = {
            id: Date.now(),
            username: username,
            password: password // In a real app, never store plain text passwords!
        };

        // Save to LocalStorage
        storedUsers.push(newUser);
        localStorage.setItem('nexera_users', JSON.stringify(storedUsers));

        alert("Registration successful! Please login.");
        closeModal('registerModal');
        
        // Clear form
        registerForm.reset();
        
        // Open login modal automatically
        setTimeout(() => {
            document.getElementById('login-username').value = username;
            openModal('loginModal');
        }, 500);
    });
});
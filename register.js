document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('reg-username').value.trim();
        const userRole = document.getElementById('reg-role').value;

        if (username.length < 3) {
            alert("Username must be at least 3 characters.");
            return;
        }

        try {
            const scopes = ['username', 'payments'];

            // 👉 Use real Pi auth in production
            let piUid = "pi_simulated_" + username;

            /*
            const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
            piUid = auth.user.uid;
            */

            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    role: userRole,
                    piUid
                })
            });

            const data = await res.json();

            if (!data.success) {
                alert(data.error);
                return;
            }

            alert(`Registered as ${userRole}`);

            closeModal('registerModal');
            registerForm.reset();

            setTimeout(() => {
                openModal('loginModal');
            }, 500);

        } catch (error) {
            console.error(error);
            alert("Registration failed");
        }
    });
});

function onIncompletePaymentFound(payment) {
    console.log(payment);
}
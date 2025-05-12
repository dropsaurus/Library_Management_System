document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const baseUrl = window.location.origin + '/library_management/api';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        const payload = { email, password };

        try {
            const response = await fetch(`${baseUrl}/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('❌ Invalid JSON from login.php:', text);
                throw e;
            }

            if (data.status === 'success') {
                alert("✅ Login successful!");
                window.location.href = window.location.origin + '/library_management/' + data.redirect;

            } else {
                alert("❌ " + (data.message || 'Login failed.'));
            }

        } catch (err) {
            console.error('Login error:', err);
            alert("❌ Server error. Please try again later.");
        }
    });
});


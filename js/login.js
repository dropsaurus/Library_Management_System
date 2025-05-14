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
                credentials: 'include',
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
                localStorage.setItem('customer_id', data.user_id);
                localStorage.setItem('customer_fname', data.user_fname);
                localStorage.setItem('customer_lname', data.user_lname);

                const fullName = data.user_fname + ' ' + data.user_lname;
                localStorage.setItem('customer_name', fullName);
                alert("✅ Login successful!");

                // ✅ Safe redirect
                window.location.href = data.redirect;
            } else {
                alert("❌ " + (data.message || 'Login failed.'));
            }

        } catch (err) {
            console.error('Login error:', err);
            alert("❌ Server error. Please try again later.");
        }
    });
});

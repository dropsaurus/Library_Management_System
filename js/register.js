document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const baseUrl = window.location.origin + '/library_management/api';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const idType = document.getElementById('idType').value;
        const idNumber = document.getElementById('idNumber').value.trim();
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        if (!firstName || !lastName || !email || !phone || !idType || !idNumber || !password || !role) {
            alert("Please fill in all fields.");
            return;
        }

        const payload = {
            USER_FNAME: firstName,
            USER_LNAME: lastName,
            USER_EMAIL: email,
            USER_PHONE: phone,
            USER_UID_TYPE: idType,
            USER_UID_NO: idNumber,
            USER_PASSWORD: password,
            ROLE: role
        };

        try {
            const response = await fetch(`${baseUrl}/register.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('❌ Invalid JSON from register.php:', text);
                throw e;
            }

            if (data.status === 'success') {
                alert("✅ Registration successful! Redirecting to login page...");
                window.location.href = 'login.html';
            } else {
                alert("❌ Registration failed: " + data.message + "\nPlease check and try again.");
            }

        } catch (error) {
            console.error('Error registering user:', error);
            alert("❌ Server error. Please try again later.");
        }
    });
});
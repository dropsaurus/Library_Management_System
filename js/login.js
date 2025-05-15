document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const baseUrl = '../api';

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
            console.log('Sending login request with:', payload);
            
            const response = await fetch(`${baseUrl}/login.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const text = await response.text();
            console.log('Raw response:', text);
            
            let data;

            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('❌ Invalid JSON from login.php:', text);
                throw e;
            }

            console.log('Login response data:', data);

            if (data.status === 'success') {
                
                localStorage.setItem('user_id', data.user_id);
                localStorage.setItem('user_fname', data.user_fname);
                localStorage.setItem('user_lname', data.user_lname);
                localStorage.setItem('user_role', data.role);
                
                // Store additional user flags
                if (data.is_author !== undefined) {
                    localStorage.setItem('is_author', data.is_author);
                }
                if (data.is_sponsor !== undefined) {
                    localStorage.setItem('is_sponsor', data.is_sponsor);
                }

                const fullName = data.user_fname + ' ' + data.user_lname;
                localStorage.setItem('user_name', fullName);
                
                // Use the redirect URL from the server response with better logging and fallback
                if (data.redirect) {
                    console.log('Redirecting to:', data.redirect);
                    
                    // Make sure we're using the correct path format
                    let redirectPath = data.redirect;
                    if (!redirectPath.startsWith('/') && !redirectPath.startsWith('../')) {
                        // Make sure we're using a relative path
                        redirectPath = redirectPath.startsWith('pages/') ? '../' + redirectPath : redirectPath;
                    }
                    
                    console.log('Normalized redirect path:', redirectPath);
                    window.location.href = redirectPath;
                } else {
                    // Fallback based on role if no redirect provided
                    console.log('No redirect provided, falling back to role-based redirect');
                    const roleRedirects = {
                        'EMPLOYEE': '../pages/employee_dashboard.html',
                        'AUTHOR': '../pages/author_dashboard.html',
                        'CUSTOMER': '../pages/customer_dashboard.html'
                    };
                    
                    const redirectUrl = roleRedirects[data.role] || '../pages/customer_dashboard.html';
                    console.log('Role-based redirect to:', redirectUrl);
                    window.location.href = redirectUrl;
                }
            } else {
                alert("❌ " + (data.message || 'Login failed.'));
            }

        } catch (err) {
            console.error('Login error:', err);
            alert("❌ Server error. Please try again later.");
        }
    });
});

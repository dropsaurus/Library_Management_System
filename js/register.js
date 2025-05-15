document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded - initializing form');
    
    const form = document.getElementById('registrationForm') || document.querySelector('form');
    const baseUrl = '../api';
    const roleSelect = document.getElementById('role');
    const commonFields = document.getElementById('commonFields');
    const customerFields = document.getElementById('customerFields');
    const authorFields = document.getElementById('authorFields');
    const passwordSection = document.getElementById('passwordSection');

    // Log all elements to check if they're found
    console.log('Form element:', form);
    console.log('Role select:', roleSelect);
    console.log('Common fields:', commonFields);
    console.log('Customer fields:', customerFields);
    console.log('Author fields:', authorFields);
    console.log('Password section:', passwordSection);

    // Initially hide all fields except role selection
    if (commonFields) commonFields.style.display = 'none';
    if (customerFields) customerFields.style.display = 'none';
    if (authorFields) authorFields.style.display = 'none';
    if (passwordSection) passwordSection.style.display = 'none';

    // Toggle display of fields based on role selection
    if (roleSelect) {
        console.log('Adding change event listener to role select');
        
        roleSelect.addEventListener('change', function() {
            console.log('Role changed to:', this.value);
            const selectedRole = this.value;
            
            if (selectedRole === '') {
                // Hide all sections if no role is selected
                console.log('No role selected, hiding all fields');
                if (commonFields) commonFields.style.display = 'none';
                if (customerFields) customerFields.style.display = 'none';
                if (authorFields) authorFields.style.display = 'none';
                if (passwordSection) passwordSection.style.display = 'none';
                return;
            }
            
            // Always show common fields and password section when a role is selected
            console.log('Showing common fields and password section');
            if (commonFields) commonFields.style.display = 'block';
            if (passwordSection) passwordSection.style.display = 'block';
            
            if (selectedRole === 'customer') {
                console.log('Customer selected, showing customer fields, hiding author fields');
                if (customerFields) customerFields.style.display = 'block';
                if (authorFields) authorFields.style.display = 'none';
                
                // Make customer fields required
                const idType = document.getElementById('idType');
                const idNumber = document.getElementById('idNumber');
                if (idType) idType.setAttribute('required', '');
                if (idNumber) idNumber.setAttribute('required', '');
                
                // Make author fields not required
                const street = document.getElementById('street');
                const city = document.getElementById('city');
                const state = document.getElementById('state');
                const country = document.getElementById('country');
                const zipcode = document.getElementById('zipcode');
                
                if (street) street.removeAttribute('required');
                if (city) city.removeAttribute('required');
                if (state) state.removeAttribute('required');
                if (country) country.removeAttribute('required');
                if (zipcode) zipcode.removeAttribute('required');
            } 
            else if (selectedRole === 'author') {
                console.log('Author selected, showing author fields, hiding customer fields');
                if (customerFields) customerFields.style.display = 'none';
                if (authorFields) authorFields.style.display = 'block';
                
                // Make author fields required
                const street = document.getElementById('street');
                const city = document.getElementById('city');
                const state = document.getElementById('state');
                const country = document.getElementById('country');
                const zipcode = document.getElementById('zipcode');
                
                if (street) street.setAttribute('required', '');
                if (city) city.setAttribute('required', '');
                if (state) state.setAttribute('required', '');
                if (country) country.setAttribute('required', '');
                if (zipcode) zipcode.setAttribute('required', '');
                
                // Make customer fields not required
                const idType = document.getElementById('idType');
                const idNumber = document.getElementById('idNumber');
                if (idType) idType.removeAttribute('required');
                if (idNumber) idNumber.removeAttribute('required');
            }
        });
    } else {
        console.error('Role select element not found!');
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submitted');

            const firstName = document.getElementById('firstName')?.value.trim() || '';
            const lastName = document.getElementById('lastName')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const phone = document.getElementById('phone')?.value.trim() || '';
            const password = document.getElementById('password')?.value || '';
            const role = document.getElementById('role')?.value || '';

            console.log('Submitted values:', { firstName, lastName, email, phone, role });

            if (!firstName || !lastName || !email || !phone || !password || !role) {
                alert("Please fill in all required fields.");
                return;
            }

            let payload;
            let endpoint = `${baseUrl}/register.php`;

            if (role === 'customer') {
                const idType = document.getElementById('idType')?.value || '';
                const idNumber = document.getElementById('idNumber')?.value.trim() || '';
                
                if (!idType || !idNumber) {
                    alert("Please fill in all customer fields.");
                    return;
                }
                
                payload = {
                    USER_FNAME: firstName,
                    USER_LNAME: lastName,
                    USER_EMAIL: email,
                    USER_PHONE: phone,
                    USER_PASSWORD: password,
                    USER_UID_TYPE: idType,
                    USER_UID_NO: idNumber,
                    ROLE: role
                };
            } 
            else if (role === 'author') {
                const street = document.getElementById('street')?.value.trim() || '';
                const city = document.getElementById('city')?.value.trim() || '';
                const state = document.getElementById('state')?.value.trim() || '';
                const country = document.getElementById('country')?.value.trim() || '';
                const zipcode = document.getElementById('zipcode')?.value.trim() || '';
                
                if (!street || !city || !state || !country || !zipcode) {
                    alert("Please fill in all author fields.");
                    return;
                }

                payload = {
                    USER_FNAME: firstName,
                    USER_LNAME: lastName,
                    USER_EMAIL: email,
                    USER_PHONE: phone,
                    USER_PASSWORD: password,
                    USER_STREET: street,
                    USER_CITY: city,
                    USER_STATE: state,
                    USER_COUNTRY: country,
                    USER_ZIPCODE: zipcode,
                    ROLE: role
                };
                endpoint = `${baseUrl}/register_author.php`;
            }

            try {
                console.log('Sending request to:', endpoint);
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const text = await response.text();
                console.log('Response text:', text);

                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error('❌ Invalid JSON response:', text);
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
    } else {
        console.error('Form element not found!');
    }
    
    // Run role selection once if a role is already selected
    if (roleSelect && roleSelect.value) {
        console.log('Role already selected, triggering change event');
        const event = new Event('change');
        roleSelect.dispatchEvent(event);
    }
});
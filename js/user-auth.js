/**
 * User Authentication Utilities
 */

// Function to get and display the logged-in user's name
function displayUserName() {
  const userElement = document.getElementById('username-btn');
  if (!userElement) return;

  // Show loading state
  userElement.textContent = 'Loading...';

  // First try to get user info from localStorage
  // This is the data format used by the existing login system
  const userId = localStorage.getItem('user_id');
  const userFname = localStorage.getItem('user_fname');
  const userLname = localStorage.getItem('user_lname');
  
  if (userId && (userFname || userLname)) {
    // Format name from existing localStorage data
    let fullName = '';
    if (userFname) fullName += userFname;
    if (userLname) fullName = fullName ? `${fullName} ${userLname}` : userLname;
    
    userElement.textContent = fullName || 'Customer';
    return;
  }
  
  // If not found in localStorage format, try our API
  fetch('../api/get_user_info.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (data.status === 'success') {
        // Set the username
        userElement.textContent = data.user.name;
        
        // Store user info in localStorage for persistence
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // If error, check for our stored user format
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.name) {
          userElement.textContent = storedUser.name;
        } else {
          userElement.textContent = 'Guest';
        }
      }
    })
    .catch(error => {
      console.error('Error fetching user info:', error);
      userElement.textContent = 'Customer';
    });
}

// Function to sign out
function signOut() {
  // Clear localStorage (both formats)
  localStorage.removeItem('user');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_fname');
  localStorage.removeItem('user_lname');
  localStorage.removeItem('user_role');
  localStorage.removeItem('is_author');
  localStorage.removeItem('is_sponsor');
  
  // Call the logout API
  fetch('../api/logout.php')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error signing out:', error);
    })
    .finally(() => {
      // Always redirect to index page
      window.location.href = '../index.html';
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Display username when page loads
  displayUserName();
  
  // Prevent username button from navigating
  const usernameLink = document.getElementById('username-btn');
  if (usernameLink) {
    usernameLink.addEventListener('click', function(e) {
      e.preventDefault();
    });
  }
  
  // Add click event listener to sign out link if it exists
  const signOutLink = document.querySelector('.dropdown-content a.sign-out');
  if (signOutLink) {
    // Remove any existing onclick
    signOutLink.removeAttribute('onclick');
    
    // Add event listener
    signOutLink.addEventListener('click', function(e) {
      e.preventDefault();
      signOut();
    });
  }
}); 
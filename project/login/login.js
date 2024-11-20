// JavaScript for handling the login logic
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting
  
    // Get the entered values (you can also validate the username and password here)
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Example: Simulate login validation (You can replace this with real validation logic)
    if (username || password) {  // If either username or password is entered
      // Redirect to the seller dashboard
      window.location.href = '../sellerDash.html';
    } else {
      // Optional: Alert or handle case when both fields are empty
      alert('Please enter at least one field (username or password) to log in.');
    }
  });
  
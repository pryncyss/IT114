document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Get the entered values (you can also validate the username and password here)
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Retrieve stored user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));

  // Validate if the entered credentials match the stored user data
  if (storedUser) {
    if ((storedUser.email === username || storedUser.name === username) && storedUser.password === password) {
      // Redirect to the appropriate dashboard based on the role
      if (storedUser.role === 'buyer') {
        window.location.href = '../buyerDash.html'; // Redirect to buyer dashboard
      } else if (storedUser.role === 'seller') {
        window.location.href = '../sellerDash.html'; // Redirect to seller dashboard
      }
    } else {
      alert('Invalid credentials. Please try again.');
    }
  } else {
    alert('No registered user found. Please register first.');
  }
});

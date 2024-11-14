function toggleDropdown() {
    const dropdown = document.getElementById('dropdown');
    dropdown.classList.toggle('show'); 
  }
  
  // Function to handle the role selection
  function selectRole(role) {
    if (role === 'Admin') {
      window.location.href = 'loginAd.html'; 
    } else if (role === 'Seller') {
      window.location.href = 'loginSeller.html'; 
    } else if (role === 'Buyer') {
      window.location.href = 'loginBuyer.html'; 
    }
    document.getElementById('dropdown').classList.remove('show');
  }
  
  function navigateToLandingPage() {
    window.location.href = '../landing.html'; 
  }
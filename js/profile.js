// Check if user data exists in local storage
document.addEventListener("DOMContentLoaded", function() {
    var user = JSON.parse(localStorage.getItem("user"));
    
    if (user) {
        // Set user profile data
        document.getElementById("userName").textContent = user.emp_name;
        document.getElementById("userEmail").textContent = user.emp_mail;
        document.getElementById("userID").textContent = "DAA" + String(user.emp_id).padStart(3, "0"); // Format ID with prefix
        document.getElementById("userNumber").textContent = "012-345-6789"; // Placeholder; update if needed
        document.getElementById("userRole").textContent = user.emp_role;

        // Set other details (you can update these values based on what you need)
        document.getElementById("userDaysTook").textContent = "5"; // Update with actual data if available
        document.getElementById("userDaysLeft").textContent = "16"; // Update with actual data if available
        document.getElementById("userHoursTook").textContent = "2"; // Update with actual data if available
        document.getElementById("userHoursLeft").textContent = "2"; // Update with actual data if available
    } else {
        // Redirect to login if no user is found
        alert("No user data found. Redirecting to login page.");
        window.location.href = "../login.html"; // Update with your actual login page path
    }
});

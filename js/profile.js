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



// Get elements for user info and leave/excuse data
var userName = document.getElementById("userName");
var userPosition = document.getElementById("userPosition");
var userEmail = document.getElementById("userEmail");
var daysTookEl = document.getElementById("daysTook");
var daysLeftEl = document.getElementById("daysLeft");
var hoursTookEl = document.getElementById("hoursTook");
var hoursLeftEl = document.getElementById("hoursLeft");

// Fetch user info from local storage
function loadUserInfo() {
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
        userName.textContent = userInfo.name || "Ahmed Hany"; // default name
        userPosition.textContent = userInfo.position || "Position";
        userEmail.textContent = userInfo.email || "email@example.com";
    }
}

// Fetch leave and excuse data
function loadLeaveData() {
    var leaveData = JSON.parse(localStorage.getItem("allleaves")) || [];
    var totalAnnualLeave = 21;
    var totalPersonalExcuseHours = 4;

    var daysTook = leaveData.reduce((total, leave) => {
        return leave.leaveType === "annual" ? total + calculateDays(leave.startLeave, leave.endLeave) : total;
    }, 0);

    var hoursTook = leaveData.reduce((total, leave) => {
        return leave.leaveType === "personal" ? total + calculateHours(leave.startLeave, leave.endLeave) : total;
    }, 0);

    // Set Days Took
    daysTookEl.textContent = daysTook || 21;
    var daysLeft = totalAnnualLeave - daysTook;
    daysLeftEl.textContent = daysLeft;
    updatePercentage(daysTookEl, daysLeftEl, totalAnnualLeave);

    // Set Hours Took
    hoursTookEl.textContent = hoursTook || 4;
    var hoursLeft = totalPersonalExcuseHours - hoursTook;
    hoursLeftEl.textContent = hoursLeft;
    updatePercentage(hoursTookEl, hoursLeftEl, totalPersonalExcuseHours);
}

// Helper function to calculate days between two dates
function calculateDays(start, end) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    var timeDiff = Math.abs(endDate - startDate);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

// Helper function to calculate hours between two times on the same day
function calculateHours(start, end) {
    var startTime = new Date("1970-01-01T" + start + "Z");
    var endTime = new Date("1970-01-01T" + end + "Z");
    var timeDiff = Math.abs(endTime - startTime);
    return Math.ceil(timeDiff / (1000 * 60 * 60));
}

// Helper function to update percentages
function updatePercentage(tookEl, leftEl, total) {
    var took = parseInt(tookEl.textContent);
    var left = parseInt(leftEl.textContent);
    var tookPercentage = ((took / total) * 100).toFixed(1);
    var leftPercentage = ((left / total) * 100).toFixed(1);

    // Display the percentage change as needed
    var tookBadge = tookEl.parentNode.querySelector(".badge");
    tookBadge.textContent = tookPercentage + "%";
    tookBadge.classList.toggle("text-success", tookPercentage > 0);
    tookBadge.classList.toggle("text-danger", tookPercentage < 0);
    
    var leftBadge = leftEl.parentNode.querySelector(".badge");
    leftBadge.textContent = leftPercentage + "%";
    leftBadge.classList.toggle("text-success", leftPercentage > 0);
    leftBadge.classList.toggle("text-danger", leftPercentage < 0);
}

// Initialize user info and leave data
loadUserInfo();
loadLeaveData();

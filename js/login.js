// Initialize employee data
function initializeEmployees() {
    if (!localStorage.getItem("employees")) {
        const employees = [
            {
                emp_id: 1,
                emp_mail: "jane.doe@example.com",
                emp_name: "Jane Doe",
                emp_gender: "Female",
                emp_role: "CTO",
                senior_id: null,
                emp_password: CryptoJS.SHA256("securePass123").toString(),
            },
            {
                emp_id: 2,
                emp_mail: "john.smith@example.com",
                emp_name: "John Smith",
                emp_gender: "Male",
                emp_role: "HR",
                senior_id: 1,
                emp_password: CryptoJS.SHA256("password456").toString(),
            },
        ];
        localStorage.setItem("employees", JSON.stringify(employees));
        console.log("Employee data has been added to local storage.");
    }
}

// Function to validate login
function validate(event) {
    event.preventDefault();

    // Get input values
    const empId = parseInt(document.getElementById("emp_id").value);
    const empPassword = CryptoJS.SHA256(
        document.getElementById("emp_password").value
    ).toString();

    // Retrieve employees array from local storage
    const employees = JSON.parse(localStorage.getItem("employees")) || [];

    // Find user by emp_id
    const user = employees.find((emp) => emp.emp_id === empId);

    // Validate credentials
    if (user && user.emp_password === empPassword) {
        localStorage.setItem("user", JSON.stringify(user));

        // Role-based redirection
        switch (user.emp_role) {
            case "CTO":
                window.location.href = "../admin.html";
                break;
            case "HR":
                window.location.href = "../hr_homepage.html";
                break;
            case "Senior":
                window.location.href = "../emp_homepage.html";
                break;
            default:
                window.location.href = "../emp_homepage.html";
        }
    } else {
        alert("Invalid ID or Password");
    }
}

// Ensure DOM is loaded before executing functions
document.addEventListener("DOMContentLoaded", () => {
    initializeEmployees();
    document.getElementById("loginform").addEventListener("submit", validate);
});

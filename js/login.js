
// Function to validate login
function validate(event) {
    event.preventDefault();  // Prevent form from submitting traditionally

    // Get input values
    var empId = parseInt(document.getElementById("emp_id").value);  // Parse to integer
    var empPassword = document.getElementById("emp_password").value;

    // Retrieve the employees array from local storage
    var employees = JSON.parse(localStorage.getItem("employees")) || [];

    // Find the employee by emp_id
    var user = employees.find(emp => emp.emp_id === empId);

    // Validate user credentials
    if (user) {
        if (user.emp_password === empPassword) {
            // Store the logged-in user data in local storage
            localStorage.setItem('user', JSON.stringify(user));
            // Redirect to employee homepage
            window.location.href = "../emp_homepage.html";
        } else {
            alert("Incorrect password");
        }
    } else {
        alert("User not found");
    }
}

// Attach the validate function to the form's submit event
document.getElementById("loginform").addEventListener("submit", validate);


// Define employee data and store it if not already stored
if (!localStorage.getItem("employees")) {
    const employees = [
        {
            emp_id: 1,
            emp_mail: "jane.doe@example.com",
            emp_name: "Jane Doe",
            emp_gender: "Female",
            emp_role: "CTO",
            senior_id: null,
            emp_password: "securePass123"
        },
        {
            emp_id: 2,
            emp_mail: "john.smith@example.com",
            emp_name: "John Smith",
            emp_gender: "Male",
            emp_role: "HR",
            senior_id: 1,
            emp_password: "password456"
        },
        {
            emp_id: 3,
            emp_mail: "alice.jones@example.com",
            emp_name: "Alice Jones",
            emp_gender: "Female",
            emp_role: "Senior",
            senior_id: 1,
            emp_password: "alicePass789"
        },
        {
            emp_id: 4,
            emp_mail: "bob.brown@example.com",
            emp_name: "Bob Brown",
            emp_gender: "Male",
            emp_role: "Jr",
            senior_id: 3,
            emp_password: "bobPassword321"
        }
    ];

    // Store data in local storage
    localStorage.setItem("employees", JSON.stringify(employees));
    console.log("Employee data has been added to local storage.");
}



// // Initialize validate function
// window.onload = validate;


// // Initialize employee data
// function initializeEmployees() {
//     if (!localStorage.getItem("employees")) {
//         const employees = [
//             {
//                 emp_id: 1,
//                 emp_mail: "jane.doe@example.com",
//                 emp_name: "Jane Doe",
//                 emp_gender: "Female",
//                 emp_role: "CTO",
//                 senior_id: null,
//                 emp_password: CryptoJS.SHA256("securePass123").toString(),
//             },
//             {
//                 emp_id: 2,
//                 emp_mail: "john.smith@example.com",
//                 emp_name: "John Smith",
//                 emp_gender: "Male",
//                 emp_role: "HR",
//                 senior_id: 1,
//                 emp_password: CryptoJS.SHA256("password456").toString(),
//             },
//         ];
//         localStorage.setItem("employees", JSON.stringify(employees));
//         console.log("Employee data has been added to local storage.");
//     }
// }

// // Function to validate login
// function validate(event) {
//     event.preventDefault();

//     // Get input values
//     const empId = parseInt(document.getElementById("emp_id").value);
//     const empPassword = CryptoJS.SHA256(
//         document.getElementById("emp_password").value
//     ).toString();

//     // Retrieve employees array from local storage
//     const employees = JSON.parse(localStorage.getItem("employees")) || [];

//     // Find user by emp_id
//     const user = employees.find((emp) => emp.emp_id === empId);

//     // Validate credentials
//     if (user && user.emp_password === empPassword) {
//         localStorage.setItem("user", JSON.stringify(user));

//         // Role-based redirection
//         switch (user.emp_role) {
//             case "CTO":
//                 window.location.href = "../admin.html";
//                 break;
//             case "HR":
//                 window.location.href = "../hr_homepage.html";
//                 break;
//             case "Senior":
//                 window.location.href = "../emp_homepage.html";
//                 break;
//             default:
//                 window.location.href = "../emp_homepage.html";
//         }
//     } else {
//         alert("Invalid ID or Password");
//     }
// }

// // Ensure DOM is loaded before executing functions
// document.addEventListener("DOMContentLoaded", () => {
//     initializeEmployees();
//     document.getElementById("loginform").addEventListener("submit", validate);
// });




// // Initialize Supabase
// const supabaseUrl = 'https://dxblwqbhivsknboudwwz.supabase.co';  // Replace with your Supabase URL
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4Ymx3cWJoaXZza25ib3Vkd3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNjkxNDgsImV4cCI6MjA0ODc0NTE0OH0.wMw7eXHp-UssIW5OUbKDtb31hzscrZPjfuuLIuCO4uM';  // Replace with your Supabase anon key
// const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// // Function to validate login
// async function validate(event) {
//     event.preventDefault();

//     // Get input values
//     const userCode = document.getElementById("emp_id").value;
//     const empPassword = CryptoJS.SHA256(
//         document.getElementById("emp_password").value
//     ).toString();

//     // Query Supabase for user data
//     const { data: users, error } = await supabase
//         .from('users')  // Query the 'users' table
//         .select('*')
//         .eq('user_code', userCode);  // Fetch by user_code

//     if (error) {
//         console.error('Error fetching data from Supabase:', error.message);
//         alert("An error occurred while validating the credentials.");
//         return;
//     }

//     // If user is found
//     if (users && users.length > 0) {
//         const user = users[0]; // The first (and should be the only) result

//         // Validate password
//         if (user.password_hash === empPassword) {
//             // Store user data in local storage
//             localStorage.setItem("user", JSON.stringify(user));

//             // Role-based redirection
//             switch (user.role) {
//                 case "Admin":
//                     window.location.href = "../admin.html";
//                     break;
//                 case "Senior":
//                     window.location.href = "../senior_homepage.html";
//                     break;
//                 case "Hr":
//                     window.location.href = "../hr_homepage.html";
//                     break;
//                 default:
//                     window.location.href = "../employee_homepage.html";
//             }
//         } else {
//             alert("Invalid password");
//         }
//     } else {
//         alert("User not found");
//     }
// }

// // Ensure DOM is loaded before executing functions
// document.addEventListener("DOMContentLoaded", () => {
//     document.getElementById("loginform").addEventListener("submit", validate);
// });


    // Supabase API URL and key
const supabaseUrl = 'https://dxblwqbhivsknboudwwz.supabase.co';  // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4Ymx3cWJoaXZza25ib3Vkd3d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNjkxNDgsImV4cCI6MjA0ODc0NTE0OH0.wMw7eXHp-UssIW5OUbKDtb31hzscrZPjfuuLIuCO4uM'; 
 const supabase = supabase.createClient(supabaseUrl, supabaseKey);


 document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Query Supabase to fetch user based on email
            const { data: users, error } = await supabase
                .from('users') // Ensure 'users' is the correct table
                .select('*')
                .eq('email', email);

            if (error) {
                throw new Error(`Error fetching data: ${error.message}`);
            }

            if (users.length === 0) {
                throw new Error('User not found');
            }

            const user = users[0];

            // Compare the password with the stored hash (you will need to hash it like the one stored in the database)
            // Assuming you are using a hashing library like CryptoJS to hash the input password
            const inputPasswordHash = CryptoJS.SHA256(password).toString();

            if (user.password_hash === inputPasswordHash) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    user_code: user.user_code,  // Ensure user_code is included
                    code: user.code  // You might need the 'code' field, if it's important
                }));

                // Redirect based on user role
                switch (user.role) {
                    case 'CTO':
                    case 'Admin':
                        window.location.href = 'admin_homePage.html';  // Redirect to admin page
                        break;
                    case 'HR':
                        window.location.href = 'hr_homePage.html';  // Redirect to HR page
                        break;
                    case 'Senior':
                        window.location.href = 'emp_homePage.html';  // Redirect to Senior employee page
                        break;
                    case 'Employee':
                        window.location.href = 'emp_homePage.html';  // Redirect to employee page
                        break;
                    default:
                        throw new Error('Unknown user role');
                }
            } else {
                throw new Error('Invalid password');
            }
        } catch (error) {
            // Display error message
            const errorMessageElement = document.getElementById('errorMessage');
            if (errorMessageElement) {
                errorMessageElement.textContent = error.message;
            } else {
                console.error('Error message element not found');
            }
        }
    });
});


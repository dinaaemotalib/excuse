import { getUserByEmail } from "../controller/User.js";
import { ROLE_CO, ROLE_EMPLOYEE, ROLE_HR, ROLE_SENIOR } from "../utils/constants.js";

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("emp_email").value;
    const password = document.getElementById("emp_password").value;

    try {
      // Query Supabase to fetch user based on email
      const user = await getUserByEmail(email);

      if (user.password_hash === password) {
        // Store user data in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: user.name,
            email: user.email,
            role: user.role,
            user_code: user.user_code, // Ensure user_code is included
            code: user.code, // You might need the 'code' field, if it's important
          })
        );

        // Redirect based on user role
        switch (user.role) {
          case ROLE_CO:
            window.location.href = "admin.html"; // Redirect to admin page
            break;
          case ROLE_HR:
            window.location.href = "hr_homepage.html"; // Redirect to HR page
            break;
          case ROLE_SENIOR:
          case ROLE_EMPLOYEE:
            window.location.href = "emp_homepage.html"; // Redirect to Senior employee page
            break;
          default:
            throw new Error("Unknown user role");
        }
      } else {
        throw new Error("Invalid password");
      }
    } catch (error) {
      // Display error message
      const errorMessageElement = document.getElementById("errorMessage");
      if (errorMessageElement) {
        errorMessageElement.textContent = error.message;
      } else {
        console.log(error);
      }
    }
  });
});

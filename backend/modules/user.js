import { ROLE_EMPLOYEE, ROLE_HR } from "../utils/constants.js";
import { LOGGING_USER } from "../utils/global.js";

document.addEventListener("DOMContentLoaded", async function () {
  if (LOGGING_USER === null) {
    window.location.href = "loginform.html";
  }

  if (LOGGING_USER.role === ROLE_EMPLOYEE || LOGGING_USER.role === ROLE_HR) {
    document.getElementById("bell-notification-icon").style.display = "none";
  }
  document.getElementById("emp-name").innerHTML = `Hello ${LOGGING_USER.name}`;
  document.getElementById("emp-role").innerHTML = LOGGING_USER.role;
});

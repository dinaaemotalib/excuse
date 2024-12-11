import { getAllUsers } from "../controller/User.js";
import { ROLE_CO, ROLE_EMPLOYEE, ROLE_HR, ROLE_SENIOR } from "../utils/constants.js";
import { LOGGING_USER } from "../utils/global.js";

const excuseRequestSelectOption = document.getElementById("excuseRequestSelectOption");
const leaveRequestSelectOption = document.getElementById("leaveRequestSelectOption");

document.addEventListener("DOMContentLoaded", async function () {
  // Fill In Seniors and coFoudners that accepts excuse/leave
  let seniors;
  let coFounders;
  let employees;
  let hr;
  try {
    const users = await getAllUsers();
    seniors = users.filter((user, i) => user.role === ROLE_SENIOR);
    coFounders = users.filter((user, i) => user.role === ROLE_CO);
    employees = users.filter((user, i) => user.role === ROLE_EMPLOYEE);
    hr = users.filter((user, i) => user.role === ROLE_HR);
  } catch (error) {
    console.log("Failed to fetch All users' names");
    console.log(error);
  }

  if (LOGGING_USER === null) {
    window.location.href = "loginform.html";
  }
  if (LOGGING_USER.role === ROLE_EMPLOYEE) {
    let options = `<option value="" disabled selected>Choose your senior</option>`;
    seniors.forEach((senior) => {
      options += `<option value=${senior.user_code}>${senior.name}</option>`;
    });
    excuseRequestSelectOption.innerHTML += options;
    leaveRequestSelectOption.innerHTML += options;
  }
  if (LOGGING_USER.role === ROLE_SENIOR) {
    let options = `<option value="" disabled selected>Choose your CO</option>`;
    coFounders.forEach((coFounder) => {
      options += `<option value=${coFounder.user_code}>${coFounder.name}</option>`;
    });
    excuseRequestSelectOption.innerHTML += options;
    leaveRequestSelectOption.innerHTML += options;
  }
});

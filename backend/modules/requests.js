// Functions
import { postNewExcuse } from "../controller/Excuse.js";
import { postNewLeave } from "../controller/Leave.js";
import { getAllUsers } from "../controller/User.js";
import { EXCUSE_TYPE_PERSONAL, ROLE_CO, ROLE_EMPLOYEE, ROLE_HR, ROLE_SENIOR } from "../utils/constants.js";
import { LOGGING_USER } from "../utils/global.js";
// Variables

import { isLeaveNotPassingMax, isValidDate, isValidExcuseTime } from "../utils/validation.js";

// ---------------

// Excuse Form Values
let excuseType = document.getElementById("excuseType");
let excuseDate = document.getElementById("excuseDate");
let startexcuse = document.getElementById("fromTime");
let endexcuse = document.getElementById("toTime");
let excuseReason = document.getElementById("excuseReason");
let excuseApprovalCode = document.getElementById("excuseRequestSelectOption");
// Leave Form Values
let leaveType = document.getElementById("leaveType");
let startLeave = document.getElementById("startLeave");
let endLeave = document.getElementById("endLeave");
let leaveReason = document.getElementById("leaveReason");
let leaveApprovalCode = document.getElementById("leaveRequestSelectOption");

document.addEventListener("DOMContentLoaded", async function () {
  let seniors;
  let coFounders;
  try {
    const users = await getAllUsers();
    console.log("users:", users);
    seniors = users.filter((user) => user.role === ROLE_SENIOR);
    coFounders = users.filter((user) => user.role === ROLE_CO);
  } catch (error) {
    console.log("Failed to fetch All users' names");
    console.log(error);
  }

  // ---

  if (LOGGING_USER.role === ROLE_EMPLOYEE) {
    let options = `<option value="" disabled selected>Choose your senior</option>`;
    seniors.forEach((senior) => {
      options += `<option value=${senior.user_code}>${senior.name}</option>`;
    });
    excuseRequestSelectOption.innerHTML += options;
    leaveRequestSelectOption.innerHTML += options;
  }
  if (LOGGING_USER.role === ROLE_SENIOR || LOGGING_USER.role === ROLE_HR) {
    let options = `<option value="" disabled selected>Choose your CO</option>`;
    coFounders.forEach((coFounder) => {
      options += `<option value=${coFounder.user_code}>${coFounder.name}</option>`;
    });
    excuseRequestSelectOption.innerHTML += options;
    leaveRequestSelectOption.innerHTML += options;
  }

  document.getElementById("excusebtn").addEventListener("click", async () => {
    if (
      excuseType.value === "" ||
      excuseDate.value === "" ||
      startexcuse.value === "" ||
      endexcuse.value === "" ||
      excuseApprovalCode.value === ""
    ) {
      alert("Please, fill out all fields");
      return;
    }
    const isDateValid = isValidDate(excuseDate.value);
    if (!isDateValid) {
      alert("Date Can't be in the past");
      return;
    }
    const { isValid, message } = isValidExcuseTime(startexcuse.value, endexcuse.value);
    if (!isValid && excuseType.value === EXCUSE_TYPE_PERSONAL) {
      alert(message);
      return;
    }
    await postNewExcuse(
      excuseType.value,
      excuseDate.value,
      startexcuse.value,
      endexcuse.value,
      excuseReason.value,
      excuseApprovalCode.value
    );

    excuseclearform();
  });

  // Make new Leave
  document.getElementById("leavebtn").addEventListener("click", async () => {
    if (leaveType.value === "" || startLeave.value === "" || endLeave.value === "" || leaveApprovalCode.value === "") {
      console.log("leaveType.value: ", leaveType.value);
      console.log("startLeave.value: ", startLeave.value);
      console.log("endLeave.value: ", endLeave.value);
      console.log("leaveApprovalCode.value: ", leaveApprovalCode.value);
      alert("Please, fill out all fields");
      return;
    }

    const isDateValid = isValidDate(startLeave.value);
    if (!isDateValid) {
      alert("Date Can't be in the past");
      return;
    }
    const { isValid: isValidDuration, message } = isLeaveNotPassingMax(
      startLeave.value,
      endLeave.value,
      leaveType.value
    );
    console.log("isValidDuration:", isValidDuration);
    if (!isValidDuration) {
      alert(message);
      return;
    }

    await postNewLeave(leaveType.value, startLeave.value, endLeave.value, leaveReason.value, leaveApprovalCode.value);

    leaveClearform();
  });
});

// utils
function excuseclearform() {
  excuseType.value = null;
  excuseDate.value = null;
  startexcuse.value = null;
  endexcuse.value = null;
  excuseReason.value = null;
  excuseApprovalCode.value = null;
}

function leaveClearform() {
  leaveType.value = null;
  startLeave.value = null;
  endLeave.value = null;
  leaveReason.value = null;
  leaveApprovalCode.value = null;
}

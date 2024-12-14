// Functions
import { postNewExcuse } from "../controller/Excuse.js";
import { postNewLeave } from "../controller/Leave.js";
// Variables

import { isValidDate, isValidExcuseTime } from "../utils/validation.js";

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
    if (!isValid) {
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
      alert("Please, fill out all fields");
      return;
    }

    const isDateValid = isValidDate(startLeave.value);
    if (!isDateValid) {
      alert("Date Can't be in the past");
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

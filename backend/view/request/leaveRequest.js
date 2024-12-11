import { postNewLeave } from "../../controller/Leave.js";

//all inputs
let leaveType = document.getElementById("leaveType");
let startLeave = document.getElementById("startLeave");
let endLeave = document.getElementById("endLeave");
let leaveReason = document.getElementById("leaveReason");
let leaveApprovalCode = document.getElementById("leaveRequestSelectOption");

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("leavebtn").addEventListener("click", async () => {
    // if (
    //   leaveType.value === "" ||
    //   startLeave.value === "" ||
    //   endLeave.value === "" ||
    //   leaveApprovalCode.value === ""
    // ) {
    //   alert("Please, fill out all fields");
    //   return;
    // }

    await postNewLeave(excuseType.value, startLeave.value, endLeave.value, leaveReason.value, leaveApprovalCode.value);

    // displayRequests();
    //clear the form
    leaveClearform();
  });
});

function leaveClearform() {
  leaveType.value = null;
  startLeave.value = null;
  endLeave.value = null;
  leaveReason.value = null;
  leaveApprovalCode.value = null;
}

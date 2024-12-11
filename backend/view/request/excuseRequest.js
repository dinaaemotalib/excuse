import { postNewExcuse } from "../../controller/Excuse.js";

//all inputs
let form = document.getElementById("excuseType");
let excuseType = document.getElementById("excuseType");
let excuseDate = document.getElementById("excuseDate");
let startexcuse = document.getElementById("fromTime");
let endexcuse = document.getElementById("toTime");
let excuseReason = document.getElementById("excuseReason");
let excuseApprovalCode = document.getElementById("excuseRequestSelectOption");

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("excusebtn").addEventListener("click", async () => {
    // if (
    //   excuseType.value === "" ||
    //   excuseDate.value === "" ||
    //   startexcuse.value === "" ||
    //   endexcuse.value === "" ||
    //   excuseApprovalCode.value === ""
    // ) {
    //   alert("Please, fill out all fields");
    //   return;
    // }

    await postNewExcuse(
      excuseType.value,
      excuseDate.value,
      startexcuse.value,
      endexcuse.value,
      excuseReason.value,
      excuseApprovalCode.value
    );

    // displayRequests();
    //clear the form
    excuseclearform();
  });
});

function excuseclearform() {
  excuseType.value = null;
  excuseDate.value = null;
  startexcuse.value = null;
  endexcuse.value = null;
  excuseReason.value = null;
  excuseApprovalCode.value = null;
}

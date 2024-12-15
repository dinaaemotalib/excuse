// Functions
import { getAllUsers } from "../controller/User.js";
import { getAllPendingExcusesForApproval, changeExcuseStatus } from "../controller/Excuse.js";
import { getAllPendingLeavesForApproval, changeLeaveStatus } from "../controller/Leave.js";
// Variables
import { ROLE_CO, ROLE_EMPLOYEE, ROLE_HR, ROLE_SENIOR, STATUS_ACCEPTED, STATUS_DECLINED } from "../utils/constants.js";
import { LOGGING_USER } from "../utils/global.js";

// Accept/Reject Requests
let pendingExcusesByApproval;
let pendingLeavesByApproval;
document.addEventListener("DOMContentLoaded", async function () {
  if (LOGGING_USER.role === ROLE_SENIOR || LOGGING_USER.role === ROLE_CO) {
    pendingExcusesByApproval = await getAllPendingExcusesForApproval();
    pendingLeavesByApproval = await getAllPendingLeavesForApproval();
    if (pendingExcusesByApproval.length === 0 && pendingLeavesByApproval.length === 0) {
      document.getElementById("notification-content").innerHTML = "No Pending Requests";
      document.getElementById("notification-red-ball").style.display = "none";
      return;
    }

    renderExcusesAndLeaves();
  }
});

document.body.addEventListener("click", async (event) => {
  // Check if the clicked element matches the selector
  if (event.target.matches(".accept-excuse")) {
    const clickedButton = event.target;
    const excuseId = clickedButton.dataset.excuseid;

    // Call your function and pass the excuseId
    await changeExcuseStatus(Number(excuseId), STATUS_ACCEPTED);
    pendingExcusesByApproval = pendingExcusesByApproval.filter(
      (excuse) => Number(excuse.excuse_id) !== Number(excuseId)
    );
    renderExcusesAndLeaves();
  }

  if (event.target.matches(".reject-excuse")) {
    const clickedButton = event.target;
    const excuseId = clickedButton.dataset.excuseid;

    // Call your function and pass the excuseId
    await changeExcuseStatus(excuseId, STATUS_DECLINED);
    pendingExcusesByApproval = pendingExcusesByApproval.filter(
      (excuse) => Number(excuse.excuse_id) !== Number(excuseId)
    );
    renderExcusesAndLeaves();
  }

  if (event.target.matches(".accept-leave")) {
    const clickedButton = event.target;
    const leaveId = clickedButton.dataset.leaveid;

    // Call your function and pass the leaveId
    await changeLeaveStatus(leaveId, STATUS_ACCEPTED);
    pendingLeavesByApproval = pendingLeavesByApproval.filter((leave) => Number(leave.leave_id) !== Number(leaveId));
    renderExcusesAndLeaves();
  }

  if (event.target.matches(".reject-leave")) {
    const clickedButton = event.target;
    const leaveId = clickedButton.dataset.leaveid;

    // Call your function and pass the leaveId
    await changeLeaveStatus(leaveId, STATUS_DECLINED);
    pendingLeavesByApproval = pendingLeavesByApproval.filter((leave) => Number(leave.leave_id) !== Number(leaveId));
    renderExcusesAndLeaves();
  }
});

// ----

// RENDER

function renderExcusesAndLeaves() {
  const notificationContent = document.getElementById("notification-content");

  let renderedContent = "";
  pendingExcusesByApproval.forEach((excuse) => {
    renderedContent += viewPendingExcuse(excuse);
  });
  notificationContent.innerHTML = "";
  notificationContent.innerHTML += renderedContent;

  if (pendingLeavesByApproval.length > 0) {
    renderedContent = "";
    if (pendingExcusesByApproval.length > 0) notificationContent.innerHTML += "<hr style='margin-top: 8px' />";
    pendingLeavesByApproval.forEach((leave) => {
      renderedContent += viewPendingLeave(leave);
    });
    notificationContent.innerHTML += renderedContent;
  }
}

function viewPendingExcuse(excuse) {
  return `
          <div class="notification-list_content d-flex align-items-start" id="notification-excuse-${excuse.excuse_id}">
            <div class="notification-list_img me-3">
              <img src="images/profile.png" alt="user" class="rounded-circle" style="width: 50px; height: 50px" />
            </div>

            <div class="notification-list_detail">
              <p class="text-dark mb-1"><b>${excuse.user_code.name}</b> requests to excuse from ${
    excuse.from_time
  } to ${excuse.to_time}</p>
              <p class="text-muted"><small>${formateDate(excuse.createdAt)}</small></p>
              <div>
                <button class="accept-excuse btn btn-success btn-sm me-2" data-excuseId="${
                  excuse.excuse_id
                }">Accept</button>
                <button class="reject-excuse btn btn-danger btn-sm" data-excuseId="${excuse.excuse_id}">Reject</button>
              </div>
            </div>
          </div>
          `;
}

function viewPendingLeave(leave) {
  return `
          <div class="notification-list_content d-flex align-items-start" id="notification-leave-${leave.leave_id}">
            <div class="notification-list_img me-3">
              <img src="images/profile.png" alt="user" class="rounded-circle" style="width: 50px; height: 50px" />
            </div>

            <div class="notification-list_detail">
              <p class="text-dark mb-1"><b>${leave.user_code.name}</b> requests to leave from ${leave.from_date} to ${
    leave.to_date
  }</p>
              <p class="text-muted"><small>${formateDate(leave.createdAt)}</small></p>
              <div>
                <button class="accept-leave btn btn-success btn-sm me-2" data-leaveId="${
                  leave.leave_id
                }">Accept</button>
                <button class="reject-leave btn btn-danger btn-sm" data-leaveId="${leave.leave_id}">Reject</button>
              </div>
            </div>
          </div>
          `;
}

// utils

function formateDate(dateString) {
  const date = new Date(dateString);

  // Format the date as `YYYY-MM-DD - HH:MM`
  return date
    .toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // Use 24-hour format
    })
    .replace(",", "")
    .replace("/", "-")
    .replace("/", "-");
}

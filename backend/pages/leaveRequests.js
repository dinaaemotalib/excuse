import { getAllLeaves, getAllLeavesByUser } from "../controller/Leave.js";
import {
  ROLE_CO,
  ROLE_EMPLOYEE,
  ROLE_HR,
  ROLE_SENIOR,
  STATUS_ACCEPTED,
  STATUS_DECLINED,
  STATUS_PENDING,
} from "../utils/constants.js";
import { LOGGING_USER } from "../utils/global.js";

const leavesTable = document.getElementById("myLeave");

document.addEventListener("DOMContentLoaded", async function () {
  if (LOGGING_USER === null) {
    window.location.href = "loginform.html";
  }
  try {
    if (LOGGING_USER.role === ROLE_EMPLOYEE || LOGGING_USER.role === ROLE_SENIOR || LOGGING_USER.role === ROLE_HR) {
      const leaves = await getAllLeavesByUser();
      leaves.sort((a, b) => new Date(b.from_date) - new Date(a.from_date));
      let rows = "";
      leaves.forEach((leave) => {
        rows += renderLeave(leave, false);
      });
      document.getElementById("leave-table-head").innerHTML = renderLeaveTableHead(false);
      leavesTable.innerHTML += rows;
    }
    if (LOGGING_USER.role === ROLE_CO) {
      const leaves = await getAllLeaves(new Date().getFullYear());
      leaves.sort((a, b) => new Date(b.from_date) - new Date(a.from_date));
      let rows = "";
      leaves.forEach((leave) => {
        rows += renderLeave(leave, true);
      });
      document.getElementById("leave-table-head").innerHTML = renderLeaveTableHead(true);
      leavesTable.innerHTML += rows;
    }
  } catch (error) {
    console.log("Failed to Fetch Leaves");
    console.log("ERROR:", error);
  }
});

function renderLeave(leave, includeName) {
  console.log(leave);
  let alert = "light";
  if (leave.status === STATUS_PENDING) {
    alert = "warning";
  } else if (leave.status === STATUS_ACCEPTED) {
    alert = "success";
  } else if (leave.status === STATUS_DECLINED) {
    alert = "danger";
  }

  const duration = (new Date(leave.to_date) - new Date(leave.from_date)) / 86400_000;

  return `<tr>
            ${includeName ? '<td class="text-center">' + leave.user_code.name + "</td>" : ""}
            <td class="text-center">${leave.type}</td>
            <td class="text-center">${leave.from_date}</td>
            <td class="text-center">${leave.to_date}</span></td>
            <td class="text-center">${leave.reason}</span></td>
            <td class="text-center">${leave.approval_code.email}</span></td>
            <td class="text-center"><div class="alert alert-${alert} m-0 p-0" role="alert">${
    leave.status
  }</div></span></td>
            <td class="text-center">${duration} days</span></td>
          </tr>
  `;
}

function renderLeaveTableHead(includeName) {
  return `
      <tr>
        ${includeName ? '<th class="text-center">Requester Name</th>' : ""}
        <th scope="col">Type</th>
        <th scope="col">Start Date</th>
        <th scope="col">End Date</th>
        <th scope="col">Reason</th>
        <th scope="col">Approval Name</th>
        <th scope="col">Status</th>
        <th scope="col">Days / Duration</th>
      </tr>`;
}
